import type { SecurityScanResult } from "@devctx/shared";

/**
 * Security sanitization and secret scanning module
 */
export class SecuritySanitizer {
  // Common secret patterns
  private readonly secretPatterns = [
    /api[_-]?key/gi,
    /secret[_-]?key/gi,
    /password/gi,
    /auth[_-]?token/gi,
    /bearer\s+[a-z0-9\-._~+\/]+=*/gi,
    /aws[_-]?secret/gi,
    /private[_-]?key/gi,
    /app[_-]?secret/gi,
    /access[_-]?token/gi,
    /refresh[_-]?token/gi,
    /jwt/gi,
    /oauth/gi,
    /credentials/gi,
    /\\b[a-z0-9]{40}\\b/gi, // AWS secret keys
    /-----BEGIN[A-Z\\s]+PRIVATE KEY-----/g, // Private keys
    /sk_[a-z0-9]{24,}/gi, // Stripe keys
    /pk_[a-z0-9]{24,}/gi, // Stripe publishable keys
  ];

  private readonly entropyThreshold = 4.0;
  private readonly customPatterns: RegExp[] = [];

  constructor(customPatterns?: RegExp[]) {
    if (customPatterns) {
      this.customPatterns = customPatterns;
    }
  }

  /**
   * Scan text for secrets and sensitive data
   */
  scanForSecrets(text: string): SecurityScanResult {
    const allPatterns = [...this.secretPatterns, ...this.customPatterns];
    const foundSecrets: string[] = [];
    const exposedPaths: string[] = [];
    const suspiciousPatterns: string[] = [];

    // Scan for patterns
    for (const pattern of allPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        foundSecrets.push(...matches);
      }
    }

    // Scan for file paths that might contain sensitive info
    const pathPattern = /(?:\.\/|\/)[a-z0-9\/.\\-_]*(?:key|secret|credential|config)[a-z0-9\/.\\-_]*/gi;
    const pathMatches = text.match(pathPattern);
    if (pathMatches) {
      exposedPaths.push(...pathMatches);
    }

    // Entropy-based detection for high-entropy strings
    const words = text.split(/\s+/);
    for (const word of words) {
      if (word.length > 20 && this.calculateEntropy(word) > this.entropyThreshold) {
        suspiciousPatterns.push(word);
      }
    }

    const hasSecrets = foundSecrets.length > 0;
    const score = Math.max(0, 100 - (foundSecrets.length * 10 + exposedPaths.length * 5 + suspiciousPatterns.length * 2));

    return {
      hasSecrets,
      exposedPaths,
      suspiciousPatterns,
      recommendations: this.generateRecommendations(hasSecrets, exposedPaths, suspiciousPatterns),
      score,
    };
  }

  /**
   * Redact sensitive information from text
   */
  redact(text: string, placeholder = "[REDACTED]"): string {
    let redacted = text;
    const allPatterns = [...this.secretPatterns, ...this.customPatterns];

    for (const pattern of allPatterns) {
      redacted = redacted.replace(pattern, placeholder);
    }

    return redacted;
  }

  /**
   * Extract and mask credentials while preserving structure
   */
  maskSensitiveData(text: string): string {
    return text
      .replace(/([a-z0-9]{20,})/gi, (match) => {
        if (this.calculateEntropy(match) > this.entropyThreshold) {
          return match.substring(0, 4) + "*".repeat(match.length - 8) + match.substring(match.length - 4);
        }
        return match;
      })
      .replace(/"([a-z_]+)"\s*:\s*"([^"]+)"/gi, (match, key, value) => {
        if (/secret|password|token|key|credential/i.test(key)) {
          return `"${key}": "[REDACTED]"`;
        }
        return match;
      });
  }

  /**
   * Validate if data is safe to send to AI
   */
  isSafeForAI(text: string): boolean {
    const scanResult = this.scanForSecrets(text);
    return scanResult.score > 80;
  }

  /**
   * Calculate entropy of a string
   */
  private calculateEntropy(str: string): number {
    const len = str.length;
    const frequencies: Record<string, number> = {};

    for (const char of str) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }

    let entropy = 0;
    for (const freq of Object.values(frequencies)) {
      const p = freq / len;
      entropy -= p * Math.log2(p);
    }

    return entropy;
  }

  private generateRecommendations(hasSecrets: boolean, exposedPaths: string[], suspiciousPatterns: string[]): string[] {
    const recommendations: string[] = [];

    if (hasSecrets) {
      recommendations.push("Secrets detected. Use environment variables or secure vaults instead.");
      recommendations.push("Rotate all exposed credentials immediately.");
    }

    if (exposedPaths.length > 0) {
      recommendations.push("Sensitive file paths detected. Consider using .devctxignore.");
    }

    if (suspiciousPatterns.length > 0) {
      recommendations.push("High-entropy strings detected. Verify these are not secrets.");
    }

    if (recommendations.length === 0) {
      recommendations.push("✓ No security issues detected");
    }

    return recommendations;
  }
}

/**
 * Advanced secret detector with entropy and machine learning
 */
export class AdvancedSecretDetector {
  private readonly sanitizer: SecuritySanitizer;

  constructor(customPatterns?: RegExp[]) {
    this.sanitizer = new SecuritySanitizer(customPatterns);
  }

  /**
   * Detect secrets using multiple techniques
   */
  detectSecrets(content: string): {
    secrets: SecretMatch[];
    riskLevel: "low" | "medium" | "high" | "critical";
    details: string[];
  } {
    const secrets: SecretMatch[] = [];
    const details: string[] = [];

    // Pattern-based detection
    const patternResults = this.sanitizer.scanForSecrets(content);
    if (patternResults.hasSecrets) {
      for (const secret of patternResults.exposedPaths) {
        secrets.push({
          type: "file_path",
          value: secret,
          confidence: 0.9,
          line: this.findLine(content, secret),
        });
      }
    }

    // Environment variable detection
    const envPattern = /(?:^|\n)\s*(?:export\s+)?([A-Z_][A-Z0-9_]*)=([^\n]*)/gm;
    let match;
    while ((match = envPattern.exec(content)) !== null) {
      if (/secret|password|key|token/i.test(match[1])) {
        secrets.push({
          type: "env_var",
          value: match[1],
          confidence: 0.85,
          line: this.findLine(content, match[0]),
        });
      }
    }

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    if (secrets.length > 5) {
      riskLevel = "critical";
    } else if (secrets.length > 3) {
      riskLevel = "high";
    } else if (secrets.length > 1) {
      riskLevel = "medium";
    } else if (secrets.length === 1) {
      riskLevel = "low";
    }

    details.push(`Found ${secrets.length} potential secrets`);
    details.push(`Risk level: ${riskLevel}`);

    return { secrets, riskLevel, details };
  }

  private findLine(content: string, value: string): number {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(value)) {
        return i + 1;
      }
    }
    return -1;
  }
}

export interface SecretMatch {
  type: string;
  value: string;
  confidence: number;
  line: number;
}

export function createSecuritySanitizer(customPatterns?: RegExp[]): SecuritySanitizer {
  return new SecuritySanitizer(customPatterns);
}

export function createAdvancedSecretDetector(customPatterns?: RegExp[]): AdvancedSecretDetector {
  return new AdvancedSecretDetector(customPatterns);
}
