/**
 * Synapse Domain Models: Webhook Event Dispatcher
 * High-performance enterprise types, DTOs, and validation logic.
 */

export namespace WebhookEngineDomain {

  export interface IWebhookSubscription {
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

  export class WebhookSubscriptionDTO implements IWebhookSubscription {
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

    constructor(init?: Partial<IWebhookSubscription>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IWebhookSubscription> {
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

  export interface IWebhookDeliveryAttempt {
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

  export class WebhookDeliveryAttemptDTO implements IWebhookDeliveryAttempt {
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

    constructor(init?: Partial<IWebhookDeliveryAttempt>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IWebhookDeliveryAttempt> {
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

  export interface IWebhookSignatureKey {
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

  export class WebhookSignatureKeyDTO implements IWebhookSignatureKey {
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

    constructor(init?: Partial<IWebhookSignatureKey>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IWebhookSignatureKey> {
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

  export interface IDeadLetterEntry {
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

  export class DeadLetterEntryDTO implements IDeadLetterEntry {
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

    constructor(init?: Partial<IDeadLetterEntry>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IDeadLetterEntry> {
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

  export interface IRetryQueue {
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

  export class RetryQueueDTO implements IRetryQueue {
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

    constructor(init?: Partial<IRetryQueue>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IRetryQueue> {
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

  export interface IEventFilter {
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

  export class EventFilterDTO implements IEventFilter {
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

    constructor(init?: Partial<IEventFilter>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IEventFilter> {
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
