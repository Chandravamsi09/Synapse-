/**
 * Synapse Domain Models: Jira Software Connector
 * High-performance enterprise types, DTOs, and validation logic.
 */

export namespace ConnectorJiraDomain {

  export interface IJiraProject {
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

  export class JiraProjectDTO implements IJiraProject {
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

    constructor(init?: Partial<IJiraProject>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IJiraProject> {
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

  export interface IJiraIssue {
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

  export class JiraIssueDTO implements IJiraIssue {
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

    constructor(init?: Partial<IJiraIssue>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IJiraIssue> {
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

  export interface IJiraSprint {
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

  export class JiraSprintDTO implements IJiraSprint {
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

    constructor(init?: Partial<IJiraSprint>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IJiraSprint> {
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

  export interface IJiraComment {
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

  export class JiraCommentDTO implements IJiraComment {
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

    constructor(init?: Partial<IJiraComment>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IJiraComment> {
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

  export interface IJiraStatusTransition {
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

  export class JiraStatusTransitionDTO implements IJiraStatusTransition {
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

    constructor(init?: Partial<IJiraStatusTransition>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IJiraStatusTransition> {
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

  export interface IJiraFieldMapping {
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

  export class JiraFieldMappingDTO implements IJiraFieldMapping {
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

    constructor(init?: Partial<IJiraFieldMapping>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IJiraFieldMapping> {
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
