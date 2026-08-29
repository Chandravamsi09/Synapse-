/**
 * Synapse Developer Portal & Interactive Sandbox Server
 * Serves modern, real-time UI dashboard, API explorer, and sandbox tester for all 7 views.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const portalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Synapse | Enterprise Apps & APIs Gateway</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex">
  
  <!-- Left Navigation Sidebar -->
  <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
    <div>
      <div class="flex items-center space-x-3 px-2 py-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <i class="fa-solid fa-bolt text-white text-lg"></i>
        </div>
        <div>
          <h1 class="font-extrabold text-lg tracking-tight text-white">SYNAPSE</h1>
          <span class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Enterprise Gateway</span>
        </div>
      </div>

      <nav class="space-y-1">
        <button onclick="switchTab('dashboard')" class="tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-indigo-400 bg-indigo-500/10" data-tab="dashboard">
          <i class="fa-solid fa-chart-line w-5 text-center"></i>
          <span>Overview</span>
        </button>
        <button onclick="switchTab('apis')" class="tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="apis">
          <i class="fa-solid fa-layer-group w-5 text-center"></i>
          <span>API Registry</span>
        </button>
        <button onclick="switchTab('sandbox')" class="tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="sandbox">
          <i class="fa-solid fa-terminal w-5 text-center"></i>
          <span>API Playground</span>
        </button>
        <button onclick="switchTab('apps')" class="tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="apps">
          <i class="fa-solid fa-cubes w-5 text-center"></i>
          <span>App Connectors</span>
        </button>
        <button onclick="switchTab('webhooks')" class="tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="webhooks">
          <i class="fa-solid fa-satellite-dish w-5 text-center"></i>
          <span>Webhooks & DLQ</span>
        </button>
        <button onclick="switchTab('keys')" class="tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="keys">
          <i class="fa-solid fa-key w-5 text-center"></i>
          <span>API Keys & Auth</span>
        </button>
        <button onclick="switchTab('audit')" class="tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="audit">
          <i class="fa-solid fa-shield-halved w-5 text-center"></i>
          <span>Audit & Security</span>
        </button>
      </nav>
    </div>

    <div class="border-t border-slate-800 pt-4 px-2">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300">AV</div>
        <div class="text-xs">
          <p class="font-semibold text-white">Alexandra Vance</p>
          <p class="text-slate-500">Super Admin (Acme Global)</p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col overflow-y-auto">
    <!-- Top Header -->
    <header class="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
      <div class="flex items-center space-x-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
          Gateway Online: 99.99% SLA
        </span>
        <span class="text-xs text-slate-500">API Port: <strong>4000</strong> | Proxy Port: <strong>4001</strong></span>
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="openRegisterModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow transition">
          <i class="fa-solid fa-plus mr-1.5"></i> Register API
        </button>
      </div>
    </header>

    <!-- Dynamic Section Container -->
    <div class="p-8 max-w-7xl w-full mx-auto space-y-8" id="tab-content">
      
      <!-- 1. OVERVIEW DASHBOARD -->
      <section id="view-dashboard" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Total API Invocations (24h)</span>
            <h3 class="text-2xl font-bold text-white mt-1" id="dash-invocations">4,892,340</h3>
            <span class="text-xs text-emerald-400 font-medium mt-2 inline-block"><i class="fa-solid fa-arrow-trend-up mr-1"></i> +14.2% vs yesterday</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Avg P99 Latency</span>
            <h3 class="text-2xl font-bold text-white mt-1">28.4 ms</h3>
            <span class="text-xs text-emerald-400 font-medium mt-2 inline-block"><i class="fa-solid fa-check mr-1"></i> Target &lt; 50ms</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Active Connectors</span>
            <h3 class="text-2xl font-bold text-white mt-1" id="dash-connectors">6 Connected</h3>
            <span class="text-xs text-indigo-400 font-medium mt-2 inline-block">Slack, Stripe, OpenAI, GitHub</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Webhook Delivery Rate</span>
            <h3 class="text-2xl font-bold text-white mt-1">99.98%</h3>
            <span class="text-xs text-emerald-400 font-medium mt-2 inline-block" id="dash-dlq">1 Event in DLQ</span>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h4 class="font-bold text-white mb-4">Live Traffic Throughput & Latency Trend</h4>
          <div class="h-44 flex items-end justify-between space-x-2 pt-6">
            <div class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t h-[45%] transition"></div>
            <div class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t h-[60%] transition"></div>
            <div class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t h-[80%] transition"></div>
            <div class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t h-[95%] transition"></div>
            <div class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t h-[70%] transition"></div>
            <div class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t h-[85%] transition"></div>
            <div class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t h-[100%] transition"></div>
          </div>
          <div class="flex justify-between text-xs text-slate-500 mt-2">
            <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Now</span>
          </div>
        </div>
      </section>

      <!-- 2. API REGISTRY -->
      <section id="view-apis" class="space-y-6 hidden">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">Registered APIs</h3>
            <p class="text-xs text-slate-400 mt-1">Manage upstream microservices, endpoint routes, and rate-limit quotas.</p>
          </div>
          <div class="flex items-center space-x-3">
            <input id="api-search-input" onkeyup="filterApis()" type="text" placeholder="Search APIs..." class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
            <button onclick="openRegisterModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition">
              <i class="fa-solid fa-plus mr-1"></i> Register New API
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4" id="api-list-container">
          <!-- Loaded dynamically -->
        </div>
      </section>

      <!-- 3. API PLAYGROUND / SANDBOX -->
      <section id="view-sandbox" class="space-y-6 hidden">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="font-bold text-white text-lg">Interactive API Sandbox & Request Builder</h4>
              <p class="text-xs text-slate-400">Test live requests against Synapse Reverse Proxy with authentication, rate-limiting & headers.</p>
            </div>
            <span class="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded font-mono">Gateway: http://localhost:4001</span>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Preset API & Endpoint</label>
                <select id="playground-preset" onchange="applyPlaygroundPreset()" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                  <option value="custom">-- Custom Request --</option>
                  <option value="payments_charge">Payments Core: POST /charges</option>
                  <option value="payments_get">Payments Core: GET /charges/ch_9921</option>
                  <option value="inventory_stock">Warehouse: GET /stock/levels</option>
                  <option value="auth_token">Identity SSO: POST /oauth/token</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-semibold text-slate-400 mb-1">API Key / Auth Header</label>
                <input id="req-auth" type="text" value="Bearer syn_live_9a8f_7f83b1657ff1" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none" />
              </div>
            </div>

            <div class="flex space-x-2">
              <select id="req-method" class="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 text-indigo-400 font-bold focus:outline-none">
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input id="req-url" type="text" value="/api/v1/payments/charges" class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500" />
              <button onclick="executeSandboxTest()" id="btn-send-req" class="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg text-sm font-bold text-white shadow transition flex items-center">
                <i class="fa-solid fa-paper-plane mr-2"></i> Send Request
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Request Payload (JSON)</label>
                <textarea id="req-body" rows="9" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none">{
  "amount": 4900,
  "currency": "usd",
  "customerId": "cust_9921",
  "paymentMethod": "pm_card_visa"
}</textarea>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-xs font-semibold text-slate-400">Response Inspector</label>
                  <span id="resp-badge" class="hidden text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">HTTP 200 OK</span>
                </div>
                <pre id="resp-output" class="w-full h-44 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-indigo-300 overflow-auto">Click "Send Request" to route live request through Synapse Gateway Proxy...</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. APP CONNECTORS -->
      <section id="view-apps" class="space-y-6 hidden">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">App Connectors & Integrations</h3>
            <p class="text-xs text-slate-400 mt-1">Manage pre-built connectors for Slack, Stripe, OpenAI, GitHub, Twilio, and CRM tools.</p>
          </div>
          <input id="app-search-input" onkeyup="filterApps()" type="text" placeholder="Search connectors..." class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="app-list-container">
          <!-- Loaded dynamically -->
        </div>

        <!-- Action Execution Test Modal/Card -->
        <div id="connector-action-box" class="hidden bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-white" id="action-box-title">Execute Action</h4>
            <button onclick="closeActionBox()" class="text-slate-400 hover:text-white text-xs"><i class="fa-solid fa-xmark"></i> Close</button>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Select Action</label>
              <select id="action-select" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"></select>
            </div>
            <div class="col-span-2">
              <label class="block text-xs text-slate-400 mb-1">Action Payload (JSON)</label>
              <input id="action-payload" type="text" value='{"channel": "#alerts", "message": "Incident detected on payment gateway"}' class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400" />
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button onclick="runConnectorAction()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition">
              <i class="fa-solid fa-play mr-1"></i> Execute Action Now
            </button>
          </div>
          <pre id="action-result" class="hidden bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-indigo-300"></pre>
        </div>
      </section>

      <!-- 5. WEBHOOKS & DLQ -->
      <section id="view-webhooks" class="space-y-6 hidden">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">Webhook Subscriptions & Dead Letter Queue</h3>
            <p class="text-xs text-slate-400 mt-1">Manage event delivery dispatchers, HMAC SHA-256 signatures, and replay failed events.</p>
          </div>
          <button onclick="openWebhookModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition">
            <i class="fa-solid fa-plus mr-1"></i> New Webhook Subscription
          </button>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 class="font-bold text-white text-sm">Active Webhook Subscriptions</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400">
                <tr>
                  <th class="p-3">Subscription Name</th>
                  <th class="p-3">Target Endpoint URL</th>
                  <th class="p-3">Event Triggers</th>
                  <th class="p-3">Deliveries</th>
                  <th class="p-3">Status</th>
                </tr>
              </thead>
              <tbody id="webhooks-table-body">
                <!-- Loaded dynamically -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Dead Letter Queue -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-bold text-red-400 text-sm"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Dead Letter Queue (DLQ)</h4>
              <p class="text-xs text-slate-400">Failed webhook deliveries after max retry attempts. Replay directly to upstream.</p>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">Retries Paused</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400">
                <tr>
                  <th class="p-3">Event ID</th>
                  <th class="p-3">Event Type</th>
                  <th class="p-3">Target Destination</th>
                  <th class="p-3">Attempts</th>
                  <th class="p-3">Last Error</th>
                  <th class="p-3">Action</th>
                </tr>
              </thead>
              <tbody id="dlq-table-body">
                <!-- Loaded dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 6. API KEYS & AUTH -->
      <section id="view-keys" class="space-y-6 hidden">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">API Keys & Authentication</h3>
            <p class="text-xs text-slate-400 mt-1">Manage zero-knowledge hashed API tokens, rate-limit tiers, and access scopes.</p>
          </div>
          <button onclick="openKeyModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow transition">
            <i class="fa-solid fa-key mr-1.5"></i> Generate API Key
          </button>
        </div>

        <!-- Newly generated key alert -->
        <div id="new-key-alert" class="hidden bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-2">
          <p class="text-xs font-bold text-emerald-400"><i class="fa-solid fa-circle-check mr-1.5"></i> API Key Generated Successfully! Copy it now (will not be displayed again):</p>
          <div class="flex items-center space-x-2">
            <input id="generated-key-display" readonly class="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-white" />
            <button onclick="copyGeneratedKey()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold">Copy</button>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400">
                <tr>
                  <th class="p-3">Key Name</th>
                  <th class="p-3">Prefix / Hash</th>
                  <th class="p-3">Scopes</th>
                  <th class="p-3">Rate Limit</th>
                  <th class="p-3">Created</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Action</th>
                </tr>
              </thead>
              <tbody id="keys-table-body">
                <!-- Loaded dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 7. AUDIT & SECURITY -->
      <section id="view-audit" class="space-y-6 hidden">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">Audit Logs & Security Posture</h3>
            <p class="text-xs text-slate-400 mt-1">Immutable audit trail with cryptographic HMAC verification and gateway policy checks.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Rate Limiting Policy</span>
            <h4 class="text-base font-bold text-white mt-1">Token Bucket Active</h4>
            <p class="text-xs text-emerald-400 mt-1"><i class="fa-solid fa-shield-check mr-1"></i> Refill: 20 tokens/sec</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">RBAC Security Guard</span>
            <h4 class="text-base font-bold text-white mt-1">Strict Matrix Enforced</h4>
            <p class="text-xs text-emerald-400 mt-1"><i class="fa-solid fa-lock mr-1"></i> Wildcard & Scope Filtering</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Webhook Security</span>
            <h4 class="text-base font-bold text-white mt-1">HMAC-SHA256 Signatures</h4>
            <p class="text-xs text-emerald-400 mt-1"><i class="fa-solid fa-check-double mr-1"></i> Replay Attack Tolerance: 300s</p>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 class="font-bold text-white text-sm">Security Audit Trail</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400">
                <tr>
                  <th class="p-3">Event ID</th>
                  <th class="p-3">Action</th>
                  <th class="p-3">Actor / User</th>
                  <th class="p-3">Resource Target</th>
                  <th class="p-3">IP Address</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody id="audit-table-body">
                <!-- Loaded dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  </main>

  <!-- Modals -->
  <!-- Register API Modal -->
  <div id="modal-register-api" class="hidden fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-white text-base">Register New Upstream API</h4>
        <button onclick="closeRegisterModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">API Name</label>
          <input id="new-api-name" type="text" placeholder="e.g., Customer Order Core" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Target Base URL</label>
          <input id="new-api-url" type="text" placeholder="https://orders.internal.acme.com/v1" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Version</label>
            <input id="new-api-version" type="text" value="v1.0.0" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Rate Limit (RPS)</label>
            <input id="new-api-rps" type="number" value="150" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none" />
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-3 pt-2">
        <button onclick="closeRegisterModal()" class="px-4 py-2 rounded text-xs text-slate-400 hover:text-white">Cancel</button>
        <button onclick="submitRegisterApi()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-bold">Register API</button>
      </div>
    </div>
  </div>

  <!-- Generate Key Modal -->
  <div id="modal-gen-key" class="hidden fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-white text-base">Generate Enterprise API Key</h4>
        <button onclick="closeKeyModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Key Description / Name</label>
          <input id="new-key-name" type="text" placeholder="e.g., Staging Integration Key" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Access Scope</label>
          <select id="new-key-scope" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white">
            <option value="*">Full Access (*)</option>
            <option value="api:read,api:proxy">Read & Proxy Only</option>
            <option value="api:read">Read Only</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end space-x-3 pt-2">
        <button onclick="closeKeyModal()" class="px-4 py-2 rounded text-xs text-slate-400 hover:text-white">Cancel</button>
        <button onclick="submitGenerateKey()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-bold">Generate Key</button>
      </div>
    </div>
  </div>

  <!-- New Webhook Modal -->
  <div id="modal-new-webhook" class="hidden fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-white text-base">New Webhook Subscription</h4>
        <button onclick="closeWebhookModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Subscription Name</label>
          <input id="new-wh-name" type="text" placeholder="e.g., Discord Alert Channel" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Target Endpoint URL</label>
          <input id="new-wh-url" type="text" placeholder="https://api.acme.com/webhook" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none" />
        </div>
      </div>
      <div class="flex justify-end space-x-3 pt-2">
        <button onclick="closeWebhookModal()" class="px-4 py-2 rounded text-xs text-slate-400 hover:text-white">Cancel</button>
        <button onclick="submitNewWebhook()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-bold">Save Subscription</button>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = 'http://localhost:4000';
    const GATEWAY_BASE = 'http://localhost:4001';

    let allApis = [];
    let allApps = [];
    let activeConnectorId = null;

    // Navigation Switcher
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
          btn.className = 'tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-indigo-400 bg-indigo-500/10';
        } else {
          btn.className = 'tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60';
        }
      });

      ['dashboard', 'apis', 'sandbox', 'apps', 'webhooks', 'keys', 'audit'].forEach(t => {
        const el = document.getElementById('view-' + t);
        if (el) {
          if (t === tabId) el.classList.remove('hidden');
          else el.classList.add('hidden');
        }
      });

      if (tabId === 'apis') loadApis();
      if (tabId === 'apps') loadApps();
      if (tabId === 'webhooks') loadWebhooks();
      if (tabId === 'keys') loadKeys();
      if (tabId === 'audit') loadAudit();
    }

    // --- API Registry ---
    async function loadApis() {
      try {
        const res = await fetch(API_BASE + '/v1/apis');
        const data = await res.json();
        allApis = data.data || [];
        renderApis(allApis);
      } catch (err) {
        console.error('Failed to load APIs', err);
      }
    }

    function renderApis(list) {
      const container = document.getElementById('api-list-container');
      if (!list || list.length === 0) {
        container.innerHTML = '<div class="text-center p-8 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">No APIs found.</div>';
        return;
      }

      container.innerHTML = list.map(api => \`
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between">
          <div class="space-y-2 flex-1">
            <div class="flex items-center space-x-3">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400 font-mono">\${api.protocol}</span>
              <h4 class="font-bold text-white text-base">\${api.name}</h4>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded \${api.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}">\${api.status}</span>
              <span class="text-xs text-slate-500 font-mono">\${api.version}</span>
            </div>
            <p class="text-xs text-slate-400 font-mono">Target: <span class="text-indigo-300">\${api.targetBaseUrl}</span></p>
            <div class="pt-2 flex flex-wrap gap-2">
              \${(api.endpoints || []).map(ep => \`
                <span class="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <strong class="\${ep.method === 'GET' ? 'text-emerald-400' : ep.method === 'POST' ? 'text-indigo-400' : 'text-amber-400'}">\${ep.method}</strong> \${ep.path}
                </span>
              \`).join('')}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="toggleApiStatus('\${api.id}', '\${api.status}')" class="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition">
              \${api.status === 'ACTIVE' ? 'Pause' : 'Activate'}
            </button>
            <button onclick="deleteApi('\${api.id}')" class="px-3 py-1.5 rounded-lg border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10 transition">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      \`).join('');
    }

    function filterApis() {
      const q = document.getElementById('api-search-input').value.toLowerCase();
      const filtered = allApis.filter(a => a.name.toLowerCase().includes(q) || a.targetBaseUrl.toLowerCase().includes(q));
      renderApis(filtered);
    }

    async function toggleApiStatus(id, currStatus) {
      const newStatus = currStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await fetch(API_BASE + '/v1/apis/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      loadApis();
    }

    async function deleteApi(id) {
      if (confirm('Are you sure you want to delete this API registration?')) {
        await fetch(API_BASE + '/v1/apis/' + id, { method: 'DELETE' });
        loadApis();
      }
    }

    function openRegisterModal() { document.getElementById('modal-register-api').classList.remove('hidden'); }
    function closeRegisterModal() { document.getElementById('modal-register-api').classList.add('hidden'); }

    async function submitRegisterApi() {
      const name = document.getElementById('new-api-name').value;
      const targetBaseUrl = document.getElementById('new-api-url').value;
      const version = document.getElementById('new-api-version').value;
      const rateLimitRps = document.getElementById('new-api-rps').value;

      if (!name || !targetBaseUrl) return alert('Name and Target URL are required');

      await fetch(API_BASE + '/v1/apis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetBaseUrl, version, rateLimitRps })
      });

      closeRegisterModal();
      switchTab('apis');
    }

    // --- API Playground / Sandbox ---
    function applyPlaygroundPreset() {
      const preset = document.getElementById('playground-preset').value;
      if (preset === 'payments_charge') {
        document.getElementById('req-method').value = 'POST';
        document.getElementById('req-url').value = '/api/v1/payments/charges';
        document.getElementById('req-body').value = JSON.stringify({ amount: 4900, currency: "usd", customerId: "cust_9921" }, null, 2);
      } else if (preset === 'payments_get') {
        document.getElementById('req-method').value = 'GET';
        document.getElementById('req-url').value = '/api/v1/payments/charges/ch_9921';
        document.getElementById('req-body').value = '{}';
      } else if (preset === 'inventory_stock') {
        document.getElementById('req-method').value = 'GET';
        document.getElementById('req-url').value = '/api/v1/warehouse/stock/levels?sku=SKU-991';
        document.getElementById('req-body').value = '{}';
      } else if (preset === 'auth_token') {
        document.getElementById('req-method').value = 'POST';
        document.getElementById('req-url').value = '/api/v1/identity/oauth/token';
        document.getElementById('req-body').value = JSON.stringify({ grant_type: "client_credentials", client_id: "syn_client_1" }, null, 2);
      }
    }

    async function executeSandboxTest() {
      const output = document.getElementById('resp-output');
      const badge = document.getElementById('resp-badge');
      const method = document.getElementById('req-method').value;
      const urlPath = document.getElementById('req-url').value;
      const auth = document.getElementById('req-auth').value;
      let bodyData = null;

      try {
        if (method !== 'GET') {
          bodyData = JSON.parse(document.getElementById('req-body').value);
        }
      } catch(e) {
        return alert('Invalid JSON in Request Payload textarea');
      }

      output.innerText = 'Routing request through Synapse API Gateway (Port 4001)...';
      badge.classList.add('hidden');

      const startTime = Date.now();
      try {
        const res = await fetch(GATEWAY_BASE + urlPath, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
          },
          body: bodyData ? JSON.stringify(bodyData) : undefined
        });

        const elapsed = Date.now() - startTime;
        const resJson = await res.json();

        badge.className = \`text-[10px] font-bold px-2 py-0.5 rounded \${res.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}\`;
        badge.innerText = \`HTTP \${res.status} (\${elapsed}ms)\`;
        badge.classList.remove('hidden');

        output.innerText = JSON.stringify(resJson, null, 2);
      } catch (err) {
        badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400';
        badge.innerText = 'Connection Error';
        badge.classList.remove('hidden');
        output.innerText = 'Error reaching Gateway on ' + GATEWAY_BASE + ': ' + err.message;
      }
    }

    // --- App Connectors ---
    async function loadApps() {
      try {
        const res = await fetch(API_BASE + '/v1/integrations');
        const data = await res.json();
        allApps = data.data || [];
        renderApps(allApps);
      } catch(err) {
        console.error('Failed to load apps', err);
      }
    }

    function renderApps(list) {
      const container = document.getElementById('app-list-container');
      container.innerHTML = list.map(app => \`
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl shrink-0">
              <i class="\${app.icon || 'fa-solid fa-plug'}"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-white text-base">\${app.name}</h4>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold \${app.status === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}">
                  \${app.status}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1">Category: \${app.category} | Health: <span class="text-emerald-400">\${app.healthStatus}</span></p>
              <p class="text-[11px] text-slate-500 mt-1">Last synced: \${app.lastSync || 'Active'}</p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-800">
            <div class="flex space-x-2">
              <button onclick="testAppConnection('\${app.id}')" class="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition">
                <i class="fa-solid fa-vial mr-1 text-indigo-400"></i> Test Connection
              </button>
              <button onclick="openActionBox('\${app.id}')" class="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded text-xs font-semibold transition">
                <i class="fa-solid fa-bolt mr-1"></i> Actions (\${(app.actions || []).length})
              </button>
            </div>
            <button onclick="toggleApp('\${app.id}')" class="text-xs \${app.status === 'CONNECTED' ? 'text-red-400 hover:underline' : 'text-emerald-400 hover:underline'}">
              \${app.status === 'CONNECTED' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      \`).join('');
    }

    function filterApps() {
      const q = document.getElementById('app-search-input').value.toLowerCase();
      renderApps(allApps.filter(a => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)));
    }

    async function toggleApp(id) {
      await fetch(API_BASE + '/v1/integrations/' + id + '/toggle', { method: 'POST' });
      loadApps();
    }

    async function testAppConnection(id) {
      const res = await fetch(API_BASE + '/v1/integrations/' + id + '/test', { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'Connection verified successfully');
    }

    function openActionBox(id) {
      activeConnectorId = id;
      const app = allApps.find(a => a.id === id);
      if (!app) return;

      document.getElementById('action-box-title').innerText = 'Execute Action on ' + app.name;
      const select = document.getElementById('action-select');
      select.innerHTML = (app.actions || ['executeAction']).map(a => \`<option value="\${a}">\${a}</option>\`).join('');
      document.getElementById('connector-action-box').classList.remove('hidden');
      document.getElementById('action-result').classList.add('hidden');
    }

    function closeActionBox() {
      document.getElementById('connector-action-box').classList.add('hidden');
    }

    async function runConnectorAction() {
      if (!activeConnectorId) return;
      const action = document.getElementById('action-select').value;
      let payload = {};
      try {
        payload = JSON.parse(document.getElementById('action-payload').value);
      } catch(e) {}

      const res = await fetch(API_BASE + '/v1/integrations/' + activeConnectorId + '/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, parameters: payload })
      });
      const data = await res.json();

      const resultBox = document.getElementById('action-result');
      resultBox.innerText = JSON.stringify(data, null, 2);
      resultBox.classList.remove('hidden');
    }

    // --- Webhooks & DLQ ---
    async function loadWebhooks() {
      try {
        const res = await fetch(API_BASE + '/v1/webhooks');
        const data = await res.json();
        const subs = data.data?.subscriptions || [];
        const dlq = data.data?.dlq || [];

        document.getElementById('webhooks-table-body').innerHTML = subs.map(w => \`
          <tr class="border-b border-slate-800 hover:bg-slate-800/40">
            <td class="p-3 font-semibold text-white">\${w.name}</td>
            <td class="p-3 font-mono text-indigo-300">\${w.targetUrl}</td>
            <td class="p-3">\${w.events.map(e => \`<span class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 mr-1">\${e}</span>\`).join('')}</td>
            <td class="p-3 text-emerald-400">\${w.successCount} ok</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">\${w.status}</span></td>
          </tr>
        \`).join('');

        document.getElementById('dlq-table-body').innerHTML = dlq.map(d => \`
          <tr class="border-b border-slate-800 hover:bg-slate-800/40">
            <td class="p-3 font-mono text-slate-400">\${d.id}</td>
            <td class="p-3 font-mono text-amber-400">\${d.eventType}</td>
            <td class="p-3 font-mono text-slate-300">\${d.targetUrl}</td>
            <td class="p-3 text-red-400 font-bold">\${d.attempts} failed</td>
            <td class="p-3 text-slate-400">\${d.lastError}</td>
            <td class="p-3">
              \${d.status === 'REPLAYED_SUCCESSFULLY' 
                ? '<span class="text-emerald-400 font-bold text-xs"><i class="fa-solid fa-check mr-1"></i> Replayed</span>'
                : \`<button onclick="retryDlqEvent('\${d.id}')" class="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded text-xs font-bold"><i class="fa-solid fa-rotate mr-1"></i> Replay</button>\`
              }
            </td>
          </tr>
        \`).join('');
      } catch (err) {
        console.error('Failed to load webhooks', err);
      }
    }

    async function retryDlqEvent(id) {
      const res = await fetch(API_BASE + '/v1/webhooks/dlq/' + id + '/retry', { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'Replayed successfully');
      loadWebhooks();
    }

    function openWebhookModal() { document.getElementById('modal-new-webhook').classList.remove('hidden'); }
    function closeWebhookModal() { document.getElementById('modal-new-webhook').classList.add('hidden'); }

    async function submitNewWebhook() {
      const name = document.getElementById('new-wh-name').value;
      const targetUrl = document.getElementById('new-wh-url').value;
      if (!name || !targetUrl) return alert('Name and URL required');

      await fetch(API_BASE + '/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetUrl, events: ['charge.completed', 'api.failure'] })
      });

      closeWebhookModal();
      loadWebhooks();
    }

    // --- API Keys ---
    async function loadKeys() {
      try {
        const res = await fetch(API_BASE + '/v1/keys');
        const data = await res.json();
        const keys = data.data || [];

        document.getElementById('keys-table-body').innerHTML = keys.map(k => \`
          <tr class="border-b border-slate-800 hover:bg-slate-800/40">
            <td class="p-3 font-semibold text-white">\${k.name}</td>
            <td class="p-3 font-mono text-indigo-300">\${k.prefix}••••••••</td>
            <td class="p-3">\${k.scopes.map(s => \`<span class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] mr-1">\${s}</span>\`).join('')}</td>
            <td class="p-3 font-mono">\${k.rateLimitRps} rps</td>
            <td class="p-3 text-slate-500">\${k.createdAt}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">\${k.status}</span></td>
            <td class="p-3">
              <button onclick="revokeKey('\${k.id}')" class="text-red-400 hover:underline text-xs">Revoke</button>
            </td>
          </tr>
        \`).join('');
      } catch (err) {
        console.error('Failed to load keys', err);
      }
    }

    function openKeyModal() { document.getElementById('modal-gen-key').classList.remove('hidden'); }
    function closeKeyModal() { document.getElementById('modal-gen-key').classList.add('hidden'); }

    async function submitGenerateKey() {
      const name = document.getElementById('new-key-name').value;
      const scopeVal = document.getElementById('new-key-scope').value;
      const scopes = scopeVal.split(',');

      const res = await fetch(API_BASE + '/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Production Key', scopes })
      });
      const data = await res.json();

      closeKeyModal();
      if (data.data?.rawKey) {
        document.getElementById('generated-key-display').value = data.data.rawKey;
        document.getElementById('new-key-alert').classList.remove('hidden');
      }
      loadKeys();
    }

    function copyGeneratedKey() {
      const input = document.getElementById('generated-key-display');
      navigator.clipboard.writeText(input.value);
      alert('API Key copied to clipboard!');
    }

    async function revokeKey(id) {
      if (confirm('Are you sure you want to revoke this API key?')) {
        await fetch(API_BASE + '/v1/keys/' + id, { method: 'DELETE' });
        loadKeys();
      }
    }

    // --- Audit Logs ---
    async function loadAudit() {
      try {
        const res = await fetch(API_BASE + '/v1/audit/logs');
        const data = await res.json();
        const logs = data.data || [];

        document.getElementById('audit-table-body').innerHTML = logs.map(l => \`
          <tr class="border-b border-slate-800 hover:bg-slate-800/40">
            <td class="p-3 font-mono text-slate-500">\${l.id}</td>
            <td class="p-3 font-bold text-indigo-300">\${l.action}</td>
            <td class="p-3 text-slate-300">\${l.actor}</td>
            <td class="p-3 font-mono text-slate-400">\${l.resource}</td>
            <td class="p-3 font-mono text-slate-500">\${l.ipAddress}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">\${l.status}</span></td>
            <td class="p-3 text-slate-500">\${new Date(l.timestamp).toLocaleTimeString()}</td>
          </tr>
        \`).join('');
      } catch (err) {
        console.error('Failed to load audit logs', err);
      }
    }

    // Initialize default view
    loadApis();
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(portalHtml);
});

server.listen(PORT, () => {
  console.log(`✓ [Synapse Developer Portal] listening on http://localhost:${PORT}`);
});
