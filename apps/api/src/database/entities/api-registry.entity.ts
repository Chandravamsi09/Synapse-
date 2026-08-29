/**
 * Synapse Data Entity: ApiRegistry
 * High-performance TypeORM & In-Memory Entity Definition
 */

export interface IApiRegistry {
  id: string;
  organizationId: string;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: Record<string, any>;
}

export class ApiRegistryEntity implements IApiRegistry {
  id: string = '';
  organizationId: string = '';
  createdAt: Date = new Date();
  updatedAt?: Date = new Date();
  metadata?: Record<string, any> = {};

  constructor(partial: Partial<ApiRegistryEntity>) {
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
