export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolInput {
  tool: string;
  plan: string;
  spend: number;
  seats: number;
}

export interface AuditFormData {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
}

export interface Recommendation {
  tool: string;
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  recommendation: string;
  reason: string;
  alternativeTool?: string;
  alternativePlan?: string;
  alternativeReason?: string;
}
