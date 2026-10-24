import type { StoredLeadRecord } from './leadStorage.ts';

export interface LeadDeliveryOutcome {
  storedPersistently: boolean;
  webhookConfigured: boolean;
  webhookDelivered: boolean;
  emailConfigured: boolean;
  emailDelivered: boolean;
  missingOptionalEnvVars: string[];
}

export function getDeliveryReadiness() {
  const webhookUrl = (process.env.LEAD_WEBHOOK_URL || '').trim();
  const emailApiKey = (process.env.EMAIL_SERVICE_API_KEY || '').trim();
  const notificationEmail = (process.env.LEAD_NOTIFICATION_EMAIL || '').trim();

  const webhookConfigured = webhookUrl.startsWith('https://') || webhookUrl.startsWith('http://');
  const emailConfigured =
    Boolean(emailApiKey) &&
    emailApiKey !== 'MY_EMAIL_API_KEY' &&
    Boolean(notificationEmail) &&
    notificationEmail.includes('@');

  const missingOptionalEnvVars: string[] = [];
  if (!webhookConfigured) {
    missingOptionalEnvVars.push('LEAD_WEBHOOK_URL');
  }
  if (!emailConfigured) {
    if (!emailApiKey) missingOptionalEnvVars.push('EMAIL_SERVICE_API_KEY');
    if (!notificationEmail) missingOptionalEnvVars.push('LEAD_NOTIFICATION_EMAIL');
  }

  return {
    webhookConfigured,
    emailConfigured,
    missingOptionalEnvVars,
  };
}

export async function deliverLeadNotifications(
  record: StoredLeadRecord
): Promise<LeadDeliveryOutcome> {
  const readiness = getDeliveryReadiness();
  let webhookDelivered = false;
  let emailDelivered = false;

  // 1. Optional CRM / Webhook forwarding
  if (readiness.webhookConfigured && process.env.LEAD_WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.LEAD_WEBHOOK_URL.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'coaching_lead_received',
          leadId: record.id,
          createdAt: record.createdAt,
          lead: {
            fullName: record.fullName,
            email: record.email,
            phone: record.phone,
            primaryGoal: record.primaryGoal,
            preferredProgram: record.preferredProgram,
            experienceLevel: record.experienceLevel,
            preferredContactMethod: record.preferredContactMethod,
            bestTimeToContact: record.bestTimeToContact,
            additionalInfo: record.additionalInfo,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });
      webhookDelivered = response.ok;
    } catch {
      webhookDelivered = false;
    }
  }

  // 2. Optional Transactional Email Notification (Resend-compatible HTTPS endpoint)
  if (
    readiness.emailConfigured &&
    process.env.EMAIL_SERVICE_API_KEY &&
    process.env.LEAD_NOTIFICATION_EMAIL
  ) {
    try {
      const businessName = (process.env.BUSINESS_NAME || 'Online Fitness Coaching').trim();
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.EMAIL_SERVICE_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${businessName.replace(/[[\]]/g, '') || 'Coaching Inquiry'} <onboarding@resend.dev>`,
          to: [process.env.LEAD_NOTIFICATION_EMAIL.trim()],
          reply_to: record.email,
          subject: `New Coaching Inquiry — ${record.preferredProgram} (${record.primaryGoal})`,
          text: [
            `Inquiry ID: ${record.id}`,
            `Submitted: ${record.createdAt}`,
            `Name: ${record.fullName}`,
            `Email: ${record.email}`,
            `Phone: ${record.phone}`,
            `Primary Goal: ${record.primaryGoal}`,
            `Preferred Program: ${record.preferredProgram}`,
            `Experience Level: ${record.experienceLevel}`,
            `Preferred Contact Method: ${record.preferredContactMethod}`,
            `Best Time to Contact: ${record.bestTimeToContact}`,
            `Additional Notes: ${record.additionalInfo || 'None provided'}`,
          ].join('\n'),
        }),
        signal: AbortSignal.timeout(6000),
      });
      emailDelivered = response.ok;
    } catch {
      emailDelivered = false;
    }
  }

  return {
    storedPersistently: true,
    webhookConfigured: readiness.webhookConfigured,
    webhookDelivered,
    emailConfigured: readiness.emailConfigured,
    emailDelivered,
    missingOptionalEnvVars: readiness.missingOptionalEnvVars,
  };
}
