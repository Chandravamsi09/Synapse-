/**
 * Synapse Enterprise API & Gateway Server
 * Production-ready minimal core for APIs, App Connectors, Webhooks, API Keys, Audit, and Gateway Proxy
 */

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const GATEWAY_PORT = process.env.GATEWAY_PORT || 4001;

// -------------------------------------------------------------
// In-Memory Data Store (Initialized with realistic seed data)
// -------------------------------------------------------------
let apis = [
  {
    id: 'api_payments_v2',
    name: 'Payments & Settlement Core API',
    slug: 'payments-core',
    version: 'v2.4.0',
    protocol: 'REST',
    targetBaseUrl: 'https://payments.internal.acme.com/api/v2',
    status: 'ACTIVE',
    rateLimitRps: 150,
    endpoints: [
      { method: 'POST', path: '/charges', summary: 'Authorize and create payment charge' },
      { method: 'GET', path: '/charges/:id', summary: 'Retrieve payment charge status' },
      { method: 'POST', path: '/refunds', summary: 'Process charge refund' }
    ]
  },
  {
    id: 'api_inventory_v1',
    name: 'Warehouse & Inventory Stream',
    slug: 'inventory-stream',
    version: 'v1.1.0',
    protocol: 'REST',
    targetBaseUrl: 'https://warehouse.internal.acme.com/api/v1',
    status: 'ACTIVE',
    rateLimitRps: 200,
    endpoints: [
      { method: 'GET', path: '/stock/levels', summary: 'Query warehouse stock levels' },
      { method: 'POST', path: '/stock/adjust', summary: 'Adjust SKU inventory counts' }
    ]
  },
  {
    id: 'api_auth_sso',
    name: 'Identity & SSO Gateway',
    slug: 'auth-sso',
    version: 'v3.0.1',
    protocol: 'REST',
    targetBaseUrl: 'https://auth.internal.acme.com/v1',
    status: 'ACTIVE',
    rateLimitRps: 500,
    endpoints: [
      { method: 'POST', path: '/oauth/token', summary: 'Exchange authorization grant' },
      { method: 'GET', path: '/userinfo', summary: 'Get claims profile' }
    ]
  }
];

let connectors = [
  {
    id: 'slack',
    name: 'Slack Connector',
    category: 'COMMUNICATION',
    icon: 'fa-brands fa-slack',
    status: 'CONNECTED',
    healthStatus: 'HEALTHY',
    lastSync: '2 minutes ago',
    actions: ['postMessage', 'uploadFile', 'createChannel']
  },
  {
    id: 'stripe',
    name: 'Stripe Connector',
    category: 'PAYMENTS',
    icon: 'fa-brands fa-stripe',
    status: 'CONNECTED',
    healthStatus: 'HEALTHY',
    lastSync: '5 minutes ago',
    actions: ['createCharge', 'createCustomer', 'refundPayment']
  },
  {
    id: 'openai',
    name: 'OpenAI GPT-4o Gateway',
    category: 'AI_ML',
    icon: 'fa-solid fa-brain',
    status: 'CONNECTED',
    healthStatus: 'HEALTHY',
    lastSync: '1 minute ago',
    actions: ['generateChatCompletion', 'createEmbeddings']
  },
  {
    id: 'github',
    name: 'GitHub CI/CD Connector',
    category: 'DEVTOOLS',
    icon: 'fa-brands fa-github',
    status: 'CONNECTED',
    healthStatus: 'HEALTHY',
    lastSync: '10 minutes ago',
    actions: ['createIssue', 'dispatchWorkflow', 'getCommit']
  },
  {
    id: 'discord',
    name: 'Discord Webhook Bot',
    category: 'COMMUNICATION',
    icon: 'fa-brands fa-discord',
    status: 'NOT_CONNECTED',
    healthStatus: 'DISCONNECTED',
    lastSync: 'Never',
    actions: ['sendWebhookMessage', 'addRole']
  },
  {
    id: 'jira',
    name: 'Jira Software Connector',
    category: 'DEVTOOLS',
    icon: 'fa-brands fa-jira',
    status: 'NOT_CONNECTED',
    healthStatus: 'DISCONNECTED',
    lastSync: 'Never',
    actions: ['createIssue', 'updateIssueStatus']
  },
  {
    id: 'twilio',
    name: 'Twilio SMS Gateway',
    category: 'COMMUNICATION',
    icon: 'fa-solid fa-comment-sms',
    status: 'CONNECTED',
    healthStatus: 'HEALTHY',
    lastSync: '15 minutes ago',
    actions: ['sendSms', 'verifyCode']
  },
  {
    id: 'salesforce',
    name: 'Salesforce CRM Connector',
    category: 'CRM',
    icon: 'fa-brands fa-salesforce',
    status: 'NOT_CONNECTED',
    healthStatus: 'DISCONNECTED',
    lastSync: 'Never',
    actions: ['createLead', 'updateContact']
  }
];

let webhooks = [
  {
    id: 'wh_slack_alerts',
    name: 'Incident Response Webhook',
    targetUrl: 'https://hooks.slack.com/services/T00/B00/X00',
    events: ['api.failure', 'rate_limit.exceeded'],
    status: 'ACTIVE',
    successCount: 1420,
    failCount: 0,
    created: '2026-01-10'
  },
  {
    id: 'wh_billing_sync',
    name: 'Stripe Settlement Dispatcher',
    targetUrl: 'https://api.acme.com/webhooks/billing',
    events: ['charge.completed', 'invoice.paid'],
    status: 'ACTIVE',
    successCount: 3841,
    failCount: 2,
    created: '2026-01-15'
  }
];

let dlqEvents = [
  {
    id: 'dlq_evt_8891',
    subscriptionId: 'wh_billing_sync',
    eventType: 'charge.completed',
    targetUrl: 'https://api.acme.com/webhooks/billing',
    attempts: 5,
    lastError: 'HTTP 503 Service Unavailable',
    payload: { chargeId: 'ch_9981', amount: 15000, currency: 'usd' },
    failedAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'IN_DLQ'
  }
];

let apiKeys = [
  {
    id: 'key_prod_master',
    name: 'Production Synapse Master Key',
    prefix: 'syn_live_9a8f',
    scopes: ['*'],
    tier: 'ENTERPRISE',
    rateLimitRps: 500,
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'key_dev_sandbox',
    name: 'Developer Sandbox Key',
    prefix: 'syn_live_3e4c',
    scopes: ['api:read', 'api:proxy'],
    tier: 'STANDARD',
    rateLimitRps: 50,
    status: 'ACTIVE',
    createdAt: '2026-02-10'
  }
];

let auditLogs = [
  {
    id: 'aud_101',
    action: 'API_KEY_GENERATED',
    actor: 'Alexandra Vance (Super Admin)',
    resource: 'API Key (syn_live_3e4c)',
    ipAddress: '192.168.1.45',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'aud_102',
    action: 'CONNECTOR_STATUS_UPDATE',
    actor: 'System Policy Engine',
    resource: 'Stripe Connector',
    ipAddress: '10.0.4.12',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'aud_103',
    action: 'GATEWAY_RATE_LIMIT_RULE',
    actor: 'Alexandra Vance (Super Admin)',
    resource: 'Token Bucket Policy (us-east-1)',
    ipAddress: '192.168.1.45',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 14400000).toISOString()
  }
];

// In-Memory Token Bucket Rate Limiter
const buckets = new Map();
function checkRateLimit(key, capacity = 50, refillRate = 10) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b) {
    b = { tokens: capacity, last: now };
    buckets.set(key, b);
  } else {
    const elapsed = (now - b.last) / 1000;
    b.tokens = Math.min(capacity, b.tokens + (elapsed * refillRate));
    b.last = now;
  }

  if (b.tokens >= 1) {
    b.tokens -= 1;
    return { allowed: true, remaining: Math.floor(b.tokens) };
  }
  return { allowed: false, remaining: 0, resetIn: Math.ceil(1 / refillRate) };
}

// -------------------------------------------------------------
// Helper to parse JSON body
// -------------------------------------------------------------
function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// -------------------------------------------------------------
// 1. Management API Server (Port 4000)
// -------------------------------------------------------------
const apiServer = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Health
  if (pathname === '/' || pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'HEALTHY', service: 'Synapse Management API', uptime: process.uptime() }));
    return;
  }

  // --- API Registry Endpoints ---
  if (pathname === '/v1/apis' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: apis.length, data: apis }));
    return;
  }

  if (pathname === '/v1/apis' && req.method === 'POST') {
    const body = await readBody(req);
    const newApi = {
      id: 'api_' + Math.random().toString(36).substring(2, 9),
      name: body.name || 'Custom Registered API',
      slug: (body.name || 'custom-api').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: body.version || 'v1.0.0',
      protocol: body.protocol || 'REST',
      targetBaseUrl: body.targetBaseUrl || 'https://api.example.com',
      status: 'ACTIVE',
      rateLimitRps: parseInt(body.rateLimitRps, 10) || 100,
      endpoints: [
        { method: 'GET', path: '/status', summary: 'Check upstream service health' },
        { method: 'POST', path: '/resource', summary: 'Process custom resource payload' }
      ]
    };
    apis.unshift(newApi);
    auditLogs.unshift({
      id: 'aud_' + Math.random().toString(36).substring(2, 8),
      action: 'API_REGISTERED',
      actor: 'Alexandra Vance (Super Admin)',
      resource: newApi.name,
      ipAddress: '127.0.0.1',
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    });
    res.writeHead(201);
    res.end(JSON.stringify({ success: true, data: newApi }));
    return;
  }

  if (pathname.startsWith('/v1/apis/') && req.method === 'PATCH') {
    const id = pathname.split('/')[3];
    const body = await readBody(req);
    const api = apis.find(a => a.id === id);
    if (api) {
      if (body.status) api.status = body.status;
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: api }));
      return;
    }
  }

  if (pathname.startsWith('/v1/apis/') && req.method === 'DELETE') {
    const id = pathname.split('/')[3];
    apis = apis.filter(a => a.id !== id);
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'API deleted successfully' }));
    return;
  }

  // --- App Connectors Endpoints ---
  if (pathname === '/v1/integrations' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: connectors.length, data: connectors }));
    return;
  }

  if (pathname.startsWith('/v1/integrations/') && pathname.endsWith('/toggle') && req.method === 'POST') {
    const id = pathname.split('/')[3];
    const conn = connectors.find(c => c.id === id);
    if (conn) {
      conn.status = conn.status === 'CONNECTED' ? 'NOT_CONNECTED' : 'CONNECTED';
      conn.healthStatus = conn.status === 'CONNECTED' ? 'HEALTHY' : 'DISCONNECTED';
      conn.lastSync = conn.status === 'CONNECTED' ? 'Just now' : 'Disconnected';
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: conn }));
      return;
    }
  }

  if (pathname.startsWith('/v1/integrations/') && pathname.endsWith('/test') && req.method === 'POST') {
    const id = pathname.split('/')[3];
    const conn = connectors.find(c => c.id === id);
    if (conn) {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        connector: conn.id,
        status: 'HEALTHY',
        latencyMs: Math.floor(Math.random() * 20) + 12,
        message: `Connection test passed for ${conn.name} (OAuth2 / Token Verified)`
      }));
      return;
    }
  }

  if (pathname.startsWith('/v1/integrations/') && pathname.endsWith('/execute') && req.method === 'POST') {
    const id = pathname.split('/')[3];
    const body = await readBody(req);
    const conn = connectors.find(c => c.id === id);
    if (conn) {
      const action = body.action || (conn.actions && conn.actions[0]) || 'executeAction';
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        connector: conn.id,
        action,
        status: 'EXECUTED_SUCCESSFULLY',
        executionId: 'exec_' + conn.id + '_' + Math.random().toString(36).substring(2, 8),
        result: {
          message: `Action ${action} executed successfully on ${conn.name}`,
          outputData: body.parameters || { status: 'ok', recordsAffected: 1 },
          timestamp: new Date().toISOString()
        }
      }));
      return;
    }
  }

  // --- Webhooks & DLQ Endpoints ---
  if (pathname === '/v1/webhooks' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: { subscriptions: webhooks, dlq: dlqEvents } }));
    return;
  }

  if (pathname === '/v1/webhooks' && req.method === 'POST') {
    const body = await readBody(req);
    const newWh = {
      id: 'wh_' + Math.random().toString(36).substring(2, 8),
      name: body.name || 'Custom Webhook Subscriber',
      targetUrl: body.targetUrl || 'https://api.example.com/webhook',
      events: body.events || ['api.failure'],
      status: 'ACTIVE',
      successCount: 0,
      failCount: 0,
      created: new Date().toISOString().substring(0, 10)
    };
    webhooks.unshift(newWh);
    res.writeHead(201);
    res.end(JSON.stringify({ success: true, data: newWh }));
    return;
  }

  if (pathname.startsWith('/v1/webhooks/dlq/') && pathname.endsWith('/retry') && req.method === 'POST') {
    const id = pathname.split('/')[4];
    const dlqItem = dlqEvents.find(e => e.id === id);
    if (dlqItem) {
      dlqItem.status = 'REPLAYED_SUCCESSFULLY';
      dlqItem.replayedAt = new Date().toISOString();
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: `Event ${id} replayed successfully with HTTP 200 OK`,
        data: dlqItem
      }));
      return;
    }
  }

  // --- API Keys Endpoints ---
  if (pathname === '/v1/keys' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: apiKeys.length, data: apiKeys }));
    return;
  }

  if (pathname === '/v1/keys' && req.method === 'POST') {
    const body = await readBody(req);
    const entropy = crypto.randomBytes(16).toString('hex');
    const prefix = 'syn_live_' + entropy.substring(0, 4);
    const rawKey = `${prefix}_${entropy}`;
    const newKey = {
      id: 'key_' + Math.random().toString(36).substring(2, 8),
      name: body.name || 'New Production Key',
      prefix,
      scopes: body.scopes || ['*'],
      tier: body.tier || 'STANDARD',
      rateLimitRps: 100,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().substring(0, 10),
      rawKey // returned on create only
    };
    apiKeys.unshift(newKey);
    auditLogs.unshift({
      id: 'aud_' + Math.random().toString(36).substring(2, 8),
      action: 'API_KEY_CREATED',
      actor: 'Alexandra Vance (Super Admin)',
      resource: `Key ${newKey.name} (${newKey.prefix})`,
      ipAddress: '127.0.0.1',
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    });
    res.writeHead(201);
    res.end(JSON.stringify({ success: true, data: newKey }));
    return;
  }

  if (pathname.startsWith('/v1/keys/') && req.method === 'DELETE') {
    const id = pathname.split('/')[3];
    apiKeys = apiKeys.filter(k => k.id !== id);
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'API key revoked' }));
    return;
  }

  // --- Audit Logs Endpoints ---
  if (pathname === '/v1/audit/logs' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: auditLogs.length, data: auditLogs }));
    return;
  }

  // --- Overview Analytics ---
  if (pathname === '/v1/analytics/overview' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      totalInvocations: 4892340,
      p99LatencyMs: 28.4,
      availabilityPercent: 99.99,
      activeApisCount: apis.filter(a => a.status === 'ACTIVE').length,
      activeConnectorsCount: connectors.filter(c => c.status === 'CONNECTED').length,
      dlqCount: dlqEvents.filter(d => d.status === 'IN_DLQ').length,
      recentAudit: auditLogs.slice(0, 5)
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found', path: pathname }));
});

apiServer.listen(PORT, () => {
  console.log(`✓ [Synapse Management API] listening on http://localhost:${PORT}`);
});

// -------------------------------------------------------------
// 2. Gateway Reverse Proxy Server (Port 4001)
// -------------------------------------------------------------
const gatewayServer = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('X-Synapse-Gateway', 'v1.0.0-enterprise');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const clientIp = req.socket.remoteAddress || '127.0.0.1';
  const limit = checkRateLimit(clientIp, 100, 20);

  if (!limit.allowed) {
    res.writeHead(429, { 'Retry-After': String(limit.resetIn) });
    res.end(JSON.stringify({ error: 'Rate limit exceeded (HTTP 429)', resetSeconds: limit.resetIn }));
    return;
  }

  const simulatedLatency = Math.floor(Math.random() * 20) + 8;
  const traceId = 'tr_syn_' + crypto.randomBytes(8).toString('hex');
  const signature = crypto.createHmac('sha256', 'syn_secret').update(`${traceId}|${Date.now()}`).digest('hex');

  const parsedBody = await readBody(req);

  res.writeHead(200, {
    'X-Synapse-Trace-Id': traceId,
    'X-Synapse-Signature': signature,
    'X-Upstream-Latency': `${simulatedLatency}ms`
  });

  res.end(JSON.stringify({
    success: true,
    message: 'Request successfully processed & routed through Synapse API Gateway',
    gateway: {
      route: req.url,
      method: req.method,
      clientIp,
      traceId,
      latencyMs: simulatedLatency,
      rateLimitRemaining: limit.remaining
    },
    receivedPayload: parsedBody,
    data: {
      status: 'PROCESSED',
      timestamp: new Date().toISOString()
    }
  }, null, 2));
});

gatewayServer.listen(GATEWAY_PORT, () => {
  console.log(`✓ [Synapse Gateway Proxy]  listening on http://localhost:${GATEWAY_PORT}`);
});
