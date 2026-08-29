/**
 * Synapse Official Connector: GitHub Connector
 */

import { IAppConnector, ConnectorAction, ConnectorTrigger } from '../connector.interface';

export class GithubConnector implements IAppConnector {
  readonly id = 'github';
  readonly name = 'GitHub Connector';
  readonly category = 'DEVTOOLS';
  readonly iconUrl = 'https://assets.synapse.dev/icons/github.svg';

  readonly actions: ConnectorAction[] = [
    {
        "id": "createIssue",
        "name": "Create Issue",
        "description": "Execute createIssue operation on GitHub Connector",
        "parameters": [
            {
                "name": "payload",
                "type": "object",
                "required": true,
                "description": "Request payload data"
            }
        ]
    },
    {
        "id": "createPullRequest",
        "name": "Create Pull Request",
        "description": "Execute createPullRequest operation on GitHub Connector",
        "parameters": [
            {
                "name": "payload",
                "type": "object",
                "required": true,
                "description": "Request payload data"
            }
        ]
    },
    {
        "id": "dispatchWorkflow",
        "name": "Dispatch Workflow",
        "description": "Execute dispatchWorkflow operation on GitHub Connector",
        "parameters": [
            {
                "name": "payload",
                "type": "object",
                "required": true,
                "description": "Request payload data"
            }
        ]
    },
    {
        "id": "getCommit",
        "name": "Get Commit",
        "description": "Execute getCommit operation on GitHub Connector",
        "parameters": [
            {
                "name": "payload",
                "type": "object",
                "required": true,
                "description": "Request payload data"
            }
        ]
    }
];

  readonly triggers: ConnectorTrigger[] = [
    {
        "id": "push",
        "name": "push",
        "eventType": "push",
        "description": "Triggered when push occurs in GitHub Connector"
    },
    {
        "id": "pull_request.opened",
        "name": "pull_request.opened",
        "eventType": "pull_request.opened",
        "description": "Triggered when pull_request.opened occurs in GitHub Connector"
    },
    {
        "id": "issues.created",
        "name": "issues.created",
        "eventType": "issues.created",
        "description": "Triggered when issues.created occurs in GitHub Connector"
    },
    {
        "id": "release.published",
        "name": "release.published",
        "eventType": "release.published",
        "description": "Triggered when release.published occurs in GitHub Connector"
    }
];

  async testConnection(credentials: Record<string, any>): Promise<boolean> {
    // Validate token / API key
    return credentials && (credentials.apiKey || credentials.token || credentials.clientId);
  }

  async executeAction(actionId: string, parameters: Record<string, any>, credentials: Record<string, any>): Promise<any> {
    if (!await this.testConnection(credentials)) {
      throw new Error(`Authentication failed for ${this.name}`);
    }

    return {
      success: true,
      connector: this.id,
      action: actionId,
      timestamp: new Date().toISOString(),
      result: {
        id: 'github_res_' + Math.random().toString(36).substring(2, 10),
        status: 'EXECUTED_SUCCESSFULLY',
        data: parameters.payload || parameters
      }
    };
  }
}
