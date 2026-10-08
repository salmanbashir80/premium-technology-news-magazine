/**
 * ============================================================================
 * SIGNAL DESK — HERMES AI RESEARCH ENGINE INTEGRATION (PHASE 3 PREPARATION)
 * ============================================================================
 * Defines clean boundary contracts for AI-assisted news gathering,
 * lead ingestion, source validation, and editorial draft generation.
 */

export interface ResearchLead {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceDomain: string;
  discoveredAt: string;
  credibilityScore: number; // 0 to 1
  rawSummary: string;
  suggestedAngle: string;
  targetCategory: string;
  keyEntities: string[];
}

export interface ResearchBrief {
  id: string;
  leadId: string;
  headline: string;
  workingThesis: string;
  keyFacts: string[];
  primarySources: Array<{
    title: string;
    url: string;
    institution: string;
  }>;
  suggestedTakeaways: string[];
  outlineSections: string[];
  riskNotes?: string;
  generatedAt: string;
}

export interface IHermesResearchService {
  discoverLeads(query?: string, category?: string): Promise<ResearchLead[]>;
  generateBrief(leadId: string): Promise<ResearchBrief>;
  validateCitations(sources: Array<{ url: string; claim: string }>): Promise<Array<{ url: string; verified: boolean; confidence: number }>>;
}

/**
 * Mock implementation returning structured demo research contracts.
 */
export class MockHermesResearchService implements IHermesResearchService {
  async discoverLeads(): Promise<ResearchLead[]> {
    return [
      {
        id: "lead-ai-infra",
        sourceUrl: "https://example.com/energy-grid-report",
        sourceTitle: "Regional Grid Interconnection Queues Expand Rapidly",
        sourceDomain: "example.com",
        discoveredAt: new Date().toISOString(),
        credibilityScore: 0.94,
        rawSummary: "Data center power constraints continue driving behind-the-meter generation deals.",
        suggestedAngle: "The shift from megawatt deals to dedicated substation ownership.",
        targetCategory: "ai",
        keyEntities: ["ERCOT", "PJM", "NVIDIA", "Dominion"],
      },
    ];
  }

  async generateBrief(leadId: string): Promise<ResearchBrief> {
    return {
      id: `brief-${leadId}`,
      leadId,
      headline: "The Grid Bottleneck Behind AI Clusters",
      workingThesis: "Hyperscalers are transitioning into de facto power utility operators.",
      keyFacts: ["Substation lead times now exceed 36 months in Tier 1 markets."],
      primarySources: [
        {
          title: "Grid Interconnection Report 2026",
          url: "https://example.com/report",
          institution: "Energy Regulatory Council",
        },
      ],
      suggestedTakeaways: ["Power availability has superseded chip delivery as the primary milestone."],
      outlineSections: ["I. Queue Realities", "II. Behind-the-Meter Solutions", "III. Policy Fallout"],
      generatedAt: new Date().toISOString(),
    };
  }

  async validateCitations(sources: Array<{ url: string; claim: string }>) {
    return sources.map((s) => ({ url: s.url, verified: true, confidence: 0.95 }));
  }
}
