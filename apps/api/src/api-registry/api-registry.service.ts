/**
 * Synapse API Registry Management Service
 */

import { InMemoryRepository } from '../database/repositories/base.repository';
import { OpenApiParserService } from './openapi-parser.service';
import { MockEngineService } from './mock-engine.service';

export interface ApiRecord {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  protocol: 'REST' | 'GRAPHQL' | 'GRPC' | 'WEBSOCKET' | 'WEBHOOK';
  version: string;
  targetBaseUrl: string;
  isActive: boolean;
  endpointsCount?: number;
}

export class ApiRegistryService {
  private apiRepo = new InMemoryRepository<ApiRecord>();
  private parser = new OpenApiParserService();
  private mockEngine = new MockEngineService();

  constructor() {
    this.seedInitial();
  }

  private async seedInitial() {
    await this.apiRepo.create({
      id: 'api_auth_core',
      organizationId: 'org_primary',
      name: 'Authentication Core API',
      slug: 'auth-core',
      description: 'Single sign-on, session tokens, and security audits',
      protocol: 'REST',
      version: 'v1.0.0',
      targetBaseUrl: 'https://auth.internal.synapse.dev/v1',
      isActive: true,
      endpointsCount: 8
    });
  }

  async listApis(orgId: string): Promise<ApiRecord[]> {
    return this.apiRepo.findAll({ organizationId: orgId });
  }

  async getApiById(id: string): Promise<ApiRecord | null> {
    return this.apiRepo.findById(id);
  }

  async registerApi(data: Partial<ApiRecord>): Promise<ApiRecord> {
    if (!data.name || !data.targetBaseUrl) {
      throw new Error('API Name and Target Base URL are required');
    }
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return this.apiRepo.create({
      ...data,
      slug,
      isActive: true,
      endpointsCount: data.endpointsCount || 0
    });
  }

  async importOpenApi(orgId: string, rawSpec: string): Promise<ApiRecord> {
    const parsed = this.parser.parseSpec(rawSpec);
    return this.registerApi({
      organizationId: orgId,
      name: parsed.title,
      version: parsed.version,
      description: parsed.description,
      targetBaseUrl: parsed.servers[0]?.url || 'https://api.internal.target',
      protocol: 'REST',
      endpointsCount: parsed.endpoints.length
    });
  }

  getMockEngine(): MockEngineService {
    return this.mockEngine;
  }
}
