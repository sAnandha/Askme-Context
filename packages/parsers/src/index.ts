/**
 * Code parsers and analyzers for multiple languages
 */

export interface ParsedFile {
  path: string;
  language: string;
  classes: ParsedClass[];
  functions: ParsedFunction[];
  imports: string[];
  exports: string[];
  comments: string[];
}

export interface ParsedClass {
  name: string;
  methods: ParsedFunction[];
  fields: ParsedField[];
  extends?: string;
  implements?: string[];
  visibility: "public" | "private" | "protected";
}

export interface ParsedFunction {
  name: string;
  parameters: ParsedParameter[];
  returnType?: string;
  visibility: "public" | "private" | "protected";
  isAsync: boolean;
  calls: string[];
}

export interface ParsedParameter {
  name: string;
  type?: string;
  optional?: boolean;
}

export interface ParsedField {
  name: string;
  type?: string;
  visibility: "public" | "private" | "protected";
}

/**
 * Language-agnostic code analyzer
 */
export class CodeAnalyzer {
  /**
   * Analyze source code file
   */
  analyzeFile(content: string, language: string, filePath: string): ParsedFile {
    switch (language.toLowerCase()) {
      case "javascript":
      case "typescript":
        return this.analyzeTypeScript(content, filePath);
      case "python":
        return this.analyzePython(content, filePath);
      case "java":
        return this.analyzeJava(content, filePath);
      case "go":
        return this.analyzeGo(content, filePath);
      default:
        return this.analyzeGeneric(content, filePath);
    }
  }

  private analyzeTypeScript(content: string, filePath: string): ParsedFile {
    const file: ParsedFile = {
      path: filePath,
      language: "typescript",
      classes: [],
      functions: [],
      imports: [],
      exports: [],
      comments: [],
    };

    // Extract imports
    const importMatches = content.match(/import\s+.*?from\s+['"][^'"]+['"]/g) || [];
    file.imports = importMatches;

    // Extract exports
    const exportMatches = content.match(/export\s+(default\s+)?(class|function|const)\s+\w+/g) || [];
    file.exports = exportMatches;

    // Extract class definitions
    const classMatches = content.match(/class\s+(\w+)[\s{]/g) || [];
    for (const match of classMatches) {
      const className = match.match(/class\s+(\w+)/)?.[1];
      if (className) {
        file.classes.push({
          name: className,
          methods: [],
          fields: [],
          visibility: "public",
        });
      }
    }

    // Extract function definitions
    const funcMatches = content.match(/(?:async\s+)?function\s+(\w+)\s*\(/g) || [];
    for (const match of funcMatches) {
      const funcName = match.match(/function\s+(\w+)/)?.[1];
      if (funcName) {
        file.functions.push({
          name: funcName,
          parameters: [],
          visibility: "public",
          isAsync: match.includes("async"),
          calls: [],
        });
      }
    }

    // Extract comments
    const commentMatches = content.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) || [];
    file.comments = commentMatches;

    return file;
  }

  private analyzePython(content: string, filePath: string): ParsedFile {
    const file: ParsedFile = {
      path: filePath,
      language: "python",
      classes: [],
      functions: [],
      imports: [],
      exports: [],
      comments: [],
    };

    // Extract imports
    const importMatches = content.match(/(?:from|import)\s+[\w.]+/g) || [];
    file.imports = importMatches;

    // Extract classes
    const classMatches = content.match(/class\s+(\w+)[\s(:]/g) || [];
    for (const match of classMatches) {
      const className = match.match(/class\s+(\w+)/)?.[1];
      if (className) {
        file.classes.push({
          name: className,
          methods: [],
          fields: [],
          visibility: "public",
        });
      }
    }

    // Extract functions
    const funcMatches = content.match(/def\s+(\w+)\s*\(/g) || [];
    for (const match of funcMatches) {
      const funcName = match.match(/def\s+(\w+)/)?.[1];
      if (funcName) {
        file.functions.push({
          name: funcName,
          parameters: [],
          visibility: "public",
          isAsync: false,
          calls: [],
        });
      }
    }

    // Extract comments
    const commentMatches = content.match(/#.*/g) || [];
    file.comments = commentMatches;

    return file;
  }

  private analyzeJava(content: string, filePath: string): ParsedFile {
    const file: ParsedFile = {
      path: filePath,
      language: "java",
      classes: [],
      functions: [],
      imports: [],
      exports: [],
      comments: [],
    };

    // Extract imports
    const importMatches = content.match(/import\s+[\w.]+;/g) || [];
    file.imports = importMatches;

    // Extract classes
    const classMatches = content.match(/(?:public\s+)?class\s+(\w+)/g) || [];
    for (const match of classMatches) {
      const className = match.match(/class\s+(\w+)/)?.[1];
      if (className) {
        file.classes.push({
          name: className,
          methods: [],
          fields: [],
          visibility: "public",
        });
      }
    }

    // Extract methods
    const methodMatches = content.match(/(?:public|private|protected)\s+(?:static\s+)?\w+\s+(\w+)\s*\(/g) || [];
    for (const match of methodMatches) {
      const methodName = match.match(/\s+(\w+)\s*\(/)?.[1];
      if (methodName) {
        file.functions.push({
          name: methodName,
          parameters: [],
          visibility: "public",
          isAsync: false,
          calls: [],
        });
      }
    }

    // Extract comments
    const commentMatches = content.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) || [];
    file.comments = commentMatches;

    return file;
  }

  private analyzeGo(content: string, filePath: string): ParsedFile {
    const file: ParsedFile = {
      path: filePath,
      language: "go",
      classes: [],
      functions: [],
      imports: [],
      exports: [],
      comments: [],
    };

    // Extract imports
    const importMatches = content.match(/import\s*\([\s\S]*?\)/g) || [];
    file.imports = importMatches;

    // Extract functions
    const funcMatches = content.match(/func\s+(?:\(\w+\s+\*?\w+\)\s+)?(\w+)\s*\(/g) || [];
    for (const match of funcMatches) {
      const funcName = match.match(/func\s+(?:\(\w+\s+\*?\w+\)\s+)?(\w+)/)?.[1];
      if (funcName) {
        file.functions.push({
          name: funcName,
          parameters: [],
          visibility: funcName[0] === funcName[0].toUpperCase() ? "public" : "private",
          isAsync: false,
          calls: [],
        });
      }
    }

    // Extract comments
    const commentMatches = content.match(/\/\/.*/g) || [];
    file.comments = commentMatches;

    return file;
  }

  private analyzeGeneric(content: string, filePath: string): ParsedFile {
    return {
      path: filePath,
      language: "unknown",
      classes: [],
      functions: [],
      imports: [],
      exports: [],
      comments: [],
    };
  }

  /**
   * Detect API contracts from code
   */
  detectAPIContracts(content: string, language: string): APIContractDetection[] {
    const contracts: APIContractDetection[] = [];

    if (language === "typescript" || language === "javascript") {
      // Detect REST endpoints
      const routePatterns = [
        /(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/g,
        /@(?:GetMapping|PostMapping|PutMapping|DeleteMapping)\s*\(\s*['"]?([^'"\s)]+)/g,
      ];

      for (const pattern of routePatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const method = match[1].toUpperCase();
          const path = match[2];
          contracts.push({
            type: "rest_endpoint",
            method,
            path,
            location: content.substring(0, match.index).split("\n").length,
          });
        }
      }
    }

    return contracts;
  }
}

export interface APIContractDetection {
  type: "rest_endpoint" | "graphql" | "grpc" | "websocket";
  method?: string;
  path?: string;
  location: number;
}

export function createCodeAnalyzer(): CodeAnalyzer {
  return new CodeAnalyzer();
}
