import type { TokenEstimate, AIAdapterConfig } from "@devctx/shared";

/**
 * Token counter and cost analyzer for AI prompts
 */
export class TokenAnalyzer {
  private readonly modelConfigs: Map<string, ModelTokenConfig> = new Map([
    ["gpt-4", { inputCost: 0.03, outputCost: 0.06, tokensPerMessage: 3 }],
    ["gpt-3.5-turbo", { inputCost: 0.0005, outputCost: 0.0015, tokensPerMessage: 3 }],
    ["claude-3-opus", { inputCost: 0.015, outputCost: 0.075, tokensPerMessage: 4 }],
    ["claude-3-sonnet", { inputCost: 0.003, outputCost: 0.015, tokensPerMessage: 4 }],
    ["gemini-pro", { inputCost: 0.0005, outputCost: 0.0015, tokensPerMessage: 3 }],
  ]);

  /**
   * Estimate tokens for a prompt
   */
  estimatePromptTokens(text: string): number {
    // Rough estimation: average 4 chars per token
    const estimatedTokens = Math.ceil(text.length / 4);
    return estimatedTokens;
  }

  /**
   * Estimate total tokens including system prompt
   */
  estimateTotalTokens(
    userMessage: string,
    systemPrompt?: string,
    contextSize: number = 0
  ): number {
    let total = 0;

    if (systemPrompt) {
      total += this.estimatePromptTokens(systemPrompt);
    }

    total += this.estimatePromptTokens(userMessage);
    total += contextSize;

    // Add message overhead
    total += 10; // Buffer for formatting

    return total;
  }

  /**
   * Estimate completion tokens (rough estimate)
   */
  estimateCompletionTokens(expectedLength: string = "medium"): number {
    const estimates: Record<string, number> = {
      short: 100,
      medium: 500,
      long: 2000,
    };

    return estimates[expectedLength] || 500;
  }

  /**
   * Calculate cost of API call
   */
  calculateCost(modelName: string, inputTokens: number, outputTokens: number): number {
    const config = this.modelConfigs.get(modelName);
    if (!config) {
      console.warn(`Unknown model: ${modelName}`);
      return 0;
    }

    const inputCost = (inputTokens / 1000) * config.inputCost;
    const outputCost = (outputTokens / 1000) * config.outputCost;

    return inputCost + outputCost;
  }

  /**
   * Generate full token estimate with costs
   */
  generateEstimate(
    userMessage: string,
    modelName: string,
    systemPrompt?: string,
    contextSize: number = 0
  ): TokenEstimate {
    const promptTokens = this.estimateTotalTokens(userMessage, systemPrompt, contextSize);
    const completionTokens = this.estimateCompletionTokens("medium");
    const totalTokens = promptTokens + completionTokens;

    const estimatedCost = this.calculateCost(modelName, promptTokens, completionTokens);

    // Optimization score: lower tokens = higher score
    const optimizationScore = Math.max(0, 100 - (totalTokens / 10));

    return {
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCost,
      optimizationScore: Math.round(optimizationScore),
    };
  }

  /**
   * Analyze prompt for optimization opportunities
   */
  analyzePromptOptimization(prompt: string): PromptOptimizationResult {
    const issues: OptimizationIssue[] = [];

    // Check for redundancy
    const words = prompt.split(/\s+/);
    const wordFreq = new Map<string, number>();
    for (const word of words) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }

    // Find repeated words/phrases
    let totalRepetitions = 0;
    for (const [word, freq] of wordFreq.entries()) {
      if (freq > 3 && word.length > 4) {
        totalRepetitions += (freq - 1) * word.length;
        issues.push({
          type: "redundancy",
          description: `Word "${word}" repeated ${freq} times`,
          savingsEstimate: (freq - 1) * 2, // Estimated tokens saved
        });
      }
    }

    // Check for unnecessary verbosity
    if (prompt.length > 5000) {
      issues.push({
        type: "verbosity",
        description: "Prompt exceeds 5000 characters",
        savingsEstimate: Math.floor(prompt.length / 20),
      });
    }

    // Check for excessive whitespace
    const whitespaceMatches = prompt.match(/\n\n+/g) || [];
    if (whitespaceMatches.length > 5) {
      issues.push({
        type: "whitespace",
        description: "Excessive blank lines detected",
        savingsEstimate: whitespaceMatches.length * 2,
      });
    }

    const totalSavings = issues.reduce((sum, issue) => sum + issue.savingsEstimate, 0);

    return {
      issues,
      totalTokensSavable: totalSavings,
      optimizationPercentage: Math.round((totalSavings / this.estimatePromptTokens(prompt)) * 100),
    };
  }

  /**
   * Compare costs across models
   */
  compareModelCosts(
    userMessage: string,
    modelNames: string[],
    systemPrompt?: string
  ): ModelCostComparison[] {
    const comparisons: ModelCostComparison[] = [];

    for (const model of modelNames) {
      const estimate = this.generateEstimate(userMessage, model, systemPrompt);
      comparisons.push({
        model,
        estimatedTokens: estimate.totalTokens,
        estimatedCost: estimate.estimatedCost || 0,
      });
    }

    // Sort by cost
    comparisons.sort((a, b) => a.estimatedCost - b.estimatedCost);

    return comparisons;
  }

  /**
   * Get model pricing info
   */
  getModelPricing(modelName: string): ModelTokenConfig | null {
    return this.modelConfigs.get(modelName) || null;
  }

  /**
   * Add custom model pricing
   */
  addModelConfig(modelName: string, config: ModelTokenConfig): void {
    this.modelConfigs.set(modelName, config);
  }

  /**
   * Format cost for display
   */
  formatCost(cost: number): string {
    if (cost < 0.001) {
      return `$${(cost * 1000000).toFixed(2)}µ`; // Microencentric format
    }
    if (cost < 0.01) {
      return `$${(cost * 1000).toFixed(2)}m`; // Millicents format
    }
    return `$${cost.toFixed(4)}`;
  }

  /**
   * Generate analytics report
   */
  generateAnalyticsReport(prompts: string[], model: string = "gpt-4"): AnalyticsReport {
    const estimates = prompts.map((p) => this.generateEstimate(p, model));

    const totalTokens = estimates.reduce((sum, e) => sum + e.totalTokens, 0);
    const totalCost = estimates.reduce((sum, e) => sum + (e.estimatedCost || 0), 0);
    const avgTokensPerPrompt = Math.round(totalTokens / prompts.length);
    const avgCostPerPrompt = totalCost / prompts.length;

    return {
      totalPrompts: prompts.length,
      totalTokens,
      totalCost,
      averageTokensPerPrompt: avgTokensPerPrompt,
      averageCostPerPrompt: avgCostPerPrompt,
      costSavingOpportunities: this.calculateSavingOpportunities(prompts),
    };
  }

  private calculateSavingOpportunities(prompts: string[]): string[] {
    const opportunities: string[] = [];

    let totalVerbosity = 0;
    for (const prompt of prompts) {
      totalVerbosity += prompt.length;
    }

    if (totalVerbosity > 50000) {
      opportunities.push("Consider implementing context compression to reduce prompt size");
    }

    if (prompts.length > 10) {
      opportunities.push("High prompt volume detected. Consider batch processing.");
    }

    if (prompts.some((p) => p.length > 10000)) {
      opportunities.push("Some prompts are very large. Consider chunking or summarization.");
    }

    return opportunities;
  }
}

export interface ModelTokenConfig {
  inputCost: number;
  outputCost: number;
  tokensPerMessage: number;
}

export interface PromptOptimizationResult {
  issues: OptimizationIssue[];
  totalTokensSavable: number;
  optimizationPercentage: number;
}

export interface OptimizationIssue {
  type: "redundancy" | "verbosity" | "whitespace";
  description: string;
  savingsEstimate: number;
}

export interface ModelCostComparison {
  model: string;
  estimatedTokens: number;
  estimatedCost: number;
}

export interface AnalyticsReport {
  totalPrompts: number;
  totalTokens: number;
  totalCost: number;
  averageTokensPerPrompt: number;
  averageCostPerPrompt: number;
  costSavingOpportunities: string[];
}

export function createTokenAnalyzer(): TokenAnalyzer {
  return new TokenAnalyzer();
}
