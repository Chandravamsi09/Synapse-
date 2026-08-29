/**
 * Synapse Role-Based Access Control (RBAC) & Scope Authorization Matrix
 */

export type Role = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'DEVELOPER' | 'ANALYST' | 'AUDITOR' | 'VIEWER';

export type Permission =
  | 'org:read'
  | 'org:write'
  | 'org:delete'
  | 'api:read'
  | 'api:create'
  | 'api:update'
  | 'api:delete'
  | 'api:proxy'
  | 'key:generate'
  | 'key:revoke'
  | 'webhook:manage'
  | 'analytics:view'
  | 'analytics:export'
  | 'billing:manage'
  | 'audit:read';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'org:read', 'org:write', 'org:delete',
    'api:read', 'api:create', 'api:update', 'api:delete', 'api:proxy',
    'key:generate', 'key:revoke',
    'webhook:manage',
    'analytics:view', 'analytics:export',
    'billing:manage',
    'audit:read'
  ],
  ORG_ADMIN: [
    'org:read', 'org:write',
    'api:read', 'api:create', 'api:update', 'api:delete', 'api:proxy',
    'key:generate', 'key:revoke',
    'webhook:manage',
    'analytics:view', 'analytics:export',
    'billing:manage',
    'audit:read'
  ],
  DEVELOPER: [
    'org:read',
    'api:read', 'api:create', 'api:update', 'api:proxy',
    'key:generate', 'key:revoke',
    'webhook:manage',
    'analytics:view'
  ],
  ANALYST: [
    'org:read',
    'api:read',
    'analytics:view', 'analytics:export'
  ],
  AUDITOR: [
    'org:read',
    'audit:read',
    'analytics:view'
  ],
  VIEWER: [
    'org:read',
    'api:read'
  ]
};

export class RbacService {
  /**
   * Check if a given role possesses a specific permission
   */
  hasPermission(role: Role | string, requiredPermission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role as Role] || [];
    return permissions.includes(requiredPermission);
  }

  /**
   * Check if a token scopes array satisfies the required scope
   */
  hasScope(tokenScopes: string[], requiredScope: string): boolean {
    if (tokenScopes.includes('*')) return true;
    if (tokenScopes.includes(requiredScope)) return true;

    // Handle wildcard matching like api:*
    const [domain, action] = requiredScope.split(':');
    if (tokenScopes.includes(`${domain}:*`)) return true;

    return false;
  }
}
