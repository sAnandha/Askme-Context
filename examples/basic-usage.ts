#!/usr/bin/env node

/**
 * Example 1: Basic Usage
 * Shows how to initialize and use DevContext Engine in a TypeScript project
 */

import { createDevContextEngine } from "@devctx/core";

async function example1_basicUsage() {
  console.log("=== Example 1: Basic Usage ===\n");

  // Initialize engine for a project
  const engine = createDevContextEngine(process.cwd());

  // Initialize the project structure
  console.log("Initializing DevContext...");
  await engine.initialize();

  // Get project metrics
  console.log("\nProject Metrics:");
  const metrics = await engine.getMetrics();
  console.log(`  Active Features: ${metrics.activeFeatures}`);
  console.log(`  Architecture Decisions: ${metrics.architectureDecisions}`);
  console.log(`  Security Rules: ${metrics.securityRules}`);

  // Track a new feature
  console.log("\nTracking authentication feature...");
  await engine.trackFeature("OAuth2 Authentication", "Implement OAuth2 for third-party integrations");

  console.log("\n✓ Example complete\n");
}

/**
 * Example 2: Context Retrieval for AI
 * Shows how to get optimal context for AI assistants
 */
async function example2_contextRetrieval() {
  console.log("=== Example 2: Context Retrieval ===\n");

  const engine = createDevContextEngine(process.cwd());

  // Get context for a specific task
  const aiContext = await engine.getAIContext({
    query: "implement JWT token validation middleware",
    limit: 5,
    includeArchitecture: true,
    includeSecurity: true,
  });

  console.log("Retrieved AI Context:");
  console.log(aiContext.substring(0, 500) + "...\n");

  // Export for specific AI model
  console.log("Exporting for Claude...");
  const exported = await engine.exportContext("claude");
  console.log(`System Prompt: ${exported.systemPrompt.substring(0, 100)}...`);
  console.log(`Architecture: ${exported.architecture.substring(0, 100)}...`);

  console.log("\n✓ Example complete\n");
}

/**
 * Example 3: Security Scanning
 * Shows how to detect and prevent security issues
 */
async function example3_securityScanning() {
  console.log("=== Example 3: Security Scanning ===\n");

  const engine = createDevContextEngine(process.cwd());

  // Scan project for security issues
  const report = await engine.scanSecurity();

  console.log("Security Scan Report:");
  console.log(`  Security Score: ${report.securityScore}%`);
  console.log(`  Exposed Paths: ${report.exposedPaths.length}`);
  console.log(`  Suspicious Patterns: ${report.suspiciousPatterns.length}`);

  // Detect conflicts in proposed code
  const proposedCode = `
    const apiKey = "sk_live_51234567890";
    function authenticate() {
      // ...
    }
  `;

  const conflicts = await engine.detectConflicts(proposedCode);
  console.log("\nConflict Detection:");
  console.log(`  Has Conflicts: ${conflicts.hasConflicts}`);
  console.log(`  Security Issues: ${conflicts.securityIssues.length}`);

  console.log("\n✓ Example complete\n");
}

/**
 * Example 4: Token Analysis & Cost Optimization
 * Shows how to analyze and optimize token usage
 */
async function example4_tokenAnalysis() {
  console.log("=== Example 4: Token Analysis ===\n");

  const engine = createDevContextEngine(process.cwd());

  const prompts = [
    "Implement JWT authentication middleware",
    "Add database migration for user schema",
    "Fix race condition in cache layer",
  ];

  // Analyze token usage across models
  const analysis = engine.analyzeTokenUsage(prompts, "gpt-4");

  console.log("Token Usage Analysis (GPT-4):");
  console.log(`  Total Prompts: ${analysis.totalPrompts}`);
  console.log(`  Total Tokens: ${analysis.totalTokens}`);
  console.log(`  Average per Prompt: ${analysis.avgTokensPerPrompt}`);
  console.log(`  Estimated Cost: $${analysis.costPerPrompt.toFixed(4)} per prompt`);
  console.log(`  Optimization Score: ${analysis.optimizationScore}%`);

  console.log("\n✓ Example complete\n");
}

/**
 * Example 5: Multi-Model AI Adapters
 * Shows how to work with different AI models
 */
async function example5_aiAdapters() {
  console.log("=== Example 5: AI Adapters ===\n");

  import { AIAdapterFactory } from "@devctx/adapters";

  // Create adapters for different providers
  const providers = ["openai", "claude", "gemini", "amazon-q"];

  for (const provider of providers) {
    const adapter = AIAdapterFactory.createAdapter(provider);
    console.log(`\n${provider}:`);
    console.log(`  Model: ${adapter.config.modelName}`);
    console.log(`  Max Context: ${adapter.config.maxContextTokens} tokens`);
    console.log(`  Function Calling: ${adapter.config.supportsFunctionCalling ? "Yes" : "No"}`);
  }

  console.log("\n✓ Example complete\n");
}

/**
 * Example 6: Architecture Validation
 * Shows how to prevent architectural violations
 */
async function example6_architectureValidation() {
  console.log("=== Example 6: Architecture Validation ===\n");

  const engine = createDevContextEngine(process.cwd());

  // Example code that might violate architecture
  const candidateCode = `
    // This code attempts to re-implement a removed feature
    export function legacyAuthSystem() {
      // Old authentication approach we explicitly removed
      return basicAuth();
    }
  `;

  // Detect violations
  const violations = await engine.detectConflicts(candidateCode);

  console.log("Validation Results:");
  console.log(`  Conflicts Detected: ${violations.hasConflicts}`);

  if (violations.architectureViolations.length > 0) {
    console.log("\nArchitectural Violations:");
    violations.architectureViolations.forEach((v) => console.log(`  - ${v}`));
  }

  console.log("\n✓ Example complete\n");
}

/**
 * Example 7: Using Individual Modules
 * Shows how to use modules independently
 */
async function example7_individualModules() {
  console.log("=== Example 7: Individual Modules ===\n");

  // Token Analyzer
  import { TokenAnalyzer } from "@devctx/token-analyzer";

  const tokenAnalyzer = new TokenAnalyzer();
  const estimate = tokenAnalyzer.generateEstimate("Write a function to validate email", "gpt-4");

  console.log("Token Analyzer:");
  console.log(`  Prompt Tokens: ${estimate.promptTokens}`);
  console.log(`  Total Tokens: ${estimate.totalTokens}`);
  console.log(`  Estimated Cost: $${estimate.estimatedCost?.toFixed(6)}`);

  // Security Sanitizer
  import { SecuritySanitizer } from "@devctx/security";

  const sanitizer = new SecuritySanitizer();
  const dirtyScan = sanitizer.scanForSecrets("API_KEY=sk_live_1234567890&password=secret123");

  console.log("\nSecurity Sanitizer:");
  console.log(`  Has Secrets: ${dirtyScan.hasSecrets}`);
  console.log(`  Security Score: ${dirtyScan.score}%`);

  // Code Analyzer
  import { CodeAnalyzer } from "@devctx/parsers";

  const analyzer = new CodeAnalyzer();
  const parsed = analyzer.analyzeFile(
    `
      async function authenticate(user) {
        return await validateToken(user.token);
      }
    `,
    "typescript",
    "auth.ts"
  );

  console.log("\nCode Analyzer:");
  console.log(`  File: ${parsed.path}`);
  console.log(`  Functions Found: ${parsed.functions.length}`);
  console.log(`  Imports: ${parsed.imports.length}`);

  console.log("\n✓ Example complete\n");
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log("🚀 DevContext Engine - Example Suite\n");
  console.log("=====================================\n");

  try {
    // Note: In practice, these would run sequentially
    // Here we're just showing the structure

    console.log("Available Examples:");
    console.log("  1. Basic Usage");
    console.log("  2. Context Retrieval");
    console.log("  3. Security Scanning");
    console.log("  4. Token Analysis");
    console.log("  5. AI Adapters");
    console.log("  6. Architecture Validation");
    console.log("  7. Individual Modules\n");

    console.log("To run examples, execute:");
    console.log("  node examples/basic.js --example 1");
    console.log("  node examples/basic.js --example 2");
    console.log("  etc.\n");
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Export examples for use in docs
export {
  example1_basicUsage,
  example2_contextRetrieval,
  example3_securityScanning,
  example4_tokenAnalysis,
  example5_aiAdapters,
  example6_architectureValidation,
  example7_individualModules,
  runAllExamples,
};

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}
