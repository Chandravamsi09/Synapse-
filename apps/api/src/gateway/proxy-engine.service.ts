/**
 * Synapse Reverse Proxy, Dynamic Routing, and Payload Transformation Engine
 */

export interface ProxyRequest {
  path: string;
  method: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: any;
  clientIp: string;
}

export interface ProxyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  latencyMs: number;
}

export interface TransformationRule {
  addHeaders?: Record<string, string>;
  removeHeaders?: string[];
  fieldMappings?: Record<string, string>; // { "oldKey": "newKey" }
}

export class ProxyEngineService {
  /**
   * Apply request / response schema transformations
   */
  transformPayload(payload: any, rule: TransformationRule): any {
    if (!payload || typeof payload !== 'object') return payload;

    const transformed = Array.isArray(payload) ? [...payload] : { ...payload };

    if (rule.fieldMappings) {
      for (const [sourceField, targetField] of Object.entries(rule.fieldMappings)) {
        if (transformed[sourceField] !== undefined) {
          transformed[targetField] = transformed[sourceField];
          delete transformed[sourceField];
        }
      }
    }

    return transformed;
  }

  /**
   * Route and dispatch proxy request with simulated upstream response & latency
   */
  async forward(req: ProxyRequest, targetBaseUrl: string, transform?: TransformationRule): Promise<ProxyResponse> {
    const startTime = Date.now();

    // Clean headers
    const forwardedHeaders = { ...req.headers };
    delete forwardedHeaders['host'];
    forwardedHeaders['x-forwarded-for'] = req.clientIp;
    forwardedHeaders['x-synapse-gateway'] = 'v1.0.0';

    if (transform?.addHeaders) {
      Object.assign(forwardedHeaders, transform.addHeaders);
    }

    if (transform?.removeHeaders) {
      for (const h of transform.removeHeaders) {
        delete forwardedHeaders[h.toLowerCase()];
      }
    }

    const transformedBody = transform ? this.transformPayload(req.body, transform) : req.body;

    // Simulate upstream processing latency (10-35ms)
    const simulatedLatency = Math.floor(Math.random() * 25) + 10;

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'x-synapse-upstream-latency': `${simulatedLatency}ms`,
        'x-synapse-routed-to': targetBaseUrl
      },
      body: {
        success: true,
        data: transformedBody || { message: 'Upstream response successfully routed via Synapse' },
        route: {
          upstream: targetBaseUrl,
          path: req.path,
          method: req.method
        }
      },
      latencyMs: Date.now() - startTime + simulatedLatency
    };
  }
}
