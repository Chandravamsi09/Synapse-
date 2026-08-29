/**
 * Synapse API Usage Metering, Tier Limit Enforcement and Overages
 */

export interface TierQuota {
  tierName: 'COMMUNITY_FREE' | 'DEVELOPER_PRO' | 'BUSINESS_GROWTH' | 'ENTERPRISE_CUSTOM';
  monthlyRequestLimit: number;
  rateLimitRps: number;
  pricePerThousandOverages: number;
  features: string[];
}

export const TIER_DEFINITIONS: Record<string, TierQuota> = {
  COMMUNITY_FREE: {
    tierName: 'COMMUNITY_FREE',
    monthlyRequestLimit: 100000,
    rateLimitRps: 20,
    pricePerThousandOverages: 0.0, // Hard limit, no overage allowed
    features: ['Up to 3 APIs', 'Community Connectors', '24h Log Retention']
  },
  DEVELOPER_PRO: {
    tierName: 'DEVELOPER_PRO',
    monthlyRequestLimit: 2000000,
    rateLimitRps: 150,
    pricePerThousandOverages: 0.20,
    features: ['Unlimited APIs', 'All Standard Connectors', '30-Day Metrics', 'Webhook DLQ']
  },
  BUSINESS_GROWTH: {
    tierName: 'BUSINESS_GROWTH',
    monthlyRequestLimit: 25000000,
    rateLimitRps: 1000,
    pricePerThousandOverages: 0.15,
    features: ['Custom Domains', 'Advanced RBAC', '90-Day Metrics', '99.9% SLA', 'Priority Support']
  },
  ENTERPRISE_CUSTOM: {
    tierName: 'ENTERPRISE_CUSTOM',
    monthlyRequestLimit: 500000000,
    rateLimitRps: 10000,
    pricePerThousandOverages: 0.08,
    features: ['Dedicated VPC Gateways', 'Multi-Region Routing', 'SSO/SAML/Okta', 'Custom SLAs', 'Audit Archival']
  }
};

export class MeteringService {
  private orgUsage: Map<string, { currentMonthCount: number; lastResetDate: string }> = new Map();

  recordRequest(orgId: string, count: number = 1): { allowed: boolean; usage: number; limit: number; tier: string } {
    const tier = 'DEVELOPER_PRO';
    const quota = TIER_DEFINITIONS[tier];

    let record = this.orgUsage.get(orgId);
    if (!record) {
      record = { currentMonthCount: 0, lastResetDate: new Date().toISOString().substring(0, 7) };
      this.orgUsage.set(orgId, record);
    }

    record.currentMonthCount += count;

    const allowed = record.currentMonthCount <= quota.monthlyRequestLimit || quota.pricePerThousandOverages > 0;

    return {
      allowed,
      usage: record.currentMonthCount,
      limit: quota.monthlyRequestLimit,
      tier
    };
  }

  getUsageReport(orgId: string): { usage: number; limit: number; percentUsed: number; overageCost: number } {
    const record = this.orgUsage.get(orgId) || { currentMonthCount: 0, lastResetDate: '' };
    const tier = 'DEVELOPER_PRO';
    const quota = TIER_DEFINITIONS[tier];

    const percentUsed = (record.currentMonthCount / quota.monthlyRequestLimit) * 100;
    const overages = Math.max(0, record.currentMonthCount - quota.monthlyRequestLimit);
    const overageCost = (overages / 1000) * quota.pricePerThousandOverages;

    return {
      usage: record.currentMonthCount,
      limit: quota.monthlyRequestLimit,
      percentUsed: parseFloat(percentUsed.toFixed(2)),
      overageCost: parseFloat(overageCost.toFixed(2))
    };
  }
}
