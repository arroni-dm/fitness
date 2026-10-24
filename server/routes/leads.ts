import crypto from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { leadSubmissionSchema } from '../validation/leadSchema.ts';
import {
  getStorageBackendInfo,
  isDuplicateSubmission,
  listStoredLeads,
  saveLeadRecord,
  updateLeadDeliveryResult,
} from '../services/leadStorage.ts';
import {
  deliverLeadNotifications,
  getDeliveryReadiness,
} from '../services/leadDelivery.ts';

export const leadsRouter = Router();

// Simple in-memory per-IP sliding window rate limiter (max 6 submissions per 15 minutes)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const ipSubmissionTimestamps = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (ipSubmissionTimestamps.get(ip) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipSubmissionTimestamps.set(ip, recent);
    return true;
  }
  recent.push(now);
  ipSubmissionTimestamps.set(ip, recent);
  return false;
}

function verifyAdminToken(authHeader: string | undefined): boolean {
  const configuredToken = (process.env.ADMIN_API_TOKEN || '').trim();
  if (!configuredToken || configuredToken.length < 12) {
    return false;
  }
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const provided = authHeader.slice('Bearer '.length).trim();
  const expectedBuf = Buffer.from(configuredToken, 'utf-8');
  const providedBuf = Buffer.from(provided, 'utf-8');
  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

// Public non-sensitive site & delivery configuration endpoint
leadsRouter.get('/config', async (_req: Request, res: Response) => {
  const storageInfo = await getStorageBackendInfo();
  const deliveryReadiness = getDeliveryReadiness();

  const rawPhone = (process.env.BUSINESS_PHONE || '').trim();
  const rawEmail = (process.env.BUSINESS_EMAIL || '').trim();
  const rawName = (process.env.BUSINESS_NAME || '').trim();
  const rawSiteUrl = (process.env.PUBLIC_SITE_URL || process.env.APP_URL || '').trim();

  res.status(200).json({
    businessName: rawName || null,
    businessPhone: rawPhone || null,
    businessEmail: rawEmail || null,
    publicSiteUrl:
      rawSiteUrl && rawSiteUrl !== 'MY_APP_URL' ? rawSiteUrl : null,
    delivery: {
      persistentStorageBackend: storageInfo.backend,
      webhookConfigured: deliveryReadiness.webhookConfigured,
      emailConfigured: deliveryReadiness.emailConfigured,
      missingOptionalEnvVars: deliveryReadiness.missingOptionalEnvVars,
    },
  });
});

// Primary Lead Submission Endpoint
leadsRouter.post('/leads', async (req: Request, res: Response) => {
  const clientIp = getClientIp(req);

  if (isRateLimited(clientIp)) {
    res.status(429).json({
      ok: false,
      code: 'RATE_LIMITED',
      message:
        'Too many inquiries submitted recently from this connection. Please wait a few minutes and try again.',
    });
    return;
  }

  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({
      ok: false,
      code: 'INVALID_PAYLOAD',
      message: 'Malformed request body. Please check the form fields and try again.',
    });
    return;
  }

  // Honeypot check: bots fill hidden fields
  if (typeof req.body.companyWebsite === 'string' && req.body.companyWebsite.trim().length > 0) {
    res.status(400).json({
      ok: false,
      code: 'SPAM_REJECTED',
      message: 'Unable to process automated submission.',
    });
    return;
  }

  // Fast-bot timing check (reject submissions completed in < 1.2s after form render when provided)
  if (
    typeof req.body.formStartedAt === 'number' &&
    Date.now() - req.body.formStartedAt < 1200 &&
    Date.now() >= req.body.formStartedAt
  ) {
    res.status(400).json({
      ok: false,
      code: 'SPAM_REJECTED',
      message: 'Submission arrived too quickly. Please review your details and submit again.',
    });
    return;
  }

  const parsed = leadSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const pathKey = issue.path[0] ? String(issue.path[0]) : 'form';
      if (!fieldErrors[pathKey]) {
        fieldErrors[pathKey] = issue.message;
      }
    }

    res.status(422).json({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Please correct the highlighted fields before submitting.',
      fieldErrors,
    });
    return;
  }

  const cleanData = parsed.data;

  try {
    const duplicate = await isDuplicateSubmission(
      cleanData.email,
      cleanData.primaryGoal,
      cleanData.preferredProgram,
      5
    );

    if (duplicate) {
      res.status(409).json({
        ok: false,
        code: 'DUPLICATE_SUBMISSION',
        message:
          'We already received this inquiry within the last few minutes. There is no need to submit again.',
      });
      return;
    }

    const storedRecord = await saveLeadRecord(cleanData);
    const deliveryOutcome = await deliverLeadNotifications(storedRecord);

    await updateLeadDeliveryResult(storedRecord.id, {
      webhookDelivered: deliveryOutcome.webhookDelivered,
      emailDelivered: deliveryOutcome.emailDelivered,
    });

    // Privacy-safe operational log: logs non-PII metadata only
    console.info(
      `[leads] Stored inquiry ${storedRecord.id} | program="${storedRecord.preferredProgram}" | goal="${storedRecord.primaryGoal}"`
    );

    res.status(201).json({
      ok: true,
      inquiryId: storedRecord.id,
      receivedAt: storedRecord.createdAt,
      delivery: {
        storedPersistently: deliveryOutcome.storedPersistently,
        webhookDelivered: deliveryOutcome.webhookDelivered,
        emailDelivered: deliveryOutcome.emailDelivered,
      },
    });
  } catch {
    console.error('[leads] Failed to persist inquiry');
    res.status(500).json({
      ok: false,
      code: 'SERVER_ERROR',
      message:
        'A temporary server error prevented us from saving your inquiry. Your form entries have been kept—please try again.',
    });
  }
});

// Protected Lead Retrieval Endpoint — blocks unauthorized access to stored personal data
leadsRouter.get('/leads', async (req: Request, res: Response) => {
  const configuredToken = (process.env.ADMIN_API_TOKEN || '').trim();
  if (!configuredToken || configuredToken.length < 12) {
    res.status(403).json({
      ok: false,
      code: 'ADMIN_ACCESS_NOT_CONFIGURED',
      message:
        'Lead listing requires ADMIN_API_TOKEN (minimum 12 characters) configured on the server.',
    });
    return;
  }

  if (!verifyAdminToken(req.headers.authorization)) {
    res.status(401).json({
      ok: false,
      code: 'UNAUTHORIZED',
      message: 'Valid Bearer ADMIN_API_TOKEN is required to access stored inquiries.',
    });
    return;
  }

  const limitParam = Number(req.query.limit) || 100;
  const leads = await listStoredLeads(limitParam);
  res.status(200).json({
    ok: true,
    count: leads.length,
    leads,
  });
});
