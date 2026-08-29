/**
 * Synapse App Integration Connector Base Interface
 */

export interface ConnectorAction {
  id: string;
  name: string;
  description: string;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    description?: string;
  }>;
}

export interface ConnectorTrigger {
  id: string;
  name: string;
  eventType: string;
  description: string;
}

export interface IAppConnector {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly iconUrl: string;
  readonly actions: ConnectorAction[];
  readonly triggers: ConnectorTrigger[];

  testConnection(credentials: Record<string, any>): Promise<boolean>;
  executeAction(actionId: string, parameters: Record<string, any>, credentials: Record<string, any>): Promise<any>;
}
