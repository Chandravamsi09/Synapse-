/**
 * Synapse Domain Models: Cache & Key-Value Storage
 * High-performance enterprise types, DTOs, and validation logic.
 */

export namespace CacheStorageDomain {

  export interface ICacheEntry {
    id: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    metadata: Record<string, any>;
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED';
    name: string;
    description?: string;
    attributes: {
      key: string;
      value: any;
      isSecret?: boolean;
      indexed?: boolean;
    }[];
    tags: string[];
  }

  export class CacheEntryDTO implements ICacheEntry {
    id: string = '';
    organizationId: string = '';
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();
    version: number = 1;
    metadata: Record<string, any> = {};
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED' = 'ACTIVE';
    name: string = '';
    description?: string = '';
    attributes: { key: string; value: any; isSecret?: boolean; indexed?: boolean }[] = [];
    tags: string[] = [];

    constructor(init?: Partial<ICacheEntry>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ICacheEntry> {
      const clone = { ...this };
      clone.attributes = this.attributes.filter(a => !a.isSecret);
      return clone;
    }

    toDatabaseRow(): Record<string, any> {
      return {
        id: this.id,
        org_id: this.organizationId,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        version: this.version,
        metadata_json: JSON.stringify(this.metadata),
        status_code: this.status,
        entity_name: this.name,
        description: this.description,
        attributes_json: JSON.stringify(this.attributes),
        tags_array: this.tags
      };
    }
  }

  export interface ICacheTag {
    id: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    metadata: Record<string, any>;
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED';
    name: string;
    description?: string;
    attributes: {
      key: string;
      value: any;
      isSecret?: boolean;
      indexed?: boolean;
    }[];
    tags: string[];
  }

  export class CacheTagDTO implements ICacheTag {
    id: string = '';
    organizationId: string = '';
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();
    version: number = 1;
    metadata: Record<string, any> = {};
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED' = 'ACTIVE';
    name: string = '';
    description?: string = '';
    attributes: { key: string; value: any; isSecret?: boolean; indexed?: boolean }[] = [];
    tags: string[] = [];

    constructor(init?: Partial<ICacheTag>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ICacheTag> {
      const clone = { ...this };
      clone.attributes = this.attributes.filter(a => !a.isSecret);
      return clone;
    }

    toDatabaseRow(): Record<string, any> {
      return {
        id: this.id,
        org_id: this.organizationId,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        version: this.version,
        metadata_json: JSON.stringify(this.metadata),
        status_code: this.status,
        entity_name: this.name,
        description: this.description,
        attributes_json: JSON.stringify(this.attributes),
        tags_array: this.tags
      };
    }
  }

  export interface IEvictionPolicy {
    id: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    metadata: Record<string, any>;
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED';
    name: string;
    description?: string;
    attributes: {
      key: string;
      value: any;
      isSecret?: boolean;
      indexed?: boolean;
    }[];
    tags: string[];
  }

  export class EvictionPolicyDTO implements IEvictionPolicy {
    id: string = '';
    organizationId: string = '';
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();
    version: number = 1;
    metadata: Record<string, any> = {};
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED' = 'ACTIVE';
    name: string = '';
    description?: string = '';
    attributes: { key: string; value: any; isSecret?: boolean; indexed?: boolean }[] = [];
    tags: string[] = [];

    constructor(init?: Partial<IEvictionPolicy>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IEvictionPolicy> {
      const clone = { ...this };
      clone.attributes = this.attributes.filter(a => !a.isSecret);
      return clone;
    }

    toDatabaseRow(): Record<string, any> {
      return {
        id: this.id,
        org_id: this.organizationId,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        version: this.version,
        metadata_json: JSON.stringify(this.metadata),
        status_code: this.status,
        entity_name: this.name,
        description: this.description,
        attributes_json: JSON.stringify(this.attributes),
        tags_array: this.tags
      };
    }
  }

  export interface IRedisClusterNode {
    id: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    metadata: Record<string, any>;
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED';
    name: string;
    description?: string;
    attributes: {
      key: string;
      value: any;
      isSecret?: boolean;
      indexed?: boolean;
    }[];
    tags: string[];
  }

  export class RedisClusterNodeDTO implements IRedisClusterNode {
    id: string = '';
    organizationId: string = '';
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();
    version: number = 1;
    metadata: Record<string, any> = {};
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED' = 'ACTIVE';
    name: string = '';
    description?: string = '';
    attributes: { key: string; value: any; isSecret?: boolean; indexed?: boolean }[] = [];
    tags: string[] = [];

    constructor(init?: Partial<IRedisClusterNode>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IRedisClusterNode> {
      const clone = { ...this };
      clone.attributes = this.attributes.filter(a => !a.isSecret);
      return clone;
    }

    toDatabaseRow(): Record<string, any> {
      return {
        id: this.id,
        org_id: this.organizationId,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        version: this.version,
        metadata_json: JSON.stringify(this.metadata),
        status_code: this.status,
        entity_name: this.name,
        description: this.description,
        attributes_json: JSON.stringify(this.attributes),
        tags_array: this.tags
      };
    }
  }

  export interface ITtlOverride {
    id: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    metadata: Record<string, any>;
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED';
    name: string;
    description?: string;
    attributes: {
      key: string;
      value: any;
      isSecret?: boolean;
      indexed?: boolean;
    }[];
    tags: string[];
  }

  export class TtlOverrideDTO implements ITtlOverride {
    id: string = '';
    organizationId: string = '';
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();
    version: number = 1;
    metadata: Record<string, any> = {};
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED' = 'ACTIVE';
    name: string = '';
    description?: string = '';
    attributes: { key: string; value: any; isSecret?: boolean; indexed?: boolean }[] = [];
    tags: string[] = [];

    constructor(init?: Partial<ITtlOverride>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ITtlOverride> {
      const clone = { ...this };
      clone.attributes = this.attributes.filter(a => !a.isSecret);
      return clone;
    }

    toDatabaseRow(): Record<string, any> {
      return {
        id: this.id,
        org_id: this.organizationId,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        version: this.version,
        metadata_json: JSON.stringify(this.metadata),
        status_code: this.status,
        entity_name: this.name,
        description: this.description,
        attributes_json: JSON.stringify(this.attributes),
        tags_array: this.tags
      };
    }
  }

  export interface ICacheMetrics {
    id: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    metadata: Record<string, any>;
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED';
    name: string;
    description?: string;
    attributes: {
      key: string;
      value: any;
      isSecret?: boolean;
      indexed?: boolean;
    }[];
    tags: string[];
  }

  export class CacheMetricsDTO implements ICacheMetrics {
    id: string = '';
    organizationId: string = '';
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();
    version: number = 1;
    metadata: Record<string, any> = {};
    status: 'ACTIVE' | 'PENDING' | 'ARCHIVED' | 'DISABLED' = 'ACTIVE';
    name: string = '';
    description?: string = '';
    attributes: { key: string; value: any; isSecret?: boolean; indexed?: boolean }[] = [];
    tags: string[] = [];

    constructor(init?: Partial<ICacheMetrics>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ICacheMetrics> {
      const clone = { ...this };
      clone.attributes = this.attributes.filter(a => !a.isSecret);
      return clone;
    }

    toDatabaseRow(): Record<string, any> {
      return {
        id: this.id,
        org_id: this.organizationId,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        version: this.version,
        metadata_json: JSON.stringify(this.metadata),
        status_code: this.status,
        entity_name: this.name,
        description: this.description,
        attributes_json: JSON.stringify(this.attributes),
        tags_array: this.tags
      };
    }
  }
}
