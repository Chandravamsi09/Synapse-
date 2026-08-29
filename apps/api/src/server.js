/**
 * Synapse Main API Server & Gateway Runner
 */

const http = require('http');
const { AuthService } = require('./auth/auth.service');
const { ApiRegistryService } = require('./api-registry/api-registry.service');
const { RateLimiterService } = require('./gateway/rate-limiter.service');
const { ProxyEngineService } = require('./gateway/proxy-engine.service');
const { TelemetryAggregatorService } = require('./analytics/telemetry-aggregator.service');
const { generateSeedData } = require('./database/seeders/seed-database');

const PORT = process.env.PORT || 4000;
const GATEWAY_PORT = process.env.GATEWAY_PORT || 4001;

const auth = new AuthService();
const apiRegistry = new ApiRegistryService();
const rateLimiter = new RateLimiterService();
const proxyEngine = new ProxyEngineService();
const telemetry = new TelemetryAggregatorService();
const seedData = generateSeedData();

// Core Management API Server
const apiServer = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/health' || url.pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'HEALTHY', name: 'Synapse Management API', version: '1.0.0' }));
    return;
  }

  if (url.pathname === '/v1/apis') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: seedData.apis.length, data: seedData.apis }));
    return;
  }

  if (url.pathname === '/v1/integrations') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, count: seedData.integrations.length, data: seedData.integrations }));
    return;
  }

  if (url.pathname === '/v1/analytics/summary') {
    const summary = telemetry.getSummary();
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: summary }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found in Synapse Management API' }));
});

apiServer.listen(PORT, () => {
  console.log(`[Synapse Management API] listening on http://localhost:${PORT}`);
});

// Gateway Reverse Proxy Server
const gatewayServer = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Synapse-Gateway', 'v1.0.0');

  const clientIp = req.socket.remoteAddress || '127.0.0.1';
  const limitCheck = rateLimiter.checkTokenBucket(clientIp, { capacity: 100, refillRatePerSec: 20 });

  if (!limitCheck.allowed) {
    res.writeHead(429, { 'Retry-After': String(limitCheck.resetSeconds) });
    res.end(JSON.stringify({ error: 'Rate limit exceeded. Please back off.', resetSeconds: limitCheck.resetSeconds }));
    return;
  }

  const proxyRes = await proxyEngine.forward({
    path: req.url,
    method: req.method,
    headers: req.headers,
    query: {},
    body: null,
    clientIp
  }, 'https://upstream.internal.synapse.dev');

  telemetry.recordSample({
    apiId: 'api_default_gateway',
    statusCode: proxyRes.statusCode,
    latencyMs: proxyRes.latencyMs,
    bytesReceived: 200,
    bytesSent: 400,
    timestamp: Date.now()
  });

  res.writeHead(proxyRes.statusCode, proxyRes.headers);
  res.end(JSON.stringify(proxyRes.body));
});

gatewayServer.listen(GATEWAY_PORT, () => {
  console.log(`[Synapse Gateway Proxy] listening on http://localhost:${GATEWAY_PORT}`);
});
