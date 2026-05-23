# API Reference

## Core SDK

### DevContextEngine

Main orchestration class that coordinates all subsystems.

```typescript
class DevContextEngine {
  constructor(projectRoot: string, config?: Partial<DevContextConfig>)
  
  // Initialization
  async initialize(): Promise<void>
  
  // Context Retrieval
  async getAIContext(request: ContextRetrievalRequest): Promise<string>
  
  // Security
  async scanSecurity(): Promise<SecurityScanReport>
  async detectConflicts(proposedCode: string): Promise<ConflictDetectionResult>
  
  // Analysis
  analyzeTokenUsage(prompts: string[], modelName?: string): TokenAnalysisReport
  async getMetrics(): Promise<ProjectMetrics>
  
  // Memory Management
  async trackFeature(featureName: string, description: string): Promise<void>
  
  // Export
  async exportContext(modelProvider: string): Promise<ExportedContext>
  
  // Configuration
  getConfig(): DevContextConfig
}
```

### ContextEngine

Handles context retrieval and management.

```typescript
class ContextEngine {
  constructor(projectRoot: string)
  
  async retrieveContext(request: ContextRetrievalRequest): Promise<RetrievedContext[]>
  async getArchitectureContext(): Promise<ArchitectureMemory>
  async getSecurityContext(): Promise<SecurityRule[]>
  async getFeatureContext(featureName: string): Promise<FeatureMemory | undefined>
  async loadProjectMemory(): Promise<ProjectMemory>
  async saveProjectMemory(memory: ProjectMemory): Promise<void>
  async detectArchitectureViolations(proposedCode: string): Promise<string[]>
}
```

### TokenAnalyzer

Token counting and cost analysis.

```typescript
class TokenAnalyzer {
  estimatePromptTokens(text: string): number
  estimateTotalTokens(userMessage: string, systemPrompt?: string, contextSize?: number): number
  calculateCost(modelName: string, inputTokens: number, outputTokens: number): number
  generateEstimate(userMessage: string, modelName: string, systemPrompt?: string): TokenEstimate
  compareModelCosts(userMessage: string, modelNames: string[]): ModelCostComparison[]
  analyzePromptOptimization(prompt: string): PromptOptimizationResult
  getModelPricing(modelName: string): ModelTokenConfig | null
}
```

### SecuritySanitizer

Security and sanitization operations.

```typescript
class SecuritySanitizer {
  constructor(customPatterns?: RegExp[])
  
  scanForSecrets(text: string): SecurityScanResult
  redact(text: string, placeholder?: string): string
  maskSensitiveData(text: string): string
  isSafeForAI(text: string): boolean
}
```

### AdvancedSecretDetector

Advanced secret detection with ML techniques.

```typescript
class AdvancedSecretDetector {
  detectSecrets(content: string): {
    secrets: SecretMatch[]
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    details: string[]
  }
}
```

### AIAdapterFactory

Factory for creating AI adapters.

```typescript
class AIAdapterFactory {
  static createAdapter(provider: string, modelName?: string): AIAdapter
  static getSupportedProviders(): string[]
}
```

### Available Adapters

- `OpenAIAdapter` - OpenAI GPT models
- `ClaudeAdapter` - Anthropic Claude models
- `GeminiAdapter` - Google Gemini
- `AmazonQAdapter` - Amazon Q

### GitIntelligence

Git-based architecture and feature tracking.

```typescript
class GitIntelligence {
  constructor(projectRoot: string)
  
  getRecentCommits(count?: number): GitChange[]
  analyzeArchitectureImpact(commitMessage: string): string
  getFeatureEvolution(featureName: string): FeatureEvolution
  analyzeRollbackData(commitHash: string): RollbackAnalysis
  getArchitectureTimeline(): ArchitectureChange[]
  identifyRemovedFeatures(): RemovedFeatureAnalysis[]
  compareCommits(commit1: string, commit2: string): CommitComparison
}
```

### CodeAnalyzer

Multi-language code analysis.

```typescript
class CodeAnalyzer {
  analyzeFile(content: string, language: string, filePath: string): ParsedFile
  detectAPIContracts(content: string, language: string): APIContractDetection[]
}
```

## Interfaces

### ContextRetrievalRequest

```typescript
interface ContextRetrievalRequest {
  query: string
  limit?: number
  filters?: ContextFilter[]
  includeArchitecture?: boolean
  includeSecurity?: boolean
}
```

### RetrievedContext

```typescript
interface RetrievedContext {
  relevance: number        // 0-1 score
  content: string
  source: string          // "architecture", "feature", etc.
  metadata: Record<string, any>
}
```

### TokenEstimate

```typescript
interface TokenEstimate {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost?: number
  optimizationScore: number
}
```

### SecurityScanResult

```typescript
interface SecurityScanResult {
  hasSecrets: boolean
  exposedPaths: string[]
  suspiciousPatterns: string[]
  recommendations: string[]
  score: number            // 0-100
}
```

### ArchitectureMemory

```typescript
interface ArchitectureMemory {
  overview: string
  layers: ArchitectureLayer[]
  services: ServiceDescription[]
  databases: DatabaseDescription[]
  integrations: Integration[]
  diagrams?: string[]
  lastReviewed: Date
}
```

### ProjectMemory

```typescript
interface ProjectMemory {
  architecture: ArchitectureMemory
  features: FeatureMemory[]
  removedFeatures: RemovedFeatureMemory[]
  decisions: Decision[]
  codeStandards: CodingStandard[]
  securityRules: SecurityRule[]
  apiContracts: APIContract[]
  dependencies: DependencyMap
  notes: DeveloperNote[]
  knownIssues: Issue[]
  technicalDebt: TechDebt[]
  futurePlans: FuturePlan[]
  lastUpdated: Date
}
```

## CLI Usage

### Commands

```bash
# Initialization
devctx init

# Memory Management
devctx sync
devctx context <query>
devctx memory search <term>
devctx track <feature> [description]
devctx metrics

# Analysis
devctx tokens [-m model] [--cost]
devctx security-scan

# Export
devctx export -m <provider>

# Help
devctx help
```

### Examples

```bash
# Initialize a new project
devctx init

# Sync project state
devctx sync

# Get context for a task
devctx context "implement user authentication"

# Analyze tokens for Claude
devctx tokens -m claude --cost

# Search memory for references to a feature
devctx memory search "payment processing"

# Export context optimized for OpenAI
devctx export -m openai

# Run security scan
devctx security-scan

# Track a new feature
devctx track "two-factor-auth" "Add optional 2FA support"

# Show project metrics
devctx metrics
```

## Configuration

### DevContextConfig

```typescript
interface DevContextConfig {
  projectRoot: string
  devctxPath: string
  cacheDir: string
  embeddingsProvider: "local" | "openai" | "huggingface"
  maxTokens?: number
  compressionLevel?: "low" | "medium" | "high"
  enableSecurity: boolean
  offlineMode: boolean
  secretPatterns?: RegExp[]
}
```

### context-config.json

```json
{
  "ignoredFolders": [
    "node_modules",
    "dist",
    "coverage",
    ".git"
  ],
  "secretPatterns": [
    "API_KEY",
    "SECRET",
    "PASSWORD",
    "TOKEN"
  ],
  "maxTokens": 8000,
  "compressionLevel": "medium",
  "embeddingsProvider": "local",
  "security": {
    "enableSecretScanning": true,
    "enableEntropyDetection": true,
    "redactionPlaceholder": "[REDACTED]"
  }
}
```

## Error Handling

All methods may throw the following errors:

- `Error` - General operation failures
- `FileNotFoundError` - Configuration or memory files not found
- `SecurityError` - Security validation failures
- `ValidationError` - Invalid input parameters

Recommended error handling:

```typescript
try {
  const context = await engine.getAIContext(request);
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to retrieve context:', error.message);
    // Provide sensible default or ask user to fix configuration
  }
}
```

## Versioning

API follows semantic versioning:
- **Major:** Breaking changes to public APIs
- **Minor:** New features, backward compatible
- **Patch:** Bug fixes

---

**API Version:** 0.1.0  
**Last Updated:** 2024
