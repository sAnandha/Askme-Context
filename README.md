# DevContext Engine

> Universal AI Persistent Context & Orchestration Engine for Development

## Overview

**DevContext Engine** solves the critical problem of AI coding assistants losing long-term project memory and architectural understanding across sessions, models, and feature evolution.

### The Problem

When using AI coding assistants across multiple sessions, you experience:

- **Context Loss**: Architecture and design decisions are forgotten
- **Hallucinations**: AI generates code that conflicts with established patterns
- **Repeated Explanations**: Spending tokens re-explaining context repeatedly
- **Inconsistency**: Different code style and patterns suggested
- **Security Risks**: Secrets exposed or security rules violated
- **Feature Conflicts**: Removed features re-implemented
- **Token Waste**: Sending redundant context repeatedly

### The Solution

DevContext Engine provides:

✅ **Persistent Engineering Memory** - Store architecture, decisions, security rules  
✅ **Intelligent Context Retrieval** - Get only relevant context for current task  
✅ **Context Compression** - Reduce token usage while preserving meaning  
✅ **Multi-Model Support** - Works with OpenAI, Claude, Gemini, Amazon Q, Ollama  
✅ **Security-First Design** - Automatic secret detection and sanitization  
✅ **Architecture Validation** - Prevent violations and removed feature re-implementation  
✅ **Token Analytics** - Track and optimize AI API costs  
✅ **Git Integration** - Track feature evolution and architectural changes  
✅ **Local-First** - Works offline, data stays on your machine  

## Quick Start

### Installation

```bash
npm install -g devctx-engine
```

Or use it locally:

```bash
npm install --save-dev devctx-engine
npx devctx init
```

### Initialize Your Project

```bash
cd your-project
devctx init
```

This creates a `.devctx/` folder with:

```
.devctx/
├── memory.json              # Project memory (features, decisions, etc)
├── architecture.md          # System architecture overview
├── security.md              # Security constraints and rules
├── coding-standards.md      # Code style and patterns
├── ai-rules.md              # AI-specific development rules
├── dependency-map.json      # Dependency tracking
└── context-config.json      # Configuration
```

### Configure Your Project

1. Edit `.devctx/architecture.md` with your system architecture
2. Add security rules in `.devctx/security.md`
3. Configure AI rules in `.devctx/ai-rules.md`
4. Update `.devctx/context-config.json` with project specifics

### Use with Your AI Assistant

#### Get Context for a Task

```bash
devctx context "implement JWT authentication"
```

Returns only the relevant architecture, security rules, and decisions.

#### Export for AI Model

```bash
devctx export -m claude
```

Generates optimized prompt injection for your AI model.

#### Analyze Token Usage

```bash
devctx tokens -m gpt-4 --cost
```

See estimated costs and optimization opportunities.

## Architecture

### Core Components

```
┌─────────────────────────────────────────────┐
│       DevContext Engine (Core SDK)          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Context  │  │ Security │  │  Token   │ │
│  │ Engine   │  │ Analyzer │  │ Analyzer │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │    AI    │  │   Git    │  │  Code    │ │
│  │ Adapters │  │ Intel    │  │ Parsers  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
└─────────────────────────────────────────────┘
        ↓           ↓           ↓
    ┌────────────────────────────────┐
    │   CLI / VS Code / SDK           │
    └────────────────────────────────┘
```

### Monorepo Structure

```
packages/
├── core/                 # Main SDK
├── cli/                  # Command-line interface
├── context-engine/       # Context retrieval engine
├── security/             # Security & sanitization
├── token-analyzer/       # Token counting & cost analysis
├── adapters/             # AI model adapters
├── git-intelligence/     # Git integration
├── parsers/              # Code analysis
├── embeddings/           # Vector embeddings (future)
├── vscode-extension/     # VS Code extension
└── shared/               # Shared types & utilities
```

## Core Features

### 1. Project Memory Management

Store and manage all project context:

```typescript
{
  "architecture": {
    "overview": "Microservices with API Gateway",
    "layers": [...],
    "services": [...]
  },
  "features": [...],
  "removedFeatures": [...],
  "securityRules": [...],
  "decisions": [...],
  "technicalDebt": [...],
  "futurePlans": [...]
}
```

### 2. Intelligent Context Retrieval

Get only relevant context:

```bash
devctx context "implement authentication"
```

Returns:
- Related architectural decisions
- Relevant security rules
- Authentication features
- Code standards for auth

### 3. Security & Sanitization

Automatic secret detection and redaction:

```typescript
const sanitizer = new SecuritySanitizer();
const result = sanitizer.scanForSecrets(code);

// {
//   hasSecrets: true,
//   exposedPaths: [...],
//   suspiciousPatterns: [...],
//   score: 45
// }
```

Prevents sending secrets to AI models.

### 4. Multi-Model AI Adapters

Support for all major AI providers:

```typescript
import { AIAdapterFactory } from '@devctx/adapters';

// Works with any provider
const adapter = AIAdapterFactory.createAdapter('claude');
const prompt = adapter.injectContext(userQuery, contextInjection);
```

Supports:
- OpenAI (GPT-4, GPT-3.5)
- Claude (Opus, Sonnet, Haiku)
- Google Gemini
- Amazon Q
- Local LLMs (Ollama)

### 5. Token Analytics & Cost Optimization

```bash
devctx tokens -m gpt-4 --cost

# Output:
# Token Analysis (gpt-4)
# 
# Token Usage Summary:
#   • Total Prompts: 3
#   • Total Tokens: 1,245
#   • Avg Tokens/Prompt: 415
#   • Estimated Cost: $0.0375
```

### 6. Git Intelligence

Track architecture and feature evolution:

```bash
# Recent architectural changes
devctx git-timeline

# Feature evolution
devctx git-feature auth

# Identify removed features
devctx git-removed-features
```

### 7. Architecture Validation

Prevent code that violates architecture:

```typescript
const violations = await engine.detectArchitectureViolations(code);

// Detects:
// - Re-implementation of removed features
// - Security rule violations
// - Architecture pattern mismatches
```

## CLI Commands

### Initialization

```bash
devctx init                    # Initialize project
```

### Memory Management

```bash
devctx sync                    # Sync project state
devctx context <query>         # Retrieve context
devctx memory search <term>    # Search memory
devctx track <feature>         # Track new feature
devctx metrics                 # Show project metrics
```

### Analysis & Security

```bash
devctx tokens -m <model>       # Analyze token usage
devctx security-scan           # Scan for security issues
devctx conflicts <code>        # Check code conflicts
```

### AI Integration

```bash
devctx export -m <provider>    # Export for AI model
devctx prompt <task>           # Generate optimized prompt
```

## TypeScript API

### Using the Core SDK

```typescript
import { createDevContextEngine } from '@devctx/core';

// Initialize engine
const engine = createDevContextEngine('/path/to/project');

// Retrieve context for AI
const context = await engine.getAIContext({
  query: 'implement authentication',
  limit: 5,
  includeArchitecture: true,
  includeSecurity: true
});

// Check for violations
const violations = await engine.detectConflicts(proposedCode);

// Get metrics
const metrics = await engine.getMetrics();
```

### Individual Modules

#### Context Engine

```typescript
import { createContextEngine } from '@devctx/context-engine';

const engine = createContextEngine('/project/root');
const contexts = await engine.retrieveContext(request);
const architecture = await engine.getArchitectureContext();
```

#### Token Analyzer

```typescript
import { TokenAnalyzer } from '@devctx/token-analyzer';

const analyzer = new TokenAnalyzer();
const estimate = analyzer.generateEstimate(prompt, 'gpt-4');
const comparisons = analyzer.compareModelCosts(prompt, ['gpt-4', 'claude']);
```

#### Security

```typescript
import { SecuritySanitizer } from '@devctx/security';

const sanitizer = new SecuritySanitizer();
const sanitized = sanitizer.redact(text);
const scan = sanitizer.scanForSecrets(text);
```

#### AI Adapters

```typescript
import { AIAdapterFactory } from '@devctx/adapters';

const adapter = AIAdapterFactory.createAdapter('openai', 'gpt-4');
const optimized = adapter.optimizePrompt(prompt);
const injection = adapter.injectContext(prompt, contextData);
```

## Configuration

### `.devctx/context-config.json`

```json
{
  "ignoredFolders": ["node_modules", "dist", "coverage"],
  "secretPatterns": ["API_KEY", "SECRET", "PASSWORD"],
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

## Use Cases

### 1. Consistent Code Generation

**Before:** AI generates code in different styles across sessions  
**After:** AI respects your coding standards automatically

### 2. Preventing Security Regressions

**Before:** Secrets accidentally leaked in prompts  
**After:** Automatic secret detection and sanitization

### 3. Architecture Compliance

**Before:** AI suggests code that violates your architecture  
**After:** System detects conflicts and suggests alternatives

### 4. Cost Optimization

**Before:** Spending money on redundant context  
**After:** Smart context compression reduces tokens by 30-40%

### 5. Feature Continuity

**Before:** AI re-implements features you deliberately removed  
**After:** System maintains history of removed features

### 6. Knowledge Preservation

**Before:** Switching team members lose architectural knowledge  
**After:** All decisions and patterns documented and retrievable

## Enterprise Features

### Future Additions

- **Team Shared Memory** - Share architectural knowledge across team
- **AI Governance** - Organization-wide AI usage policies
- **Architecture Compliance** - Enforce org-wide patterns
- **Audit Trails** - Track all AI-assisted changes
- **Custom Embeddings** - Use your own vector DB
- **Cloud Sync** - Optional cloud backup of memory
- **Policy Enforcement** - Automated compliance checking

## Performance

- **Initialization:** < 2 seconds
- **Context Retrieval:** < 100ms (with caching)
- **Token Analysis:** < 50ms
- **Security Scan:** < 500ms
- **Memory Size:** < 10MB for typical projects

## Privacy & Security

✅ **Local-First** - Data stays on your machine  
✅ **No Cloud Required** - Works completely offline  
✅ **Zero Telemetry** - No tracking or analytics  
✅ **Secret-Safe** - Automatic secret redaction  
✅ **Encryption Ready** - Optional AES-256 encryption  

## Contributing

Contributions welcome! See CONTRIBUTING.md

## License

MIT License - See LICENSE file

## Roadmap

- [ ] Vector embeddings with semantic search
- [ ] VS Code Extension with inline context hints
- [ ] Web dashboard for memory management
- [ ] Team collaboration features
- [ ] GitHub integration (PR analysis)
- [ ] IDE plugins (JetBrains, Vim)
- [ ] Langchain integration
- [ ] OpenAI function calling support

## Support

- 📧 Email: support@devctx.dev
- 🐛 Issues: https://github.com/devctx-engine/issues
- 💬 Discussions: https://github.com/devctx-engine/discussions

---

**Built with ❤️ to preserve AI development memory**
#   A s k m e - C o n t e x t  
 