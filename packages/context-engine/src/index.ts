import type {
  ProjectMemory,
  ContextRetrievalRequest,
  RetrievedContext,
  ContextSnapshot,
  ArchitectureMemory,
  FeatureMemory,
  Decision,
  SecurityRule,
} from "@devctx/shared";
import { SecuritySanitizer } from "@devctx/security";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * Core context retrieval and management engine
 */
export class ContextEngine {
  private projectRoot: string;
  private memoryCache: Map<string, any> = new Map();
  private securitySanitizer: SecuritySanitizer;
  private snapshots: ContextSnapshot[] = [];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.securitySanitizer = new SecuritySanitizer();
  }

  /**
   * Retrieve context based on a query
   */
  async retrieveContext(request: ContextRetrievalRequest): Promise<RetrievedContext[]> {
    const memory = await this.loadProjectMemory();
    const results: RetrievedContext[] = [];

    // Retrieve architecture context
    if (request.includeArchitecture && memory.architecture) {
      const archContext = this.rankRelevance(
        request.query,
        JSON.stringify(memory.architecture),
        "architecture",
        0.8
      );
      if (archContext) results.push(archContext);
    }

    // Retrieve security rules
    if (request.includeSecurity && memory.securityRules) {
      for (const rule of memory.securityRules) {
        const ruleContext = this.rankRelevance(request.query, rule.description, "security_rule", 0.7);
        if (ruleContext) results.push(ruleContext);
      }
    }

    // Retrieve relevant features
    for (const feature of memory.features) {
      if (this.isRelevant(request.query, feature.name) || this.isRelevant(request.query, feature.description)) {
        const featureContext = this.rankRelevance(
          request.query,
          `${feature.name}: ${feature.description}`,
          "feature",
          0.8
        );
        if (featureContext) results.push(featureContext);
      }
    }

    // Retrieve relevant decisions
    for (const decision of memory.decisions) {
      if (this.isRelevant(request.query, decision.title) || this.isRelevant(request.query, decision.context)) {
        const decisionContext = this.rankRelevance(
          request.query,
          `${decision.title}: ${decision.decision}`,
          "decision",
          0.75
        );
        if (decisionContext) results.push(decisionContext);
      }
    }

    // Sort by relevance and apply limit
    results.sort((a, b) => b.relevance - a.relevance);
    return results.slice(0, request.limit || 10);
  }

  /**
   * Get architecture context for current task
   */
  async getArchitectureContext(): Promise<ArchitectureMemory> {
    const memory = await this.loadProjectMemory();
    return memory.architecture;
  }

  /**
   * Get security constraints for current context
   */
  async getSecurityContext(): Promise<SecurityRule[]> {
    const memory = await this.loadProjectMemory();
    return memory.securityRules;
  }

  /**
   * Get all removed features (prevent re-implementation)
   */
  async getRemovedFeaturesContext(): Promise<string> {
    const memory = await this.loadProjectMemory();
    return memory.removedFeatures
      .map((f) => `${f.name}: ${f.reason} - ${f.whyRemoved}`)
      .join("\n");
  }

  /**
   * Get feature-specific context
   */
  async getFeatureContext(featureName: string): Promise<FeatureMemory | undefined> {
    const memory = await this.loadProjectMemory();
    return memory.features.find((f) => f.name.toLowerCase().includes(featureName.toLowerCase()));
  }

  /**
   * Load and cache project memory
   */
  async loadProjectMemory(): Promise<ProjectMemory> {
    const cacheKey = "project-memory";

    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey) as ProjectMemory;
    }

    try {
      const memoryPath = path.join(this.projectRoot, ".devctx", "memory.json");
      const data = await fs.readFile(memoryPath, "utf-8");
      const memory = JSON.parse(data) as ProjectMemory;

      this.memoryCache.set(cacheKey, memory);
      return memory;
    } catch {
      // Return empty memory if file not found
      return this.getEmptyMemory();
    }
  }

  /**
   * Save project memory
   */
  async saveProjectMemory(memory: ProjectMemory): Promise<void> {
    const memoryDir = path.join(this.projectRoot, ".devctx");
    await fs.mkdir(memoryDir, { recursive: true });

    const memoryPath = path.join(memoryDir, "memory.json");
    await fs.writeFile(memoryPath, JSON.stringify(memory, null, 2));

    // Clear cache
    this.memoryCache.delete("project-memory");

    // Create snapshot
    this.createSnapshot(memory);
  }

  /**
   * Create compression-optimized context for AI
   */
  async getCompressedContext(request: ContextRetrievalRequest): Promise<string> {
    const contexts = await this.retrieveContext(request);

    const compressed = contexts
      .slice(0, 5) // Top 5 most relevant
      .map((ctx) => `[${ctx.source}] (relevance: ${(ctx.relevance * 100).toFixed(0)}%)\n${ctx.content}`)
      .join("\n\n---\n\n");

    return this.securitySanitizer.maskSensitiveData(compressed);
  }

  /**
   * Detect architectural violations
   */
  async detectArchitectureViolations(proposedCode: string): Promise<string[]> {
    const violations: string[] = [];
    const memory = await this.loadProjectMemory();

    // Check for removed features being reimplemented
    for (const removed of memory.removedFeatures) {
      if (removed.shouldNotReimplement.some((pattern) => proposedCode.includes(pattern))) {
        violations.push(
          `⚠️ Attempted to reimplement removed feature "${removed.name}". Reason: ${removed.reason}`
        );
      }
    }

    // Check for security rule violations
    for (const rule of memory.securityRules) {
      if (rule.severity === "critical" || rule.severity === "high") {
        // Basic pattern matching for security violations
        if (proposedCode.includes("eval(") || proposedCode.includes("Function(")) {
          violations.push(`🔒 Security violation: Dynamic code execution detected`);
        }
      }
    }

    return violations;
  }

  /**
   * Rank relevance of content to query
   */
  private rankRelevance(query: string, content: string, source: string, baseScore: number): RetrievedContext | null {
    // Simple relevance scoring (can be enhanced with ML/embeddings)
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();

    let score = baseScore;
    for (const word of queryWords) {
      if (contentLower.includes(word)) {
        score += 0.1;
      }
    }

    score = Math.min(score, 1.0);

    if (score < 0.5) return null; // Below relevance threshold

    return {
      relevance: score,
      content: content.substring(0, 500), // Truncate long content
      source,
      metadata: { query },
    };
  }

  /**
   * Check if content is relevant to query
   */
  private isRelevant(query: string, content: string): boolean {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();

    return queryWords.some((word) => contentLower.includes(word));
  }

  /**
   * Create memory snapshot
   */
  private createSnapshot(memory: ProjectMemory): void {
    const snapshot: ContextSnapshot = {
      timestamp: new Date(),
      memory,
      architecture: memory.architecture,
      hash: this.generateHash(JSON.stringify(memory)),
    };

    this.snapshots.push(snapshot);

    // Keep only last 10 snapshots
    if (this.snapshots.length > 10) {
      this.snapshots.shift();
    }
  }

  /**
   * Generate hash of memory state
   */
  private generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Get empty memory structure
   */
  private getEmptyMemory(): ProjectMemory {
    return {
      architecture: {
        overview: "",
        layers: [],
        services: [],
        databases: [],
        integrations: [],
        lastReviewed: new Date(),
      },
      features: [],
      removedFeatures: [],
      decisions: [],
      codeStandards: [],
      securityRules: [],
      apiContracts: [],
      dependencies: { dependencies: [], vulnerabilities: [] },
      notes: [],
      knownIssues: [],
      technicalDebt: [],
      futurePlans: [],
      lastUpdated: new Date(),
    };
  }
}

export function createContextEngine(projectRoot: string): ContextEngine {
  return new ContextEngine(projectRoot);
}
