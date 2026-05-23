import type { AIAdapterConfig, PromptInjection } from "@devctx/shared";
import { TokenAnalyzer } from "@devctx/token-analyzer";
import { SecuritySanitizer } from "@devctx/security";

/**
 * Base interface for all AI adapters
 */
export interface AIAdapter {
  config: AIAdapterConfig;
  injectContext(prompt: string, injection: PromptInjection): string;
  optimizePrompt(prompt: string): string;
  estimateTokens(prompt: string): number;
  sanitizeSensitiveData(text: string): string;
  formatResponseHandling(): string;
}

/**
 * OpenAI GPT adapter
 */
export class OpenAIAdapter implements AIAdapter {
  config: AIAdapterConfig;
  private tokenAnalyzer: TokenAnalyzer;
  private sanitizer: SecuritySanitizer;

  constructor(modelName: string = "gpt-4") {
    this.config = {
      modelProvider: "openai",
      modelName,
      maxContextTokens: 8000,
      costPer1kTokens: 0.03,
      supportsFunctionCalling: true,
    };
    this.tokenAnalyzer = new TokenAnalyzer();
    this.sanitizer = new SecuritySanitizer();
  }

  injectContext(prompt: string, injection: PromptInjection): string {
    return `${injection.architecture}

SECURITY CONSTRAINTS:
${injection.securityRules}

RELEVANT ARCHITECTURE DECISIONS:
${injection.previousDecisions}

CODING STANDARDS:
${injection.codeStandards}

ACTIVE FEATURES:
${injection.relatedFeatures}

---

User Request:
${prompt}`;
  }

  optimizePrompt(prompt: string): string {
    // Remove excessive whitespace
    let optimized = prompt.replace(/\n\n+/g, "\n\n").trim();

    // Remove redundant phrases
    optimized = optimized.replace(/\b(the|a|an)\b\s+(?=\1\s)/gi, "");

    return optimized;
  }

  estimateTokens(prompt: string): number {
    return Math.ceil(prompt.length / 4);
  }

  sanitizeSensitiveData(text: string): string {
    return this.sanitizer.maskSensitiveData(text);
  }

  formatResponseHandling(): string {
    return `
You are an expert AI code assistant. You understand the project architecture, security constraints, and development standards.

Guidelines:
1. Always check proposed code against security rules
2. Verify no removed features are being re-implemented
3. Follow established coding standards
4. Consider architectural implications
5. Explain security and architectural decisions`;
  }
}

/**
 * Claude (Anthropic) adapter
 */
export class ClaudeAdapter implements AIAdapter {
  config: AIAdapterConfig;
  private tokenAnalyzer: TokenAnalyzer;
  private sanitizer: SecuritySanitizer;

  constructor(modelName: string = "claude-3-sonnet") {
    this.config = {
      modelProvider: "claude",
      modelName,
      maxContextTokens: 100000, // Claude has larger context
      costPer1kTokens: 0.003,
      supportsFunctionCalling: true,
    };
    this.tokenAnalyzer = new TokenAnalyzer();
    this.sanitizer = new SecuritySanitizer();
  }

  injectContext(prompt: string, injection: PromptInjection): string {
    return `<architecture>
${injection.architecture}
</architecture>

<security_rules>
${injection.securityRules}
</security_rules>

<architecture_decisions>
${injection.previousDecisions}
</architecture_decisions>

<coding_standards>
${injection.codeStandards}
</coding_standards>

<active_features>
${injection.relatedFeatures}
</active_features>

<user_request>
${prompt}
</user_request>`;
  }

  optimizePrompt(prompt: string): string {
    // Claude handles verbose prompts well, minimal optimization needed
    return prompt.trim();
  }

  estimateTokens(prompt: string): number {
    // Claude's tokenization
    return Math.ceil(prompt.length / 3.5);
  }

  sanitizeSensitiveData(text: string): string {
    return this.sanitizer.maskSensitiveData(text);
  }

  formatResponseHandling(): string {
    return `
You are an expert software architect and security-conscious code assistant.

Your responsibilities:
1. Understand and respect the project's architecture
2. Enforce security constraints strictly
3. Prevent re-implementation of removed features
4. Follow all coding standards
5. Provide detailed explanations for design decisions
6. Consider long-term maintainability`;
  }
}

/**
 * Google Gemini adapter
 */
export class GeminiAdapter implements AIAdapter {
  config: AIAdapterConfig;
  private tokenAnalyzer: TokenAnalyzer;
  private sanitizer: SecuritySanitizer;

  constructor(modelName: string = "gemini-pro") {
    this.config = {
      modelProvider: "gemini",
      modelName,
      maxContextTokens: 32000,
      costPer1kTokens: 0.0005,
      supportsFunctionCalling: false,
    };
    this.tokenAnalyzer = new TokenAnalyzer();
    this.sanitizer = new SecuritySanitizer();
  }

  injectContext(prompt: string, injection: PromptInjection): string {
    return `# Project Context

## Architecture
${injection.architecture}

## Security Rules
${injection.securityRules}

## Architecture Decisions
${injection.previousDecisions}

## Coding Standards
${injection.codeStandards}

## Related Features
${injection.relatedFeatures}

---

## User Request
${prompt}`;
  }

  optimizePrompt(prompt: string): string {
    // Gemini is efficient, minimal optimization
    return prompt.trim();
  }

  estimateTokens(prompt: string): number {
    return Math.ceil(prompt.length / 3);
  }

  sanitizeSensitiveData(text: string): string {
    return this.sanitizer.maskSensitiveData(text);
  }

  formatResponseHandling(): string {
    return `
You are a helpful code assistant with deep understanding of software architecture.

Guidelines:
- Respect all security constraints
- Follow established coding patterns
- Avoid re-implementing removed features
- Consider architectural implications
- Provide clear, concise explanations`;
  }
}

/**
 * Amazon Q adapter
 */
export class AmazonQAdapter implements AIAdapter {
  config: AIAdapterConfig;
  private tokenAnalyzer: TokenAnalyzer;
  private sanitizer: SecuritySanitizer;

  constructor(modelName: string = "amazon-q") {
    this.config = {
      modelProvider: "amazon-q",
      modelName,
      maxContextTokens: 10000,
      costPer1kTokens: 0.0,
      supportsFunctionCalling: true,
    };
    this.tokenAnalyzer = new TokenAnalyzer();
    this.sanitizer = new SecuritySanitizer();
  }

  injectContext(prompt: string, injection: PromptInjection): string {
    return `## Development Context

### Architecture Overview
${injection.architecture}

### Security Requirements
${injection.securityRules}

### Key Decisions
${injection.previousDecisions}

### Code Standards
${injection.codeStandards}

### Current Features
${injection.relatedFeatures}

---

${prompt}`;
  }

  optimizePrompt(prompt: string): string {
    return prompt.trim();
  }

  estimateTokens(prompt: string): number {
    return Math.ceil(prompt.length / 4);
  }

  sanitizeSensitiveData(text: string): string {
    return this.sanitizer.maskSensitiveData(text);
  }

  formatResponseHandling(): string {
    return `
You are an expert software developer assistant.

Follow these guidelines:
- Understand project architecture
- Enforce security policies
- Prevent feature re-implementation
- Follow coding standards
- Explain architectural choices`;
  }
}

/**
 * Adapter factory
 */
export class AIAdapterFactory {
  static createAdapter(provider: string, modelName?: string): AIAdapter {
    switch (provider.toLowerCase()) {
      case "openai":
      case "gpt":
        return new OpenAIAdapter(modelName || "gpt-4");
      case "claude":
      case "anthropic":
        return new ClaudeAdapter(modelName || "claude-3-sonnet");
      case "gemini":
      case "google":
        return new GeminiAdapter(modelName || "gemini-pro");
      case "amazon-q":
      case "amazon":
        return new AmazonQAdapter(modelName || "amazon-q");
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  static getSupportedProviders(): string[] {
    return ["openai", "claude", "gemini", "amazon-q"];
  }
}

export function createAIAdapter(provider: string, modelName?: string): AIAdapter {
  return AIAdapterFactory.createAdapter(provider, modelName);
}
