// Core type definitions for DevContext Engine

export interface DevContextConfig {
  projectRoot: string;
  devctxPath: string;
  cacheDir: string;
  embeddingsProvider: "local" | "openai" | "huggingface";
  maxTokens?: number;
  compressionLevel?: "low" | "medium" | "high";
  enableSecurity: boolean;
  offlineMode: boolean;
  secretPatterns?: RegExp[];
}

export interface ProjectMemory {
  architecture: ArchitectureMemory;
  features: FeatureMemory[];
  removedFeatures: RemovedFeatureMemory[];
  decisions: Decision[];
  codeStandards: CodingStandard[];
  securityRules: SecurityRule[];
  apiContracts: APIContract[];
  dependencies: DependencyMap;
  notes: DeveloperNote[];
  knownIssues: Issue[];
  technicalDebt: TechDebt[];
  futurePlans: FuturePlan[];
  lastUpdated: Date;
}

export interface ArchitectureMemory {
  overview: string;
  layers: ArchitectureLayer[];
  services: ServiceDescription[];
  databases: DatabaseDescription[];
  integrations: Integration[];
  diagrams?: string[];
  lastReviewed: Date;
}

export interface ArchitectureLayer {
  name: string;
  description: string;
  modules: string[];
  responsibilities: string[];
}

export interface ServiceDescription {
  name: string;
  description: string;
  language: string;
  path: string;
  dependencies: string[];
  exposedAPIs: string[];
}

export interface DatabaseDescription {
  name: string;
  type: "sql" | "nosql" | "cache" | "search";
  schema?: string;
  models: string[];
}

export interface Integration {
  name: string;
  type: string;
  endpoint: string;
  authMethod: string;
  criticality: "low" | "medium" | "high";
}

export interface FeatureMemory {
  id: string;
  name: string;
  description: string;
  implementedDate: Date;
  files: string[];
  relatedFeatures: string[];
  dependencies: string[];
  status: "active" | "deprecated" | "alpha";
  securityImplications?: string[];
}

export interface RemovedFeatureMemory {
  id: string;
  name: string;
  description: string;
  reason: string;
  removedDate: Date;
  files: string[];
  whyRemoved: string;
  shouldNotReimplement: string[];
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  decision: string;
  consequences: string[];
  alternatives: string[];
  decidedDate: Date;
  decidedBy: string;
  relatedDecisions: string[];
}

export interface CodingStandard {
  pattern: string;
  description: string;
  reasoning: string;
  exceptions?: string[];
  files: string[];
}

export interface SecurityRule {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  checkFunction?: string;
  relatedFeatures: string[];
  lastAuditDate?: Date;
}

export interface APIContract {
  name: string;
  endpoint: string;
  method: string;
  requestSchema: Record<string, any>;
  responseSchema: Record<string, any>;
  errorCodes: string[];
  authentication: string;
  rateLimit?: string;
  deprecatedDate?: Date;
}

export interface DependencyMap {
  dependencies: DependencyInfo[];
  vulnerabilities: Vulnerability[];
  updateSchedule?: string;
}

export interface DependencyInfo {
  name: string;
  version: string;
  path: string;
  purpose: string;
  criticalityLevel: "low" | "medium" | "high";
  lastChecked: Date;
}

export interface Vulnerability {
  id: string;
  dependencyName: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  fixedVersion?: string;
  discoveredDate: Date;
  status: "open" | "mitigated" | "fixed";
}

export interface DeveloperNote {
  id: string;
  content: string;
  tags: string[];
  createdDate: Date;
  updatedDate: Date;
  relatedModules: string[];
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  status: "open" | "investigating" | "workaround" | "resolved";
  discoveredDate: Date;
  workaround?: string;
  relatedCode: string[];
}

export interface TechDebt {
  id: string;
  title: string;
  description: string;
  location: string;
  effort: "small" | "medium" | "large";
  impact: "low" | "medium" | "high";
  createdDate: Date;
  priority: number;
}

export interface FuturePlan {
  id: string;
  title: string;
  description: string;
  targetDate?: Date;
  relatedArchitecture: string[];
  estimatedEffort: string;
  dependencies: string[];
}

export interface ContextRetrievalRequest {
  query: string;
  limit?: number;
  filters?: ContextFilter[];
  includeArchitecture?: boolean;
  includeSecurity?: boolean;
}

export interface ContextFilter {
  type: "module" | "feature" | "service" | "decision";
  values: string[];
}

export interface RetrievedContext {
  relevance: number;
  content: string;
  source: string;
  metadata: Record<string, any>;
}

export interface AIAdapterConfig {
  modelProvider: "openai" | "claude" | "gemini" | "amazon-q" | "ollama" | "local";
  modelName: string;
  maxContextTokens: number;
  costPer1kTokens?: number;
  supportsFunctionCalling?: boolean;
}

export interface PromptInjection {
  architecture: string;
  securityRules: string;
  relatedFeatures: string;
  previousDecisions: string;
  codeStandards: string;
}

export interface TokenEstimate {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost?: number;
  optimizationScore: number;
}

export interface SecurityScanResult {
  hasSecrets: boolean;
  exposedPaths: string[];
  suspiciousPatterns: string[];
  recommendations: string[];
  score: number;
}

export interface EmbeddingVector {
  id: string;
  content: string;
  vector: number[];
  metadata: Record<string, any>;
}

export interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: Record<string, any>;
}

export interface GitChange {
  hash: string;
  message: string;
  author: string;
  date: Date;
  filesChanged: string[];
  architectureImpact: string;
  featureRelated: string[];
}

export interface ContextSnapshot {
  timestamp: Date;
  memory: ProjectMemory;
  architecture: ArchitectureMemory;
  hash: string;
}

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error"
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
