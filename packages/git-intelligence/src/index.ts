import type { GitChange } from "@devctx/shared";
import { execSync } from "child_process";
import * as path from "path";

/**
 * Git intelligence engine for tracking architecture and feature changes
 */
export class GitIntelligence {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Get recent commits with analysis
   */
  getRecentCommits(count: number = 20): GitChange[] {
    try {
      const command = `git -C "${this.projectRoot}" log --oneline -${count} --pretty=format:"%H|%s|%an|%ad|%b" --date=iso`;
      const output = execSync(command, { encoding: "utf-8" });

      const commits: GitChange[] = [];
      const lines = output.split("\n").filter((line: string) => line.trim());

      for (const line of lines) {
        const parts = line.split("|");
        if (parts.length >= 3) {
          commits.push({
            hash: parts[0],
            message: parts[1],
            author: parts[2],
            date: new Date(parts[3] || Date.now()),
            filesChanged: [],
            architectureImpact: this.analyzeArchitectureImpact(parts[1]),
            featureRelated: this.extractFeatureReferences(parts[1]),
          });
        }
      }

      return commits;
    } catch {
      return [];
    }
  }

  /**
   * Get files changed in a commit
   */
  getFilesInCommit(hash: string): string[] {
    try {
      const command = `git -C "${this.projectRoot}" diff-tree --no-commit-id --name-only -r ${hash}`;
      const output = execSync(command, { encoding: "utf-8" });
      return output.split("\n").filter((f: string) => f.trim());
    } catch {
      return [];
    }
  }

  /**
   * Analyze changes for architectural impact
   */
  analyzeArchitectureImpact(commitMessage: string): string {
    const impacts: string[] = [];

    if (/architecture|refactor|restructure/i.test(commitMessage)) {
      impacts.push("high");
    } else if (/feature|add|implement/i.test(commitMessage)) {
      impacts.push("medium");
    } else if (/fix|bug|patch/i.test(commitMessage)) {
      impacts.push("low");
    }

    if (/security|auth|permission/i.test(commitMessage)) {
      impacts.push("security_related");
    }

    if (/database|schema|migration/i.test(commitMessage)) {
      impacts.push("data_layer");
    }

    if (/api|endpoint|route/i.test(commitMessage)) {
      impacts.push("api_change");
    }

    return impacts.join(", ") || "minimal";
  }

  /**
   * Extract feature references from commit message
   */
  private extractFeatureReferences(message: string): string[] {
    const features: string[] = [];

    // Look for feature references like [FEATURE: auth]
    const featureMatches = message.match(/\[FEATURE:\s*([^\]]+)\]/gi);
    if (featureMatches) {
      for (const match of featureMatches) {
        features.push(match.replace(/\[FEATURE:\s*|\]/gi, "").trim());
      }
    }

    // Look for feature names in message
    const keywords = ["auth", "payment", "notification", "reporting", "dashboard", "admin", "api"];
    for (const keyword of keywords) {
      if (new RegExp(`\\b${keyword}\\b`, "i").test(message)) {
        features.push(keyword);
      }
    }

    return [...new Set(features)];
  }

  /**
   * Track feature evolution
   */
  getFeatureEvolution(featureName: string, commits: GitChange[] = []): FeatureEvolution {
    if (commits.length === 0) {
      commits = this.getRecentCommits(100);
    }

    const relatedCommits = commits.filter((c) => c.featureRelated.includes(featureName));

    return {
      featureName,
      firstIntroduced: relatedCommits.length > 0 ? relatedCommits[relatedCommits.length - 1].date : new Date(),
      lastModified: relatedCommits.length > 0 ? relatedCommits[0].date : new Date(),
      commitCount: relatedCommits.length,
      commits: relatedCommits,
      status: this.determineFeatureStatus(relatedCommits),
    };
  }

  /**
   * Determine feature status from commits
   */
  private determineFeatureStatus(
    commits: GitChange[]
  ): "active" | "deprecated" | "removed" | "experimental" {
    if (commits.length === 0) return "experimental";

    const recentCommit = commits[0];
    if (/deprecat|remov|delete/i.test(recentCommit.message)) {
      return "removed";
    }

    if (/deprecat/i.test(recentCommit.message)) {
      return "deprecated";
    }

    // Check if there have been changes in last month
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (recentCommit.date > oneMonthAgo) {
      return "active";
    }

    return "experimental";
  }

  /**
   * Analyze rollback opportunities
   */
  analyzeRollbackData(commitHash: string): RollbackAnalysis {
    try {
      const command = `git -C "${this.projectRoot}" show --stat ${commitHash}`;
      const output = execSync(command, { encoding: "utf-8" });

      return {
        commitHash,
        isRollbackSafe: !output.includes("merge"),
        affectedFiles: output.split("\n").filter((line: string) => line.includes("|")).length,
        description: "Rollback is feasible if no subsequent commits depend on this",
      };
    } catch {
      return {
        commitHash,
        isRollbackSafe: false,
        affectedFiles: 0,
        description: "Unable to analyze rollback data",
      };
    }
  }

  /**
   * Get architecture decision timeline
   */
  getArchitectureTimeline(): ArchitectureChange[] {
    const commits = this.getRecentCommits(50);
    const changes: ArchitectureChange[] = [];

    for (const commit of commits) {
      if (commit.architectureImpact && commit.architectureImpact !== "minimal") {
        changes.push({
          date: commit.date,
          hash: commit.hash,
          message: commit.message,
          impact: commit.architectureImpact,
          author: commit.author,
        });
      }
    }

    return changes;
  }

  /**
   * Identify removed features from commit history
   */
  identifyRemovedFeatures(): RemovedFeatureAnalysis[] {
    const commits = this.getRecentCommits(100);
    const removed: RemovedFeatureAnalysis[] = [];

    for (const commit of commits) {
      if (/remov|delet|deprecat/i.test(commit.message)) {
        removed.push({
          featureName: this.extractFeatureName(commit.message),
          removedDate: commit.date,
          removalCommit: commit.hash,
          reason: this.extractRemovalReason(commit.message),
          author: commit.author,
        });
      }
    }

    return removed;
  }

  private extractFeatureName(message: string): string {
    // Try to extract feature name from common patterns
    const match = message.match(/(?:removed?|deleted?|deprecate[d]?)\s+(\w+)/i);
    return match ? match[1] : "unknown";
  }

  private extractRemovalReason(message: string): string {
    // Extract reason if provided
    const match = message.match(/(?:because|reason|due to):\s*(.+?)(?:\.|$)/i);
    return match ? match[1].trim() : "No reason specified";
  }

  /**
   * Compare two commits
   */
  compareCommits(commit1: string, commit2: string): CommitComparison {
    try {
      const command = `git -C "${this.projectRoot}" diff --stat ${commit1}..${commit2}`;
      const output = execSync(command, { encoding: "utf-8" });

      const lines = output.split("\n").filter((l: string) => l.trim());

      return {
        commit1,
        commit2,
        filesChanged: lines.length,
        summary: output,
      };
    } catch {
      return {
        commit1,
        commit2,
        filesChanged: 0,
        summary: "Unable to compare commits",
      };
    }
  }
}

export interface FeatureEvolution {
  featureName: string;
  firstIntroduced: Date;
  lastModified: Date;
  commitCount: number;
  commits: GitChange[];
  status: "active" | "deprecated" | "removed" | "experimental";
}

export interface RollbackAnalysis {
  commitHash: string;
  isRollbackSafe: boolean;
  affectedFiles: number;
  description: string;
}

export interface ArchitectureChange {
  date: Date;
  hash: string;
  message: string;
  impact: string;
  author: string;
}

export interface RemovedFeatureAnalysis {
  featureName: string;
  removedDate: Date;
  removalCommit: string;
  reason: string;
  author: string;
}

export interface CommitComparison {
  commit1: string;
  commit2: string;
  filesChanged: number;
  summary: string;
}

export function createGitIntelligence(projectRoot: string): GitIntelligence {
  return new GitIntelligence(projectRoot);
}
