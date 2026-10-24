import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { ValidatedLeadSubmission } from '../validation/leadSchema.ts';

export interface StoredLeadRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  primaryGoal: string;
  preferredProgram: string;
  experienceLevel: string;
  preferredContactMethod: string;
  bestTimeToContact: string;
  additionalInfo: string;
  consentAccepted: boolean;
  createdAt: string;
  deliverySummary: {
    webhookDelivered: boolean;
    emailDelivered: boolean;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const JSON_FALLBACK_PATH = path.join(DATA_DIR, 'leads.json');

interface SqliteAdapter {
  insertLead: (record: StoredLeadRecord) => void;
  hasDuplicateWithinWindow: (
    email: string,
    primaryGoal: string,
    preferredProgram: string,
    sinceIso: string
  ) => boolean;
  listAllLeads: (limit: number) => StoredLeadRecord[];
  updateDeliverySummary: (
    id: string,
    summary: { webhookDelivered: boolean; emailDelivered: boolean }
  ) => void;
}

let sqliteAdapter: SqliteAdapter | null = null;
let storageInitialized = false;
let activeBackend: 'sqlite' | 'json-file' = 'json-file';

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function initStorage(): Promise<void> {
  if (storageInitialized) return;
  storageInitialized = true;
  ensureDataDir();

  const dbPath = process.env.SQLITE_DB_PATH
    ? path.resolve(process.cwd(), process.env.SQLITE_DB_PATH)
    : path.join(DATA_DIR, 'leads.sqlite');

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  try {
    const sqliteModule = await import('node:sqlite');
    const db = new sqliteModule.DatabaseSync(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS coaching_leads (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        primary_goal TEXT NOT NULL,
        preferred_program TEXT NOT NULL,
        experience_level TEXT NOT NULL,
        preferred_contact_method TEXT NOT NULL,
        best_time_to_contact TEXT NOT NULL,
        additional_info TEXT NOT NULL,
        consent_accepted INTEGER NOT NULL,
        webhook_delivered INTEGER NOT NULL DEFAULT 0,
        email_delivered INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_leads_email_created ON coaching_leads(email, created_at);
    `);

    const insertStmt = db.prepare(`
      INSERT INTO coaching_leads (
        id, full_name, email, phone, primary_goal, preferred_program,
        experience_level, preferred_contact_method, best_time_to_contact,
        additional_info, consent_accepted, webhook_delivered, email_delivered, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const dupStmt = db.prepare(`
      SELECT id FROM coaching_leads
      WHERE email = ? AND primary_goal = ? AND preferred_program = ? AND created_at >= ?
      LIMIT 1
    `);

    const updateDeliveryStmt = db.prepare(`
      UPDATE coaching_leads
      SET webhook_delivered = ?, email_delivered = ?
      WHERE id = ?
    `);

    const listStmt = db.prepare(`
      SELECT
        id, full_name, email, phone, primary_goal, preferred_program,
        experience_level, preferred_contact_method, best_time_to_contact,
        additional_info, consent_accepted, webhook_delivered, email_delivered, created_at
      FROM coaching_leads
      ORDER BY created_at DESC
      LIMIT ?
    `);

    sqliteAdapter = {
      insertLead: (record) => {
        insertStmt.run(
          record.id,
          record.fullName,
          record.email,
          record.phone,
          record.primaryGoal,
          record.preferredProgram,
          record.experienceLevel,
          record.preferredContactMethod,
          record.bestTimeToContact,
          record.additionalInfo,
          record.consentAccepted ? 1 : 0,
          record.deliverySummary.webhookDelivered ? 1 : 0,
          record.deliverySummary.emailDelivered ? 1 : 0,
          record.createdAt
        );
      },
      hasDuplicateWithinWindow: (email, primaryGoal, preferredProgram, sinceIso) => {
        const row = dupStmt.get(email, primaryGoal, preferredProgram, sinceIso);
        return Boolean(row);
      },
      updateDeliverySummary: (id, summary) => {
        updateDeliveryStmt.run(
          summary.webhookDelivered ? 1 : 0,
          summary.emailDelivered ? 1 : 0,
          id
        );
      },
      listAllLeads: (limit) => {
        const rows = listStmt.all(limit) as Array<Record<string, unknown>>;
        return rows.map((r) => ({
          id: String(r.id),
          fullName: String(r.full_name),
          email: String(r.email),
          phone: String(r.phone),
          primaryGoal: String(r.primary_goal),
          preferredProgram: String(r.preferred_program),
          experienceLevel: String(r.experience_level),
          preferredContactMethod: String(r.preferred_contact_method),
          bestTimeToContact: String(r.best_time_to_contact),
          additionalInfo: String(r.additional_info),
          consentAccepted: Number(r.consent_accepted) === 1,
          createdAt: String(r.created_at),
          deliverySummary: {
            webhookDelivered: Number(r.webhook_delivered) === 1,
            emailDelivered: Number(r.email_delivered) === 1,
          },
        }));
      },
    };
    activeBackend = 'sqlite';
  } catch {
    activeBackend = 'json-file';
    if (!fs.existsSync(JSON_FALLBACK_PATH)) {
      fs.writeFileSync(JSON_FALLBACK_PATH, '[]', 'utf-8');
    }
  }
}

function readJsonLeads(): StoredLeadRecord[] {
  ensureDataDir();
  if (!fs.existsSync(JSON_FALLBACK_PATH)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(JSON_FALLBACK_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredLeadRecord[]) : [];
  } catch {
    return [];
  }
}

function writeJsonLeadsAtomically(records: StoredLeadRecord[]): void {
  ensureDataDir();
  const tempPath = `${JSON_FALLBACK_PATH}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(records, null, 2), 'utf-8');
  fs.renameSync(tempPath, JSON_FALLBACK_PATH);
}

export async function getStorageBackendInfo(): Promise<{ backend: 'sqlite' | 'json-file' }> {
  await initStorage();
  return { backend: activeBackend };
}

export async function isDuplicateSubmission(
  email: string,
  primaryGoal: string,
  preferredProgram: string,
  windowMinutes = 5
): Promise<boolean> {
  await initStorage();
  const sinceIso = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  if (sqliteAdapter) {
    return sqliteAdapter.hasDuplicateWithinWindow(
      email,
      primaryGoal,
      preferredProgram,
      sinceIso
    );
  }

  const existing = readJsonLeads();
  return existing.some(
    (item) =>
      item.email === email &&
      item.primaryGoal === primaryGoal &&
      item.preferredProgram === preferredProgram &&
      item.createdAt >= sinceIso
  );
}

export async function saveLeadRecord(
  input: ValidatedLeadSubmission
): Promise<StoredLeadRecord> {
  await initStorage();

  const record: StoredLeadRecord = {
    id: `lead_${crypto.randomUUID()}`,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    primaryGoal: input.primaryGoal,
    preferredProgram: input.preferredProgram,
    experienceLevel: input.experienceLevel || 'Not specified',
    preferredContactMethod: input.preferredContactMethod,
    bestTimeToContact: input.bestTimeToContact || 'Flexible',
    additionalInfo: input.additionalInfo || '',
    consentAccepted: input.consentAccepted,
    createdAt: new Date().toISOString(),
    deliverySummary: {
      webhookDelivered: false,
      emailDelivered: false,
    },
  };

  if (sqliteAdapter) {
    sqliteAdapter.insertLead(record);
    return record;
  }

  const existing = readJsonLeads();
  existing.unshift(record);
  writeJsonLeadsAtomically(existing);
  return record;
}

export async function updateLeadDeliveryResult(
  id: string,
  summary: { webhookDelivered: boolean; emailDelivered: boolean }
): Promise<void> {
  await initStorage();
  if (sqliteAdapter) {
    sqliteAdapter.updateDeliverySummary(id, summary);
    return;
  }

  const existing = readJsonLeads();
  const idx = existing.findIndex((r) => r.id === id);
  if (idx !== -1) {
    existing[idx] = {
      ...existing[idx],
      deliverySummary: summary,
    };
    writeJsonLeadsAtomically(existing);
  }
}

export async function listStoredLeads(limit = 100): Promise<StoredLeadRecord[]> {
  await initStorage();
  const boundedLimit = Math.max(1, Math.min(limit, 500));
  if (sqliteAdapter) {
    return sqliteAdapter.listAllLeads(boundedLimit);
  }
  return readJsonLeads().slice(0, boundedLimit);
}
