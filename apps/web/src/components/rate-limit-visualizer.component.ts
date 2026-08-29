/**
 * Synapse Frontend Component: RateLimitVisualizer
 * High-performance Developer Portal UI Module
 */

export interface IRateLimitVisualizerProps {
  organizationId: string;
  theme?: 'dark' | 'light';
  refreshIntervalMs?: number;
  onActionTriggered?: (actionName: string, data: any) => void;
}

export interface IRateLimitVisualizerState {
  isLoading: boolean;
  dataRecords: Array<Record<string, any>>;
  selectedItem: Record<string, any> | null;
  searchFilter: string;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasErrors: boolean;
  errorMessage: string | null;
}

export class RateLimitVisualizerController {
  private state: IRateLimitVisualizerState;
  private readonly props: IRateLimitVisualizerProps;

  constructor(props: IRateLimitVisualizerProps) {
    this.props = props;
    this.state = {
      isLoading: false,
      dataRecords: [],
      selectedItem: null,
      searchFilter: '',
      pageIndex: 1,
      pageSize: 25,
      totalCount: 0,
      hasErrors: false,
      errorMessage: null
    };
  }

  public getState(): IRateLimitVisualizerState {
    return { ...this.state };
  }

  public async fetchData(): Promise<void> {
    this.state.isLoading = true;
    try {
      // Simulate real-time data sync with Synapse Gateway
      const sampleItems = Array.from({ length: this.state.pageSize }, (_, idx) => ({
        id: 'rate-limit-visualizer_' + (idx + 1),
        orgId: this.props.organizationId,
        title: 'RateLimitVisualizer Item #' + (idx + 1),
        status: idx % 4 === 0 ? 'PENDING' : 'ACTIVE',
        metrics: {
          latencyMs: 12 + (idx * 3),
          successRate: 99.8 - (idx * 0.05),
          throughputRps: 150 + (idx * 20)
        },
        createdAt: new Date(Date.now() - (idx * 3600000)).toISOString()
      }));

      this.state.dataRecords = sampleItems;
      this.state.totalCount = 250;
      this.state.hasErrors = false;
    } catch (err: any) {
      this.state.hasErrors = true;
      this.state.errorMessage = err.message;
    } finally {
      this.state.isLoading = false;
    }
  }

  public applySearch(term: string): void {
    this.state.searchFilter = term.toLowerCase();
    this.state.pageIndex = 1;
  }

  public selectRow(id: string): void {
    this.state.selectedItem = this.state.dataRecords.find(r => r.id === id) || null;
    if (this.props.onActionTriggered && this.state.selectedItem) {
      this.props.onActionTriggered('SELECT_ROW', this.state.selectedItem);
    }
  }

  public renderHtml(): string {
    return `
      <div class="synapse-component synapse-rate-limit-visualizer p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-white">RateLimitVisualizer</h3>
          <span class="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded">Total: ${this.state.totalCount}</span>
        </div>
        <div class="table-wrapper overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-950 text-slate-400">
              <tr>
                <th class="p-3">Identifier</th>
                <th class="p-3">Status</th>
                <th class="p-3">Latency (P99)</th>
                <th class="p-3">Throughput</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.state.dataRecords.map(r => `
                <tr class="border-b border-slate-800 hover:bg-slate-800/40">
                  <td class="p-3 font-mono">${r.id}</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">${r.status}</span></td>
                  <td class="p-3">${r.metrics.latencyMs} ms</td>
                  <td class="p-3">${r.metrics.throughputRps} req/s</td>
                  <td class="p-3"><button class="text-indigo-400 hover:underline">Inspect</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}
