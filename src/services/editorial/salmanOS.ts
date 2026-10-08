/**
 * ============================================================================
 * SIGNAL DESK — SALMAN OS EDITORIAL APPROVAL ENGINE (PHASE 3 PREPARATION)
 * ============================================================================
 * Defines clean boundary contracts for human-in-the-loop editorial governance,
 * article sign-offs, legal compliance reviews, and publication gates.
 */

export type EditorialApprovalState =
  | "draft"
  | "fact_check_review"
  | "legal_review"
  | "editor_in_chief_review"
  | "approved"
  | "published"
  | "rejected";

export interface ApprovalGate {
  id: string;
  articleId: string;
  reviewerId: string;
  reviewerName: string;
  state: EditorialApprovalState;
  reviewedAt: string;
  comments?: string;
  rejectionReason?: string;
}

export interface ISalmanOSEditorialService {
  getArticleState(articleId: string): Promise<EditorialApprovalState>;
  submitForReview(articleId: string, requestedState: EditorialApprovalState): Promise<ApprovalGate>;
  approve(articleId: string, reviewerId: string, reviewerName: string): Promise<ApprovalGate>;
  reject(articleId: string, reviewerId: string, reason: string): Promise<ApprovalGate>;
}

export class MockSalmanOSEditorialService implements ISalmanOSEditorialService {
  async getArticleState(): Promise<EditorialApprovalState> {
    return "published";
  }

  async submitForReview(articleId: string, requestedState: EditorialApprovalState): Promise<ApprovalGate> {
    return {
      id: `gate-${Date.now()}`,
      articleId,
      reviewerId: "editor-salman",
      reviewerName: "Salman Desk Chief",
      state: requestedState,
      reviewedAt: new Date().toISOString(),
    };
  }

  async approve(articleId: string, reviewerId: string, reviewerName: string): Promise<ApprovalGate> {
    return {
      id: `gate-approved-${Date.now()}`,
      articleId,
      reviewerId,
      reviewerName,
      state: "approved",
      reviewedAt: new Date().toISOString(),
    };
  }

  async reject(articleId: string, reviewerId: string, reason: string): Promise<ApprovalGate> {
    return {
      id: `gate-rejected-${Date.now()}`,
      articleId,
      reviewerId,
      reviewerName: "Desk Reviewer",
      state: "rejected",
      rejectionReason: reason,
      reviewedAt: new Date().toISOString(),
    };
  }
}
