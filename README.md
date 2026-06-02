# DevContext Engine

> Universal AI Persistent Context & Orchestration Engine for Development

## Source

- GitHub: https://github.com/sAnandha/Askme-Context
- npm: https://www.npmjs.com/package/devctx-engine

---

## Overview

**DevContext Engine** solves the critical problem of AI coding assistants losing long-term project memory and architectural understanding across sessions, models, and feature evolution.

---

# The Problem

When using AI coding assistants across multiple sessions, developers experience:

- Context loss
- AI hallucinations
- Repeated explanations
- Architecture inconsistency
- Security risks
- Feature conflicts
- Token waste
- Broken engineering continuity

### Common Issues

- AI forgets architecture decisions
- Removed features get reimplemented
- Different coding patterns appear across sessions
- Security rules are ignored
- Large repositories become difficult for AI to understand
- Switching AI models loses project memory
- Token usage increases due to repeated context injection

---

# The Solution

DevContext Engine provides a persistent engineering memory layer for AI-assisted development.

## Key Features

- Persistent Engineering Memory
- Intelligent Context Retrieval
- Context Compression
- Multi-Model AI Support
- Security & Guardrails
- Architecture Validation
- Token Analytics
- Git Intelligence
- Local-First Storage

---

# Features

## Persistent Engineering Memory

Store:

- Architecture decisions
- Security rules
- Feature history
- Removed features
- Technical debt
- API contracts
- Coding standards
- AI prompts & outputs
- Dependency relationships
- Developer notes

---

## Intelligent Context Retrieval

Retrieve only relevant project context for the current task.

```bash
devctx context "implement JWT authentication"
```

The engine automatically returns:

- Related architecture decisions
- Relevant security constraints
- Existing authentication flows
- Coding standards
- Dependency relationships

---

## Context Compression

Reduce token usage while preserving architectural meaning.

Instead of sending:
- Entire repositories
- Large prompt histories

DevContext generates:
- Optimized architecture summaries
- Relevant dependency context
- Focused feature memory
- Security constraints

---

## Multi-Model AI Support

Works with:

- OpenAI
- Claude
- Gemini
- Amazon Q
- Ollama
- Local LLMs

---

## Security & Guardrails

Built-in protection against:

- API key exposure
- Credential leakage
- Secret injection
- Unsafe prompts
- PII exposure

### Security Features

- Secret scanning
- Entropy detection
- Prompt sanitization
- Automatic redaction
- Local encrypted storage

---

## Architecture Validation

Prevent AI-generated code from violating existing architecture.

Detects:

- Reimplementation of removed features
- Architecture conflicts
- Security violations
- Inconsistent coding patterns
- Dependency misuse

---

## Token Analytics

Analyze token usage and optimize AI cost.

```bash
devctx tokens -m gpt-4 --cost
```

Example output:

```txt
Token Analysis (gpt-4)

Total Prompts: 3
Total Tokens: 1,245
Average Tokens: 415
Estimated Cost: $0.0375
```

---

## Git Intelligence

Track:

- Feature evolution
- Architecture changes
- Removed features
- Commit reasoning
- Historical decisions

Commands:

```bash
devctx git-timeline
devctx git-feature auth
devctx git-removed-features
```

---

# Quick Start

## Installation

### From npm

```bash
npm install -g devctx-engine
```

### From GitHub

```bash
git clone https://github.com/devctx/devctx-engine.git
cd devctx-engine
pnpm install
pnpm build
```

### Global Installation

```bash
npm install -g devctx-engine
```

### Local Installation

```bash
npm install --save-dev devctx-engine
npx devctx init
```

### Publish Process

To publish updates to npm after pushing to GitHub:

```bash
npm login
npm publish --access public
```

If you publish a specific workspace package instead of the root package, use:

```bash
npm publish --workspace @devctx/core --access public
```

---

# Initialize Project

```bash
cd your-project
devctx init
```

This creates:

```txt
.devctx/
├── memory.json
├── architecture.md
├── security.md
├── coding-standards.md
├── ai-rules.md
├── dependency-map.json
└── context-config.json
```

---

# Configuration

## Setup Steps

1. Configure architecture in `.devctx/architecture.md`
2. Add security rules in `.devctx/security.md`
3. Define AI rules in `.devctx/ai-rules.md`
4. Customize `.devctx/context-config.json`

---

# Architecture

## Core System Architecture

```txt
┌─────────────────────────────────────────────┐
│       DevContext Engine (Core SDK)         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Context  │  │ Security │  │  Token   │  │
│  │ Engine   │  │ Analyzer │  │ Analyzer │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │    AI    │  │   Git    │  │  Code    │  │
│  │ Adapters │  │ Intel    │  │ Parsers  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

# Monorepo Structure

```txt
packages/
├── core/
├── cli/
├── context-engine/
├── security/
├── token-analyzer/
├── adapters/
├── git-intelligence/
├── parsers/
├── embeddings/
├── vscode-extension/
└── shared/
```

---

# CLI Commands

## Initialization

```bash
devctx init
```

---

## Memory Management

```bash
devctx sync
devctx context <query>
devctx memory search <term>
devctx track <feature>
devctx metrics
```

---

## Security & Analysis

```bash
devctx tokens -m <model>
devctx security-scan
devctx conflicts <code>
```

---

## AI Integration

```bash
devctx export -m <provider>
devctx prompt <task>
```

---

# TypeScript SDK Usage

## Core SDK

```ts
import { createDevContextEngine } from '@devctx/core';

const engine = createDevContextEngine('/project/root');

const context = await engine.getAIContext({
  query: 'implement authentication',
  limit: 5,
  includeArchitecture: true,
  includeSecurity: true
});
```

---

# Context Engine Example

```ts
import { createContextEngine } from '@devctx/context-engine';

const engine = createContextEngine('/project/root');

const contexts = await engine.retrieveContext(request);
```

---

# Token Analyzer Example

```ts
import { TokenAnalyzer } from '@devctx/token-analyzer';

const analyzer = new TokenAnalyzer();

const estimate = analyzer.generateEstimate(prompt, 'gpt-4');
```

---

# Security Example

```ts
import { SecuritySanitizer } from '@devctx/security';

const sanitizer = new SecuritySanitizer();

const result = sanitizer.scanForSecrets(code);
```

---

# AI Adapter Example

```ts
import { AIAdapterFactory } from '@devctx/adapters';

const adapter = AIAdapterFactory.createAdapter('claude');

const optimized = adapter.optimizePrompt(prompt);
```

---

# Example Configuration

## `.devctx/context-config.json`

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

---

# Use Cases

## Consistent Code Generation

Before:
- AI generates inconsistent patterns

After:
- AI follows project standards automatically

---

## Security Protection

Before:
- Secrets accidentally leaked into prompts

After:
- Automatic detection and sanitization

---

## Architecture Compliance

Before:
- AI violates project architecture

After:
- Real-time conflict detection

---

## Cost Optimization

Before:
- High token usage

After:
- Smart context compression reduces token cost

---

## Feature Continuity

Before:
- AI reimplements removed features

After:
- Historical project memory preserved

---

# Enterprise Features

## Future Roadmap

- Team Shared Memory
- AI Governance
- Architecture Compliance Policies
- Audit Trails
- Cloud Sync
- Semantic Vector Search
- GitHub Integration
- IDE Plugins
- LangChain Integration

---

# Performance

| Operation | Performance |
|---|---|
| Initialization | < 2s |
| Context Retrieval | < 100ms |
| Token Analysis | < 50ms |
| Security Scan | < 500ms |

---

# Privacy & Security

- Local-First Architecture
- Offline Support
- No Telemetry
- Secret Redaction
- Encryption Ready
- Enterprise-Safe Design

---

# Contributing

Contributions are welcome.

See:

```txt
CONTRIBUTING.md
```

---

# License

MIT License

---

# Support

- Issues
- Discussions
- Community Support

---

# Vision

DevContext Engine aims to become:

> Persistent Engineering Memory for AI Development

A universal context orchestration layer that allows developers to switch AI models without losing project intelligence.

---

## Built for the Future of AI-Assisted Development

Preserve architecture.  
Reduce hallucinations.  
Protect engineering knowledge.
