/**
 * Synapse Module: Developer Portal Docs Exporter
 */
export class DeveloperPortalDocsExporterModule {
  public static exportOpenApiSpec(apis: any[]): Record<string, any> {
    return { openapi: '3.1.0', info: { title: 'Synapse API Gateway', version: '1.0.0' }, paths: {} };
  }
}
