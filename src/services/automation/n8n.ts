/**
 * ============================================================================
 * SIGNAL DESK — N8N WORKFLOW AUTOMATION INTEGRATION (PHASE 3 PREPARATION)
 * ============================================================================
 * Defines clean boundary contracts for publishing webhooks, social syndication,
 * newsletter triggers, and pipeline notifications.
 */

export type WorkflowEventType =
  | "article.published"
  | "article.updated"
  | "article.retracted"
  | "newsletter.digest_ready"
  | "tip.received";

export interface WorkflowWebhookPayload<T = unknown> {
  eventId: string;
  eventType: WorkflowEventType;
  timestamp: string;
  data: T;
  signature?: string;
}

export interface IN8nAutomationService {
  triggerWorkflow<T>(eventType: WorkflowEventType, data: T): Promise<{ success: boolean; executionId?: string }>;
  registerWebhookEndpoint(url: string, secret: string): void;
}

export class MockN8nAutomationService implements IN8nAutomationService {
  async triggerWorkflow<T>(_eventType: WorkflowEventType, _data: T) {
    // Demonstration stub: logs contract invocation without sending real network traffic
    return {
      success: true,
      executionId: `n8n-exec-${Date.now()}`,
    };
  }

  registerWebhookEndpoint() {
    // No-op mock
  }
}
