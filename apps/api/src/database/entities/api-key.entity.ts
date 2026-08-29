/**
 * Synapse Data Entity: ApiKey
 * High-performance TypeORM & In-Memory Entity Definition
 */

export interface IApiKey {
  id: string;
  organizationId: string;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: Record<string, any>;
}

export class ApiKeyEntity implements IApiKey {
  id: string = '';
  organizationId: string = '';
  createdAt: Date = new Date();
  updatedAt?: Date = new Date();
  metadata?: Record<string, any> = {};

  constructor(partial: Partial<ApiKeyEntity>) {
    Object.assign(this, partial);
    if (!this.id) {
      this.id = 'syn_' + Math.random().toString(36).substring(2, 12);
    }
  }

  toJSON(): Record<string, any> {
    return { ...this };
  }

  validate(): boolean {
    return !!this.id && !!this.organizationId;
  }
}
