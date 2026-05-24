import type { DevContextConfig, ProjectMemory, ContextRetrievalRequest } from "@devctx/shared";
import { ContextEngine } from "@devctx/context-engine";
import { TokenAnalyzer } from "@devctx/token-analyzer";
import { AIAdapterFactory } from "@devctx/adapters";
import { GitIntelligence } from "@devctx/git-intelligence";
import { SecuritySanitizer, AdvancedSecretDetector } from "@devctx/security";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * Main DevContext Engine - orchestrates all subsystems
 */
export class DevContextEngine {
  private config: DevContextConfig;
  private contextEngine: ContextEngine;
  private tokenAnalyzer: TokenAnalyzer;
  private gitIntelligence: GitIntelligence;
  private securitySanitizer: SecuritySanitizer;
  private secretDetector: AdvancedSecretDetector;

  constructor(projectRoot: string, customConfig?: Partial<DevContextConfig>) {
    const defaultConfig: DevContextConfig = {
      projectRoot,
      devctxPath: path.join(projectRoot, ".devctx"),
      cacheDir: path.join(projectRoot, ".devctx", ".cache"),
      embeddingsProvider: "local",
      compressionLevel: "medium",
      enableSecurity: true,
      offlineMode: true,
      autoTrackActivities: true,
    };

    this.config = { ...defaultConfig, ...customConfig };
    this.contextEngine = new ContextEngine(projectRoot);
    this.tokenAnalyzer = new TokenAnalyzer();
    this.gitIntelligence = new GitIntelligence(projectRoot);
    this.securitySanitizer = new SecuritySanitizer();
    this.secretDetector = new AdvancedSecretDetector();
  }

  /**
   * Initialize project with DevContext structure
   */
  async initialize(): Promise<void> {
    const devctxPath = this.config.devctxPath;

    // Create directory structure
    const directories = [
      devctxPath,
      path.join(devctxPath, "memory"),
      path.join(devctxPath, "architecture"),
      path.join(devctxPath, "decisions"),
      path.join(devctxPath, "security"),
      path.join(devctxPath, "prompts"),
      path.join(devctxPath, "features"),
      path.join(devctxPath, "removed-features"),
      path.join(devctxPath, ".cache"),
    ];

    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
    }

    // Create starter files
    await this.createStarterFiles(devctxPath);
  }

  /**
   * Create initial configuration files
   */
  private async createStarterFiles(devctxPath: string): Promise<void> {
    const files: Record<string, string> = {
      "memory.json": JSON.stringify({ projects: {} }, null, 2),
      "architecture.md": `# Architecture Overview

## System Overview
[Add your system architecture description here]

## Key Components
- [Component 1]
- [Component 2]

## Data Flow
[Describe how data flows through the system]

## External Integrations
[List any external services]
`,
      "security.md": `# Security Constraints

## Authentication
- Method: [OAuth, JWT, etc]
- Protected Routes: [List routes]

## Authorization
- Roles: [Admin, User, etc]
- Permissions: [List permissions]

## Data Protection
- Encryption: [Algorithm and scope]
- Sensitive Fields: [List fields requiring protection]

## Security Headers
- [List headers]

## Vulnerability Management
- Known Issues: [List any known vulnerabilities]
- Fix Schedule: [Timeline for fixes]
`,
      "coding-standards.md": `# Coding Standards

## General Principles
- Follow DRY (Don't Repeat Yourself)
- Maintain SOLID principles
- Write clean, readable code

## Naming Conventions
- Variables: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE

## Code Organization
- [Add your project-specific standards]

## Testing Requirements
- Coverage threshold: [e.g., 80%]
- Test types: [unit, integration, e2e]
`,
      "ai-rules.md": `# AI Development Rules

## Do's
- ✅ Follow established architecture patterns
- ✅ Respect security constraints
- ✅ Use documented APIs
- ✅ Consider performance implications

## Don'ts
- ❌ Implement removed features
- ❌ Violate security rules
- ❌ Ignore architectural decisions
- ❌ Use deprecated patterns

## Context Requirements
- Always consider the full system context
- Check for feature conflicts
- Verify compatibility with existing code
`,
      "dependency-map.json": JSON.stringify(
        {
          core: {
            description: "Core dependencies",
            packages: [],
          },
          infrastructure: {
            description: "Infrastructure and deployment",
            packages: [],
          },
          development: {
            description: "Development tools",
            packages: [],
          },
        },
        null,
        2
      ),
      "context-config.json": JSON.stringify(
        {
          ignoredFolders: ["node_modules", "dist", ".git", "coverage"],
          secretPatterns: ["API_KEY", "SECRET", "PASSWORD", "TOKEN"],
          maxTokens: 8000,
          compressionLevel: "medium",
          embeddingsProvider: "local",
        },
        null,
        2
      ),
    };

    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(devctxPath, filename);
      if (!(await fileExists(filePath))) {
        await fs.writeFile(filePath, content);
      }
    }
  }

  /**
   * Retrieve context for AI assistant
   */
  async getAIContext(request: ContextRetrievalRequest): Promise<string> {
    const contexts = await this.contextEngine.retrieveContext(request);
    const compressed = contexts
      .slice(0, 5)
      .map((ctx: any) => `[${ctx.source}]\n${ctx.content}`)
      .join("\n\n---\n\n");

    await this.logProcessEvent(
      "context-retrieval",
      `Retrieved context for query: ${request.query}`,
      {
        query: request.query,
        processName: request.processName || "ai-context",
        includeArchitecture: Boolean(request.includeArchitecture),
        includeSecurity: Boolean(request.includeSecurity),
        retrievedItems: contexts.length,
      }
    );

    return this.securitySanitizer.maskSensitiveData(compressed);
  }

  /**
   * Scan for security issues
   */
  async scanSecurity(): Promise<SecurityScanReport> {
    const memory = await this.contextEngine.loadProjectMemory();
    const sanitizerResult = this.securitySanitizer.scanForSecrets(JSON.stringify(memory));

    await this.logProcessEvent("security-scan", "Executed security scan", {
      suspiciousPatterns: sanitizerResult.suspiciousPatterns.length,
      exposedPaths: sanitizerResult.exposedPaths.length,
      securityScore: sanitizerResult.score,
    });

    return {
      timestamp: new Date(),
      hasVulnerabilities: !sanitizerResult.hasSecrets,
      exposedPaths: sanitizerResult.exposedPaths,
      suspiciousPatterns: sanitizerResult.suspiciousPatterns,
      securityScore: sanitizerResult.score,
      recommendations: sanitizerResult.recommendations,
    };
  }

  /**
   * Analyze token usage
   */
  analyzeTokenUsage(prompts: string[], modelName: string = "gpt-4"): TokenAnalysisReport {
    const estimates = prompts.map((p) => this.tokenAnalyzer.generateEstimate(p, modelName));

    const totalTokens = estimates.reduce((sum, e) => sum + e.totalTokens, 0);
    const totalCost = estimates.reduce((sum, e) => sum + (e.estimatedCost || 0), 0);

    const report = {
      totalPrompts: prompts.length,
      totalTokens,
      totalCost,
      avgTokensPerPrompt: Math.round(totalTokens / prompts.length),
      costPerPrompt: totalCost / prompts.length,
      optimizationScore: Math.round(
        estimates.reduce((sum, e) => sum + e.optimizationScore, 0) / estimates.length
      ),
    };

    void this.logProcessEvent("token-analysis", `Analyzed token usage for model ${modelName}`, {
      modelName,
      totalPrompts: report.totalPrompts,
      totalTokens: report.totalTokens,
      totalCost: report.totalCost,
    });

    return report;
  }

  /**
   * Track feature with git
   */
  async trackFeature(featureName: string, description: string): Promise<void> {
    const memory = await this.contextEngine.loadProjectMemory();

    const feature = {
      id: `feature-${Date.now()}`,
      name: featureName,
      description,
      implementedDate: new Date(),
      files: [],
      relatedFeatures: [],
      dependencies: [],
      status: "active" as const,
    };

    memory.features.push(feature);
    memory.lastUpdated = new Date();

    await this.contextEngine.saveProjectMemory(memory);

    await this.logProcessEvent("feature-tracked", `Tracked feature: ${featureName}`, {
      featureName,
      description,
    });
  }

  /**
   * Get current project metrics
   */
  async getMetrics(): Promise<ProjectMetrics> {
    const memory = await this.contextEngine.loadProjectMemory();
    const commits = this.gitIntelligence.getRecentCommits(50);

    return {
      activeFeatures: memory.features.filter((f: any) => f.status === "active").length,
      removedFeatures: memory.removedFeatures.length,
      architectureDecisions: memory.decisions.length,
      securityRules: memory.securityRules.length,
      technicalDebt: memory.technicalDebt.length,
      recentCommits: commits.length,
      lastUpdated: memory.lastUpdated,
    };
  }

  /**
   * Export context for specific AI model
   */
  async exportContext(modelProvider: string): Promise<ExportedContext> {
    const adapter = AIAdapterFactory.createAdapter(modelProvider);
    const memory = await this.contextEngine.loadProjectMemory();
    const architecture = await this.contextEngine.getArchitectureContext();
    const securityRules = await this.contextEngine.getSecurityContext();

    const exported = {
      timestamp: new Date(),
      modelProvider,
      systemPrompt: adapter.formatResponseHandling(),
      architecture: architecture.overview,
      securityConstraints: securityRules.map((r: any) => `${r.title}: ${r.description}`).join("\n"),
      features: memory.features.map((f: any) => f.name).join(", "),
      removedFeatures: memory.removedFeatures.map((f: any) => f.name).join(", "),
      codeStandards: memory.codeStandards.map((s: any) => s.pattern).join(", "),
    };

    await this.logProcessEvent("context-export", `Exported context for provider ${modelProvider}`, {
      modelProvider,
      featureCount: memory.features.length,
      removedFeatureCount: memory.removedFeatures.length,
      securityRuleCount: memory.securityRules.length,
    });

    return exported;
  }

  /**
   * Detect conflicts in proposed code
   */
  async detectConflicts(proposedCode: string): Promise<ConflictDetectionResult> {
    const violations = await this.contextEngine.detectArchitectureViolations(proposedCode);
    const secretScan = this.securitySanitizer.scanForSecrets(proposedCode);

    await this.logProcessEvent("conflict-detection", "Ran conflict detection on proposed code", {
      architectureViolations: violations.length,
      securityIssues: secretScan.suspiciousPatterns.length,
      hasConflicts: violations.length > 0 || secretScan.hasSecrets,
    });

    return {
      hasConflicts: violations.length > 0 || secretScan.hasSecrets,
      architectureViolations: violations,
      securityIssues: secretScan.suspiciousPatterns,
      score: secretScan.score,
    };
  }

  /**
   * Get config
   */
  getConfig(): DevContextConfig {
    return this.config;
  }

  private async logProcessEvent(
    eventName: string,
    summary: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    if (!this.config.autoTrackActivities) {
      return;
    }

    try {
      const memory = await this.contextEngine.loadProjectMemory();
      const now = new Date();

      memory.notes.push({
        id: `activity-${now.getTime()}`,
        content: `${summary}\n${JSON.stringify(metadata)}`,
        tags: ["auto-activity", eventName],
        createdDate: now,
        updatedDate: now,
        relatedModules: ["core"],
      });

      const maxActivityNotes = 200;
      const activityNotes = memory.notes.filter((note: any) => note.tags?.includes("auto-activity"));
      if (activityNotes.length > maxActivityNotes) {
        const removable = activityNotes.length - maxActivityNotes;
        let removed = 0;
        memory.notes = memory.notes.filter((note: any) => {
          if (removed >= removable) return true;
          if (note.tags?.includes("auto-activity")) {
            removed += 1;
            return false;
          }
          return true;
        });
      }

      memory.lastUpdated = now;
      await this.contextEngine.saveProjectMemory(memory);
    } catch {
      // Do not fail primary operations because activity logging failed.
    }
  }
}

export interface SecurityScanReport {
  timestamp: Date;
  hasVulnerabilities: boolean;
  exposedPaths: string[];
  suspiciousPatterns: string[];
  securityScore: number;
  recommendations: string[];
}

export interface TokenAnalysisReport {
  totalPrompts: number;
  totalTokens: number;
  totalCost: number;
  avgTokensPerPrompt: number;
  costPerPrompt: number;
  optimizationScore: number;
}

export interface ProjectMetrics {
  activeFeatures: number;
  removedFeatures: number;
  architectureDecisions: number;
  securityRules: number;
  technicalDebt: number;
  recentCommits: number;
  lastUpdated: Date;
}

export interface ExportedContext {
  timestamp: Date;
  modelProvider: string;
  systemPrompt: string;
  architecture: string;
  securityConstraints: string;
  features: string;
  removedFeatures: string;
  codeStandards: string;
}

export interface ConflictDetectionResult {
  hasConflicts: boolean;
  architectureViolations: string[];
  securityIssues: string[];
  score: number;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function createDevContextEngine(projectRoot: string, config?: Partial<DevContextConfig>): DevContextEngine {
  return new DevContextEngine(projectRoot, config);
}

// Re-export key types and utilities
export * from "@devctx/shared";
export * from "@devctx/security";
export * from "@devctx/context-engine";
export * from "@devctx/token-analyzer";
export * from "@devctx/adapters";
export * from "@devctx/git-intelligence";
