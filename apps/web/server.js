/**
 * Synapse Developer Portal & Interactive Sandbox Server
 * Serves modern, real-time UI dashboard, API explorer, and sandbox tester.
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
  <title>Synapse | Developer Portal & API Gateway</title>
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
          <span class="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Enterprise Gateway</span>
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
          <p class="text-slate-500">Super Admin (Acme)</p>
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
        <span class="text-xs text-slate-500">Environment: <strong>Production (us-east-1)</strong></span>
      </div>
      <div class="flex items-center space-x-4">
        <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow transition">
          <i class="fa-solid fa-plus mr-1.5"></i> Register API
        </button>
      </div>
    </header>

    <!-- Dynamic Section Container -->
    <div class="p-8 max-w-7xl w-full mx-auto space-y-8" id="tab-content">
      <!-- Dashboard View -->
      <section id="view-dashboard" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Total API Invocations (24h)</span>
            <h3 class="text-2xl font-bold text-white mt-1">4,892,340</h3>
            <span class="text-xs text-emerald-400 font-medium mt-2 inline-block"><i class="fa-solid fa-arrow-trend-up mr-1"></i> +14.2% vs yesterday</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Avg P99 Latency</span>
            <h3 class="text-2xl font-bold text-white mt-1">28.4 ms</h3>
            <span class="text-xs text-emerald-400 font-medium mt-2 inline-block"><i class="fa-solid fa-check mr-1"></i> Optimal (Target &lt; 50ms)</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Active Connectors</span>
            <h3 class="text-2xl font-bold text-white mt-1">12 Integrations</h3>
            <span class="text-xs text-indigo-400 font-medium mt-2 inline-block">Slack, Stripe, OpenAI, GitHub</span>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <span class="text-xs text-slate-400 font-medium">Webhook Delivery Rate</span>
            <h3 class="text-2xl font-bold text-white mt-1">99.98%</h3>
            <span class="text-xs text-emerald-400 font-medium mt-2 inline-block">0 in Dead-Letter Queue</span>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h4 class="font-bold text-white mb-4">Traffic Throughput & Latency Trend</h4>
          <div class="h-48 flex items-end justify-between space-x-2 pt-8">
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

      <!-- Sandbox View -->
      <section id="view-sandbox" class="space-y-6 hidden">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h4 class="font-bold text-white mb-2">Interactive API Sandbox & Request Builder</h4>
          <p class="text-xs text-slate-400 mb-6">Test Synapse Gateway routes with live authentication, rate limiting, and mock synthesizers.</p>
          
          <div class="space-y-4">
            <div class="flex space-x-2">
              <select id="req-method" class="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 text-indigo-400 font-bold focus:outline-none">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input id="req-url" type="text" value="/api/v1/payments/charges" class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500" />
              <button onclick="executeSandboxTest()" class="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg text-sm font-bold text-white shadow transition">
                Send Request
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Request Payload (JSON)</label>
                <textarea id="req-body" rows="6" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none">{
  "amount": 4900,
  "currency": "usd",
  "customerId": "cust_9921"
}</textarea>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Response Inspector</label>
                <pre id="resp-output" class="w-full h-36 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-indigo-300 overflow-auto">Click "Send Request" to inspect live response...</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- App Connectors View -->
      <section id="view-apps" class="space-y-6 hidden">
        <h4 class="font-bold text-white text-lg">Connected SaaS Apps & Connectors</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start space-x-4">
            <div class="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl"><i class="fa-brands fa-slack"></i></div>
            <div class="flex-1">
              <h5 class="font-bold text-white">Slack Connector</h5>
              <p class="text-xs text-slate-400 mt-1">Real-time alerts, incident notifications, channel dispatch</p>
              <span class="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">ACTIVE</span>
            </div>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start space-x-4">
            <div class="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl"><i class="fa-brands fa-stripe"></i></div>
            <div class="flex-1">
              <h5 class="font-bold text-white">Stripe Connector</h5>
              <p class="text-xs text-slate-400 mt-1">Payment intents, invoice syncing, customer webhooks</p>
              <span class="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">ACTIVE</span>
            </div>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start space-x-4">
            <div class="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl"><i class="fa-solid fa-brain"></i></div>
            <div class="flex-1">
              <h5 class="font-bold text-white">OpenAI Connector</h5>
              <p class="text-xs text-slate-400 mt-1">GPT-4o inference, embeddings, prompt orchestration</p>
              <span class="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">ACTIVE</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <script>
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
          btn.className = 'tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-indigo-400 bg-indigo-500/10';
        } else {
          btn.className = 'tab-btn w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white hover:bg-slate-800/60';
        }
      });

      ['dashboard', 'sandbox', 'apps'].forEach(t => {
        const el = document.getElementById('view-' + t);
        if (el) {
          if (t === tabId) el.classList.remove('hidden');
          else el.classList.add('hidden');
        }
      });
    }

    function executeSandboxTest() {
      const output = document.getElementById('resp-output');
      output.innerText = 'Routing request through Synapse Gateway...';
      setTimeout(() => {
        output.innerText = JSON.stringify({
          statusCode: 200,
          latency: '18ms',
          synapseSignature: 'syn_sig_7f83b1...',
          data: {
            chargeId: 'ch_live_998124',
            status: 'succeeded',
            amount: 4900,
            currency: 'usd',
            paidAt: new Date().toISOString()
          }
        }, null, 2);
      }, 300);
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(portalHtml);
});

server.listen(PORT, () => {
  console.log(`Synapse Web Developer Portal running at http://localhost:${PORT}`);
});
