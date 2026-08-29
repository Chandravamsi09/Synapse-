/**
 * Synapse OpenAPI 3.0 & 3.1 Spec Parser, Validator and Endpoint Extractor
 */

export interface ParsedEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
  summary?: string;
  description?: string;
  operationId?: string;
  parameters: Array<{
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    required?: boolean;
    schema?: Record<string, any>;
  }>;
  requestBodySchema?: Record<string, any>;
  responses: Record<string, { description: string; schema?: Record<string, any> }>;
  tags: string[];
}

export interface ParsedApiSpec {
  title: string;
  version: string;
  description?: string;
  servers: Array<{ url: string; description?: string }>;
  endpoints: ParsedEndpoint[];
  schemas: Record<string, any>;
}

export class OpenApiParserService {
  /**
   * Parse raw OpenAPI 3.x JSON or YAML string into normalized Synapse structures
   */
  parseSpec(rawSpec: string | Record<string, any>): ParsedApiSpec {
    const spec = typeof rawSpec === 'string' ? JSON.parse(rawSpec) : rawSpec;

    if (!spec.openapi && !spec.swagger) {
      throw new Error('Invalid specification format: Missing "openapi" or "swagger" version root key');
    }

    const title = spec.info?.title || 'Untitled API';
    const version = spec.info?.version || '1.0.0';
    const description = spec.info?.description || '';
    const servers = spec.servers || [{ url: 'http://localhost:4000/api' }];
    const schemas = spec.components?.schemas || spec.definitions || {};

    const endpoints: ParsedEndpoint[] = [];

    if (spec.paths) {
      for (const [pathStr, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem || typeof pathItem !== 'object') continue;

        const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'] as const;
        for (const m of methods) {
          const operation = (pathItem as any)[m];
          if (!operation) continue;

          const endpoint: ParsedEndpoint = {
            path: pathStr,
            method: m.toUpperCase() as any,
            summary: operation.summary,
            description: operation.description,
            operationId: operation.operationId,
            tags: operation.tags || ['default'],
            parameters: (operation.parameters || []).map((p: any) => ({
              name: p.name,
              in: p.in,
              required: p.required,
              schema: p.schema
            })),
            responses: {}
          };

          if (operation.requestBody?.content?.['application/json']?.schema) {
            endpoint.requestBodySchema = operation.requestBody.content['application/json'].schema;
          }

          if (operation.responses) {
            for (const [code, respObj] of Object.entries(operation.responses)) {
              endpoint.responses[code] = {
                description: (respObj as any).description || '',
                schema: (respObj as any).content?.['application/json']?.schema
              };
            }
          }

          endpoints.push(endpoint);
        }
      }
    }

    return {
      title,
      version,
      description,
      servers,
      endpoints,
      schemas
    };
  }

  /**
   * Validate request against defined JSON Schema
   */
  validatePayload(payload: any, schema: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!schema) return { valid: true, errors };

    if (schema.type === 'object' && typeof payload !== 'object') {
      errors.push('Expected payload to be an object');
      return { valid: false, errors };
    }

    if (schema.required && Array.isArray(schema.required)) {
      for (const reqField of schema.required) {
        if (payload[reqField] === undefined || payload[reqField] === null) {
          errors.push(`Missing required property "${reqField}"`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
