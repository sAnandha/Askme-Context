#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from "fs/promises";
import * as path from "path";
import { createDevContextEngine, TokenAnalyzer, AIAdapterFactory } from "@devctx/core";

const program = new Command();

program
  .name("devctx")
  .description("DevContext Engine - AI Persistent Development Memory")
  .version("0.1.0");

// Utility functions
async function findProjectRoot(): Promise<string> {
  let current = process.cwd();
  while (current !== path.dirname(current)) {
    if (await fileExists(path.join(current, ".devctx"))) {
      return current;
    }
    current = path.dirname(current);
  }
  return process.cwd();
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Initialize command
program
  .command("init")
  .description("Initialize DevContext in current project")
  .action(async () => {
    try {
      const projectRoot = process.cwd();
      const engine = createDevContextEngine(projectRoot);

      console.log(chalk.blue("\n🚀 Initializing DevContext Engine...\n"));

      await engine.initialize();

      console.log(chalk.green("✓ DevContext initialized successfully!\n"));
      console.log(chalk.gray("Created:"));
      console.log(chalk.gray("  .devctx/"));
      console.log(chalk.gray("    ├── memory.json"));
      console.log(chalk.gray("    ├── architecture.md"));
      console.log(chalk.gray("    ├── security.md"));
      console.log(chalk.gray("    ├── coding-standards.md"));
      console.log(chalk.gray("    ├── ai-rules.md"));
      console.log(chalk.gray("    ├── dependency-map.json"));
      console.log(chalk.gray("    └── context-config.json\n"));

      console.log(chalk.yellow("Next steps:"));
      console.log(chalk.gray("  1. Edit .devctx/architecture.md with your architecture"));
      console.log(chalk.gray("  2. Update .devctx/security.md with security constraints"));
      console.log(chalk.gray("  3. Configure .devctx/context-config.json"));
      console.log(chalk.gray("  4. Run 'devctx sync' to start tracking\n"));
    } catch (error) {
      console.error(chalk.red(`✗ Initialization failed: ${error}`));
      process.exit(1);
    }
  });

// Sync command
program
  .command("sync")
  .description("Sync current state and update memory")
  .action(async () => {
    try {
      const projectRoot = await findProjectRoot();
      const engine = createDevContextEngine(projectRoot);

      console.log(chalk.blue("\n📦 Syncing project context...\n"));

      const metrics = await engine.getMetrics();

      console.log(chalk.green("✓ Sync completed\n"));
      console.log(chalk.gray("Current State:"));
      console.log(chalk.gray(`  • Active Features: ${metrics.activeFeatures}`));
      console.log(chalk.gray(`  • Removed Features: ${metrics.removedFeatures}`));
      console.log(chalk.gray(`  • Architecture Decisions: ${metrics.architectureDecisions}`));
      console.log(chalk.gray(`  • Security Rules: ${metrics.securityRules}`));
      console.log(chalk.gray(`  • Technical Debt Items: ${metrics.technicalDebt}`));
      console.log(chalk.gray(`  • Recent Commits: ${metrics.recentCommits}\n`));
    } catch (error) {
      console.error(chalk.red(`✗ Sync failed: ${error}`));
      process.exit(1);
    }
  });

// Context command
program
  .command("context <query>")
  .description("Retrieve relevant context for a query")
  .action(async (query) => {
    try {
      const projectRoot = await findProjectRoot();
      const engine = createDevContextEngine(projectRoot);

      console.log(chalk.blue(`\n🔍 Retrieving context for: "${query}"\n`));

      const context = await engine.getAIContext({
        query,
        limit: 5,
        includeArchitecture: true,
        includeSecurity: true,
      });

      if (context) {
        console.log(chalk.gray(context));
      } else {
        console.log(chalk.yellow("No relevant context found"));
      }
      console.log();
    } catch (error) {
      console.error(chalk.red(`✗ Context retrieval failed: ${error}`));
      process.exit(1);
    }
  });

// Tokens command
program
  .command("tokens")
  .description("Analyze token usage")
  .option("-m, --model <model>", "AI model (default: gpt-4)", "gpt-4")
  .option("-c, --cost", "Show cost breakdown")
  .action(async (options) => {
    try {
      console.log(chalk.blue(`\n💰 Token Analysis (${options.model})\n`));

      const analyzer = new TokenAnalyzer();

      // Example prompts for demonstration
      const samplePrompts = [
        "Implement JWT authentication for the API",
        "Add database migration for user schema",
        "Fix memory leak in event listeners",
      ];

      const report = {
        totalPrompts: samplePrompts.length,
        totalTokens: 0,
        totalCost: 0,
        avgTokensPerPrompt: 0,
      };

      for (const prompt of samplePrompts) {
        const estimate = analyzer.generateEstimate(prompt, options.model);
        report.totalTokens += estimate.totalTokens;
        report.totalCost += estimate.estimatedCost || 0;
      }

      report.avgTokensPerPrompt = Math.round(report.totalTokens / report.totalPrompts);

      console.log(chalk.gray("Token Usage Summary:"));
      console.log(chalk.gray(`  • Total Prompts: ${report.totalPrompts}`));
      console.log(chalk.gray(`  • Total Tokens: ${report.totalTokens}`));
      console.log(chalk.gray(`  • Avg Tokens/Prompt: ${report.avgTokensPerPrompt}`));

      if (options.cost) {
        console.log(chalk.gray(`  • Estimated Cost: ${analyzer.formatCost(report.totalCost)}`));
      }

      console.log();
    } catch (error) {
      console.error(chalk.red(`✗ Token analysis failed: ${error}`));
      process.exit(1);
    }
  });

// Security scan command
program
  .command("security-scan")
  .description("Scan for security issues and secrets")
  .action(async () => {
    try {
      const projectRoot = await findProjectRoot();
      const engine = createDevContextEngine(projectRoot);

      console.log(chalk.blue("\n🔒 Running Security Scan...\n"));

      const report = await engine.scanSecurity();

      console.log(chalk.gray("Security Report:"));
      console.log(chalk.gray(`  • Scan Time: ${report.timestamp.toLocaleString()}`));
      console.log(chalk.gray(`  • Security Score: ${report.securityScore}%`));

      if (report.exposedPaths.length > 0) {
        console.log(chalk.yellow(`  • Exposed Paths: ${report.exposedPaths.length}`));
        for (const path of report.exposedPaths.slice(0, 3)) {
          console.log(chalk.yellow(`    - ${path}`));
        }
      }

      if (report.suspiciousPatterns.length > 0) {
        console.log(chalk.yellow(`  • Suspicious Patterns: ${report.suspiciousPatterns.length}`));
      }

      console.log(chalk.gray("\nRecommendations:"));
      for (const rec of report.recommendations) {
        console.log(chalk.gray(`  • ${rec}`));
      }
      console.log();
    } catch (error) {
      console.error(chalk.red(`✗ Security scan failed: ${error}`));
      process.exit(1);
    }
  });

// Memory search command
program
  .command("memory search <term>")
  .description("Search project memory")
  .action(async (term) => {
    try {
      const projectRoot = await findProjectRoot();
      const engine = createDevContextEngine(projectRoot);

      console.log(chalk.blue(`\n🔎 Searching memory for: "${term}"\n`));

      const context = await engine.getAIContext({
        query: term,
        limit: 10,
      });

      if (context) {
        console.log(chalk.gray(context));
      } else {
        console.log(chalk.yellow("No matching memories found"));
      }
      console.log();
    } catch (error) {
      console.error(chalk.red(`✗ Memory search failed: ${error}`));
      process.exit(1);
    }
  });

// Export command
program
  .command("export")
  .description("Export context for AI model")
  .option("-m, --model <provider>", "AI model provider (openai, claude, gemini, amazon-q)", "openai")
  .action(async (options) => {
    try {
      const projectRoot = await findProjectRoot();
      const engine = createDevContextEngine(projectRoot);

      console.log(chalk.blue(`\n📤 Exporting context for: ${options.model}\n`));

      const exported = await engine.exportContext(options.model);

      console.log(chalk.gray("System Prompt:"));
      console.log(chalk.gray(exported.systemPrompt.substring(0, 200) + "...\n"));

      console.log(chalk.gray("Architecture Overview:"));
      console.log(chalk.gray(exported.architecture.substring(0, 150) + "...\n"));

      console.log(chalk.gray("Features:"));
      console.log(chalk.gray(exported.features.substring(0, 200) + "...\n"));

      console.log(chalk.green("✓ Context exported successfully"));
      console.log();
    } catch (error) {
      console.error(chalk.red(`✗ Export failed: ${error}`));
      process.exit(1);
    }
  });

// Track command
program
  .command("track <feature> [description]")
  .description("Track a new feature")
  .action(async (feature, description) => {
    try {
      const projectRoot = await findProjectRoot();
      const engine = createDevContextEngine(projectRoot);

      console.log(chalk.blue(`\n✨ Tracking feature: ${feature}\n`));

      await engine.trackFeature(feature, description || "");

      console.log(chalk.green("✓ Feature tracked successfully\n"));
    } catch (error) {
      console.error(chalk.red(`✗ Tracking failed: ${error}`));
      process.exit(1);
    }
  });

// Metrics command
program
  .command("metrics")
  .description("Show project metrics")
  .action(async () => {
    try {
      const projectRoot = await findProjectRoot();
      const engine = createDevContextEngine(projectRoot);

      console.log(chalk.blue("\n📊 Project Metrics\n"));

      const metrics = await engine.getMetrics();

      console.log(chalk.gray("Summary:"));
      console.log(chalk.gray(`  • Active Features: ${chalk.cyan(metrics.activeFeatures)}`));
      console.log(chalk.gray(`  • Architecture Decisions: ${chalk.cyan(metrics.architectureDecisions)}`));
      console.log(chalk.gray(`  • Security Rules: ${chalk.cyan(metrics.securityRules)}`));
      console.log(chalk.gray(`  • Technical Debt: ${chalk.cyan(metrics.technicalDebt)} items`));
      console.log(chalk.gray(`  • Recent Commits: ${chalk.cyan(metrics.recentCommits)}`));
      console.log(chalk.gray(`  • Last Updated: ${chalk.cyan(metrics.lastUpdated.toLocaleDateString())}\n`));
    } catch (error) {
      console.error(chalk.red(`✗ Metrics failed: ${error}`));
      process.exit(1);
    }
  });

// Help command
program.command("help").description("Show help information").action(() => {
  console.log(chalk.blue("\n📚 DevContext Engine - Commands\n"));
  console.log(chalk.cyan("initialization:"));
  console.log(chalk.gray("  devctx init              Initialize DevContext in project\n"));

  console.log(chalk.cyan("Memory & Context:"));
  console.log(chalk.gray("  devctx sync              Sync project state"));
  console.log(chalk.gray("  devctx context <query>   Retrieve context"));
  console.log(chalk.gray("  devctx memory search     Search project memory\n"));

  console.log(chalk.cyan("Analysis & Security:"));
  console.log(chalk.gray("  devctx tokens            Analyze token usage"));
  console.log(chalk.gray("  devctx security-scan     Scan for security issues"));
  console.log(chalk.gray("  devctx metrics           Show project metrics\n"));

  console.log(chalk.cyan("AI Integration:"));
  console.log(chalk.gray("  devctx export -m <model> Export context for AI\n"));

  console.log(chalk.cyan("Tracking:"));
  console.log(chalk.gray("  devctx track <feature>   Track a new feature\n"));
});

program.parse();
