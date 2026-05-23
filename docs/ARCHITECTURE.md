# Architecture Design Document

## System Overview

DevContext Engine is a comprehensive AI development assistance platform that maintains persistent project context across multiple AI models, sessions, and feature evolution cycles.

## Core Design Principles

### 1. **Persistence**
- All project context stored locally in `.devctx/` folder
- Human-readable and machine-indexable formats
- Incremental updates and snapshots
- No cloud dependency

### 2. **Security-First**
- Automatic secret detection using entropy analysis and pattern matching
- Sanitization of sensitive data before AI transmission
- Optional encryption at rest
- No credentials in memory files

### 3. **Multi-Model Support**
- Adapter pattern for different AI providers
- Unified interface regardless of underlying model
- Model-specific prompt optimization
- Cost comparison across providers

### 4. **Context Intelligence**
- Semantic understanding of queries
- Relevance ranking for retrieved context
- Automatic compression and summarization
- Token usage optimization

### 5. **Architecture Awareness**
- Enforcement of architectural decisions
- Prevention of removed feature re-implementation
- Validation of code against security rules
- Tracking of architectural evolution

## Component Architecture

### Context Engine
**Responsibility:** Retrieve and manage project context

- Loads project memory from `.devctx/memory.json`
- Matches queries to relevant context
- Ranks results by relevance
- Creates snapshots for history

### Security Module
**Responsibility:** Detect and sanitize sensitive data

- Pattern-based secret detection
- Entropy-based anomaly detection
- Automatic redaction for AI transmission
- Vulnerability tracking

### Token Analyzer
**Responsibility:** Count tokens and estimate costs

- Model-specific token estimation
- Cost calculation for different providers
- Optimization score calculation
- Analytics and reporting

### AI Adapters
**Responsibility:** Support multiple AI models

- Provider-specific prompt formatting
- Context injection with optimal formatting
- Token optimization per model
- Response handling customization

### Git Intelligence
**Responsibility:** Track project evolution

- Commit analysis for architectural impact
- Feature evolution tracking
- Removed feature identification
- Architecture change timeline

### Code Parsers
**Responsibility:** Analyze source code

- Multi-language support (TypeScript, Python, Java, Go)
- API contract detection
- Code structure analysis
- Dependency extraction

## Data Model

### ProjectMemory
```
├── architecture: ArchitectureMemory
│   ├── overview: string
│   ├── layers: ArchitectureLayer[]
│   ├── services: ServiceDescription[]
│   ├── databases: DatabaseDescription[]
│   └── integrations: Integration[]
├── features: FeatureMemory[]
├── removedFeatures: RemovedFeatureMemory[]
├── decisions: Decision[]
├── codeStandards: CodingStandard[]
├── securityRules: SecurityRule[]
├── apiContracts: APIContract[]
├── dependencies: DependencyMap
├── notes: DeveloperNote[]
├── knownIssues: Issue[]
├── technicalDebt: TechDebt[]
└── futurePlans: FuturePlan[]
```

## Query Processing Flow

```
User Query
    ↓
[Context Retrieval Request]
    ↓
[Query Analyzer] → Identify intent and keywords
    ↓
[Memory Loader] → Load ProjectMemory from disk
    ↓
[Relevance Ranker] → Score context by relevance
    ↓
[Context Compressor] → Summarize large contexts
    ↓
[Security Sanitizer] → Remove sensitive data
    ↓
[AI Adapter] → Format for target AI model
    ↓
[Token Analyzer] → Estimate costs
    ↓
Optimized Context Ready for AI
```

## Security Flow

```
Raw Content
    ↓
[Pattern Matcher] → Detect known secrets
    ↓
[Entropy Analyzer] → Detect high-entropy strings
    ↓
[Path Scanner] → Find sensitive file paths
    ↓
[Risk Scorer] → Calculate security score
    ↓
[Sanitizer] → Redact or mask sensitive data
    ↓
Safe Content for AI
```

## Conflict Detection Flow

```
Proposed Code
    ↓
[Architecture Validator] → Check against established patterns
    ↓
[Removed Feature Detector] → Check against removed features
    ↓
[Security Rule Validator] → Check security constraints
    ↓
[Conflict Report]
├── violations: string[]
├── securityIssues: string[]
└── conflictScore: number
```

## Monorepo Organization

### Dependency Graph

```
@devctx/cli
    ↓
@devctx/core
    ├→ @devctx/context-engine
    ├→ @devctx/security
    ├→ @devctx/token-analyzer
    ├→ @devctx/adapters
    ├→ @devctx/git-intelligence
    └→ @devctx/parsers

@devctx/context-engine
    ├→ @devctx/security
    └→ @devctx/shared

@devctx/security
    └→ @devctx/shared

@devctx/token-analyzer
    └→ @devctx/shared

@devctx/adapters
    ├→ @devctx/security
    ├→ @devctx/token-analyzer
    └→ @devctx/shared

@devctx/git-intelligence
    └→ @devctx/shared

@devctx/parsers
    └→ @devctx/shared
```

## Extension Points

### Custom AI Adapters
Implement `AIAdapter` interface for new models:
```typescript
class CustomAdapter implements AIAdapter {
  injectContext(): string { /* ... */ }
  optimizePrompt(): string { /* ... */ }
  estimateTokens(): number { /* ... */ }
}
```

### Custom Secret Patterns
Add regex patterns for organization-specific secrets:
```typescript
const sanitizer = new SecuritySanitizer([
  /COMPANY_KEY_[A-Z0-9]{32}/
]);
```

### Custom Code Parsers
Extend CodeAnalyzer for new languages:
```typescript
analyzer.registerLanguageHandler('rust', customHandler);
```

## Scalability Considerations

### For Large Codebases
- **Lazy Loading:** Load memory only when needed
- **Caching:** Multi-level cache (memory, disk)
- **Indexing:** Fast search with inverted indices
- **Compression:** Summarize large contexts

### For High Token Usage
- **Relevance Filtering:** Return only top N results
- **Context Compression:** Summarize long documents
- **Batching:** Process multiple queries together
- **Cost Monitoring:** Track and alert on spending

### For Team Collaboration (Future)
- **Shared Memory Store:** Central repository
- **Conflict Resolution:** Merge strategies
- **Access Control:** Permission-based access
- **Audit Log:** Track all changes

## Error Handling

All modules implement consistent error handling:
1. **Graceful Degradation** - Return partial results
2. **Clear Logging** - Informative error messages
3. **Recovery Options** - Suggest remediation
4. **Safe Defaults** - Don't break workflows

## Testing Strategy

### Unit Tests
- Each module tested independently
- Mocked dependencies
- Edge cases and error scenarios

### Integration Tests
- Module interactions
- Full workflow testing
- Real file system interactions

### E2E Tests
- CLI commands
- Full initialization flow
- Real project scenarios

## Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| Init | <2s | One-time setup |
| Context Retrieval | <100ms | With caching |
| Token Analysis | <50ms | Single prompt |
| Security Scan | <500ms | Full memory |
| Memory Sync | <1s | 10MB typical |

## Future Enhancements

### Short Term
- Vector embeddings with semantic search
- VS Code extension
- GitHub PR analysis integration

### Medium Term
- Team shared memory
- Web dashboard
- IDE plugin ecosystem
- LangChain integration

### Long Term
- AI governance platform
- Enterprise audit trails
- Custom model fine-tuning
- Distributed memory sync

## Security Audit Checklist

- ✓ No credentials in memory
- ✓ Secret pattern detection
- ✓ Entropy-based anomaly detection
- ✓ Optional encryption support
- ✓ Sanitization before AI transmission
- ✓ Local-first architecture
- ✓ No telemetry or tracking
- ✓ OWASP compliance

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintainers:** DevContext Team
