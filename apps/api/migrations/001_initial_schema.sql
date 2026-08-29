-- Synapse PostgreSQL Initial Migration v1.0.0
-- High-Performance schema definition for API Gateway & App Integrations

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE organizations (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    tier VARCHAR(64) NOT NULL DEFAULT 'COMMUNITY_FREE',
    monthly_quota BIGINT NOT NULL DEFAULT 1000000,
    current_usage BIGINT NOT NULL DEFAULT 0,
    settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(64) NOT NULL DEFAULT 'DEVELOPER',
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE api_keys (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by_id VARCHAR(64) NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(32) NOT NULL,
    hashed_secret VARCHAR(255) NOT NULL,
    scopes TEXT[] NOT NULL DEFAULT '{"*"}',
    allowed_ips TEXT[] NOT NULL DEFAULT '{"0.0.0.0/0"}',
    rate_limit_tier VARCHAR(64) NOT NULL DEFAULT 'standard',
    requests_per_sec INTEGER NOT NULL DEFAULT 50,
    burst_limit INTEGER NOT NULL DEFAULT 100,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE api_registry (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    protocol VARCHAR(32) NOT NULL DEFAULT 'REST',
    visibility VARCHAR(32) NOT NULL DEFAULT 'PRIVATE',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    target_base_url TEXT NOT NULL,
    openapi_spec_url TEXT,
    raw_spec JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_org_slug_ver UNIQUE(organization_id, slug, version)
);

CREATE TABLE api_endpoints (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    api_id VARCHAR(64) NOT NULL REFERENCES api_registry(id) ON DELETE CASCADE,
    path_pattern VARCHAR(512) NOT NULL,
    http_method VARCHAR(16) NOT NULL,
    summary VARCHAR(255),
    description TEXT,
    is_auth_required BOOLEAN NOT NULL DEFAULT TRUE,
    rate_limit_per_min INTEGER NOT NULL DEFAULT 120,
    cache_ttl_seconds INTEGER NOT NULL DEFAULT 0,
    mock_response JSONB,
    is_mock_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_api_path_method UNIQUE(api_id, path_pattern, http_method)
);

CREATE TABLE app_integrations (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    app_identifier VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    auth_type VARCHAR(32) NOT NULL,
    credentials_enc TEXT NOT NULL,
    config_json JSONB DEFAULT '{}'::jsonb,
    webhook_secret VARCHAR(255),
    health_status VARCHAR(32) NOT NULL DEFAULT 'HEALTHY',
    last_synced_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_subscriptions (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    event_types TEXT[] NOT NULL,
    max_retries INTEGER NOT NULL DEFAULT 5,
    backoff_factor REAL NOT NULL DEFAULT 2.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_deliveries (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    subscription_id VARCHAR(64) NOT NULL REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
    event_type VARCHAR(128) NOT NULL,
    payload_json JSONB NOT NULL,
    status_code INTEGER,
    response_body TEXT,
    latency_ms INTEGER,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    attempt_count INTEGER NOT NULL DEFAULT 0,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_log_entries (
    id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    organization_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    changes_json JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_reg_org ON api_registry(organization_id);
CREATE INDEX idx_app_int_org ON app_integrations(organization_id);
CREATE INDEX idx_wh_del_sub ON webhook_deliveries(subscription_id, status);
CREATE INDEX idx_audit_org_time ON audit_log_entries(organization_id, timestamp);
