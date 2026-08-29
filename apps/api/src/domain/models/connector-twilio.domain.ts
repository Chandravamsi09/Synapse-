/**
 * Synapse Domain Models: Twilio SMS & Voice
 * High-performance enterprise types, DTOs, and validation logic.
 */

export namespace ConnectorTwilioDomain {

  export interface ITwilioMessage {
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

  export class TwilioMessageDTO implements ITwilioMessage {
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

    constructor(init?: Partial<ITwilioMessage>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ITwilioMessage> {
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

  export interface ITwilioCall {
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

  export class TwilioCallDTO implements ITwilioCall {
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

    constructor(init?: Partial<ITwilioCall>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ITwilioCall> {
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

  export interface ITwilioPhoneNumber {
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

  export class TwilioPhoneNumberDTO implements ITwilioPhoneNumber {
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

    constructor(init?: Partial<ITwilioPhoneNumber>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ITwilioPhoneNumber> {
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

  export interface ITwilioTwiML {
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

  export class TwilioTwiMLDTO implements ITwilioTwiML {
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

    constructor(init?: Partial<ITwilioTwiML>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ITwilioTwiML> {
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

  export interface ITwilioVerification {
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

  export class TwilioVerificationDTO implements ITwilioVerification {
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

    constructor(init?: Partial<ITwilioVerification>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ITwilioVerification> {
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

  export interface ITwilioUsageRecord {
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

  export class TwilioUsageRecordDTO implements ITwilioUsageRecord {
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

    constructor(init?: Partial<ITwilioUsageRecord>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<ITwilioUsageRecord> {
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
