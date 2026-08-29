/**
 * Synapse Domain Models: GitHub Integration Connector
 * High-performance enterprise types, DTOs, and validation logic.
 */

export namespace ConnectorGithubDomain {

  export interface IGithubRepo {
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

  export class GithubRepoDTO implements IGithubRepo {
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

    constructor(init?: Partial<IGithubRepo>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IGithubRepo> {
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

  export interface IGithubIssue {
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

  export class GithubIssueDTO implements IGithubIssue {
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

    constructor(init?: Partial<IGithubIssue>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IGithubIssue> {
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

  export interface IGithubPullRequest {
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

  export class GithubPullRequestDTO implements IGithubPullRequest {
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

    constructor(init?: Partial<IGithubPullRequest>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IGithubPullRequest> {
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

  export interface IGithubWebhookPayload {
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

  export class GithubWebhookPayloadDTO implements IGithubWebhookPayload {
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

    constructor(init?: Partial<IGithubWebhookPayload>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IGithubWebhookPayload> {
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

  export interface IGithubWorkflow {
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

  export class GithubWorkflowDTO implements IGithubWorkflow {
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

    constructor(init?: Partial<IGithubWorkflow>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IGithubWorkflow> {
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

  export interface IGithubRelease {
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

  export class GithubReleaseDTO implements IGithubRelease {
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

    constructor(init?: Partial<IGithubRelease>) {
      if (init) Object.assign(this, init);
    }

    validate(): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!this.id) errors.push('Field "id" is mandatory');
      if (!this.organizationId) errors.push('Field "organizationId" is mandatory');
      if (!this.name) errors.push('Field "name" is mandatory');
      return { isValid: errors.length === 0, errors };
    }

    sanitizeForClient(): Partial<IGithubRelease> {
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
