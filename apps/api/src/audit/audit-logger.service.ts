/**
 * Synapse Compliance & Immutable Audit Logging Service
 */

import * as crypto from 'crypto';

export interface AuditRecord {
  id: string;
  organizationId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  timestamp: string;
  changes?: Record<string, any>;
  signature: string;
}

export class AuditLoggerService {
  private logTrail: AuditRecord[] = [];
  private signingSecret: string;

  constructor(secret: string = 'synapse_immutable_audit_signing_secret_2026') {
    this.signingSecret = secret;
  }

  log(data: Omit<AuditRecord, 'id' | 'timestamp' | 'signature'>): AuditRecord {
    const id = 'aud_' + Math.random().toString(36).substring(2, 12);
    const timestamp = new Date().toISOString();

    const rawContent = `${id}|${data.organizationId}|${data.action}|${data.resourceId}|${timestamp}`;
    const signature = crypto.createHmac('sha256', this.signingSecret).update(rawContent).digest('hex');

    const record: AuditRecord = {
      ...data,
      id,
      timestamp,
      signature
    };

    this.logTrail.unshift(record);
    return record;
  }

  getAuditTrail(orgId: string, limit: number = 50): AuditRecord[] {
    return this.logTrail.filter(r => r.organizationId === orgId).slice(0, limit);
  }

  verifyRecordIntegrity(record: AuditRecord): boolean {
    const rawContent = `${record.id}|${record.organizationId}|${record.action}|${record.resourceId}|${record.timestamp}`;
    const expected = crypto.createHmac('sha256', this.signingSecret).update(rawContent).digest('hex');
    return record.signature === expected;
  }
}
