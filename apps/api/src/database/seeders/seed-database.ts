/**
 * Synapse Seed Script: Populates initial organizations, enterprise apps,
 * mock APIs, webhook endpoints, API keys, and demo users.
 */

import { InMemoryRepository } from '../repositories/base.repository';

export interface SeedDataset {
  organizations: any[];
  users: any[];
  apiKeys: any[];
  apis: any[];
  endpoints: any[];
  integrations: any[];
  webhooks: any[];
}

export function generateSeedData(): SeedDataset {
  const orgId = 'org_enterprise_primary';

  return {
    organizations: [
      {
        id: orgId,
        name: 'Acme Global Enterprises',
        slug: 'acme-global',
        description: 'Enterprise API Orchestration and App Integration Hub',
        tier: 'ENTERPRISE_CUSTOM',
        monthlyQuota: 100000000,
        currentUsage: 489230,
        isActive: true,
        createdAt: new Date('2026-01-01T00:00:00Z')
      }
    ],
    users: [
      {
        id: 'usr_admin_01',
        organizationId: orgId,
        email: 'admin@acmeglobal.com',
        passwordHash: 'mock_bcrypt_hash_admin_placeholder',
        firstName: 'Alexandra',
        lastName: 'Vance',
        role: 'SUPER_ADMIN',
        isMfaEnabled: true,
        isActive: true,
        createdAt: new Date('2026-01-01T00:00:00Z')
      },
      {
        id: 'usr_dev_01',
        organizationId: orgId,
        email: 'developer@acmeglobal.com',
        passwordHash: 'mock_bcrypt_hash_dev_placeholder',
        firstName: 'David',
        lastName: 'Chen',
        role: 'DEVELOPER',
        isMfaEnabled: false,
        isActive: true,
        createdAt: new Date('2026-01-05T00:00:00Z')
      }
    ],
    apiKeys: [
      {
        id: 'key_prod_master',
        organizationId: orgId,
        createdById: 'usr_admin_01',
        name: 'Production Synapse Master Key',
        keyPrefix: 'syn_live_9a8f',
        hashedSecret: 'sha256:mock_hashed_secret_entry_01',
        scopes: ['*'],
        allowedIps: ['0.0.0.0/0'],
        requestsPerSec: 500,
        burstLimit: 1000,
        isActive: true,
        createdAt: new Date('2026-01-10T00:00:00Z')
      }
    ],
    apis: [
      {
        id: 'api_payments_v2',
        organizationId: orgId,
        name: 'Payments & Settlement Core API',
        slug: 'payments-core',
        description: 'Multi-currency checkout, escrow, and settlement processing engine',
        protocol: 'REST',
        visibility: 'PRIVATE',
        version: 'v2.4.0',
        targetBaseUrl: 'https://payments.internal.acme.com/api/v2',
        isActive: true,
        createdAt: new Date('2026-01-15T00:00:00Z')
      },
      {
        id: 'api_inventory_v1',
        organizationId: orgId,
        name: 'Warehouse & Inventory Stream',
        slug: 'inventory-stream',
        description: 'Real-time SKU catalog, stock levels, and warehouse fulfillment',
        protocol: 'REST',
        visibility: 'INTERNAL',
        version: 'v1.1.0',
        targetBaseUrl: 'https://warehouse.internal.acme.com/api/v1',
        isActive: true,
        createdAt: new Date('2026-02-01T00:00:00Z')
      }
    ],
    endpoints: [
      {
        id: 'ep_pay_create',
        apiId: 'api_payments_v2',
        pathPattern: '/charges',
        httpMethod: 'POST',
        summary: 'Authorize and create payment charge',
        isAuthRequired: true,
        rateLimitPerMin: 300,
        cacheTtlSeconds: 0,
        isMockEnabled: false
      },
      {
        id: 'ep_pay_get',
        apiId: 'api_payments_v2',
        pathPattern: '/charges/:id',
        httpMethod: 'GET',
        summary: 'Retrieve payment charge status',
        isAuthRequired: true,
        rateLimitPerMin: 1000,
        cacheTtlSeconds: 5,
        isMockEnabled: false
      },
      {
        id: 'ep_inv_list',
        apiId: 'api_inventory_v1',
        pathPattern: '/stock/levels',
        httpMethod: 'GET',
        summary: 'Query warehouse stock levels by SKU',
        isAuthRequired: true,
        rateLimitPerMin: 600,
        cacheTtlSeconds: 30,
        isMockEnabled: false
      }
    ],
    integrations: [
      {
        id: 'int_slack_ops',
        organizationId: orgId,
        appIdentifier: 'slack',
        name: 'DevOps Slack Alerts Connector',
        category: 'COMMUNICATION',
        authType: 'OAUTH2',
        credentialsEnc: 'mock_encrypted_token_slack',
        healthStatus: 'HEALTHY',
        isActive: true
      },
      {
        id: 'int_stripe_prod',
        organizationId: orgId,
        appIdentifier: 'stripe',
        name: 'Stripe Global Billing Connector',
        category: 'PAYMENTS',
        authType: 'API_KEY',
        credentialsEnc: 'mock_encrypted_token_stripe',
        healthStatus: 'HEALTHY',
        isActive: true
      },
      {
        id: 'int_openai_gpt4',
        organizationId: orgId,
        appIdentifier: 'openai',
        name: 'OpenAI Enterprise Gateway',
        category: 'AI_ML',
        authType: 'BEARER',
        credentialsEnc: 'mock_encrypted_token_openai',
        healthStatus: 'HEALTHY',
        isActive: true
      }
    ],
    webhooks: [
      {
        id: 'wh_slack_dispatch',
        organizationId: orgId,
        name: 'Incident Response Webhook',
        targetUrl: 'https://hooks.slack.com/services/T00/B00/X00',
        secretKey: 'mock_webhook_secret_key_ref_01',
        eventTypes: ['api.failure', 'rate_limit.exceeded', 'security.breach_attempt'],
        maxRetries: 5,
        backoffFactor: 2.0,
        isActive: true
      }
    ]
  };
}
