# DevContext Engine - Getting Started Guide

## 5-Minute Quick Start

### 1. Install DevContext

```bash
npm install -g devctx-engine
# or locally:
npm install --save-dev devctx-engine
```

### 2. Initialize Your Project

```bash
cd your-project
devctx init
```

This creates a `.devctx/` folder with template files.

### 3. Configure Your Project

Edit these files:

**`.devctx/architecture.md`**
```markdown
# System Architecture

## Overview
[Describe your system]

## Key Services
- API Server
- Database
- Cache

## Data Flow
[How data flows]
```

**`.devctx/security.md`**
```markdown
# Security Rules

## Authentication
- Method: JWT
- Header: Authorization: Bearer {token}

## Rate Limiting
- API: 100 req/minute per user

## Data Protection
- Encryption: AES-256 at rest
```

**`.devctx/coding-standards.md`**
```markdown
# Code Standards

## TypeScript
- Use strict mode
- Avoid any types
- Document public APIs

## Testing
- Minimum 80% coverage
- Test error cases
```

### 4. Use with Your AI Assistant

When working with Claude, ChatGPT, or other AI assistants:

```bash
# Get context for a task
devctx context "implement user authentication"

# Export optimized context for Claude
devctx export -m claude

# Copy the output and paste into your AI assistant
```

### 5. Sync and Monitor

```bash
# Sync your project state
devctx sync

# Check for security issues
devctx security-scan

# Analyze token usage
devctx tokens -m gpt-4 --cost

# View metrics
devctx metrics
```

## Common Workflows

### Workflow 1: Start a New Feature

```bash
# 1. Understand current context
devctx context "user profile system"

# 2. Get security rules
devctx context "authentication requirements"

# 3. Check for conflicts
devctx security-scan

# 4. Get AI context and start coding
devctx export -m claude
# Paste into Claude

# 5. Track the feature
devctx track "user profile" "Added user profile endpoints"
```

### Workflow 2: Refactoring

```bash
# 1. Understand architecture
devctx context "database layer structure"

# 2. Check for technical debt
devctx memory search "technical debt"

# 3. Get architecture decisions
devctx context "caching strategy"

# 4. Scan for issues
devctx security-scan

# 5. Get AI assistance
devctx export -m openai
```

### Workflow 3: Code Review

```bash
# Before reviewing AI-generated code:

# 1. Check for architecture violations
devctx conflicts < proposed-code.ts

# 2. Verify security compliance
devctx security-scan

# 3. Compare with existing patterns
devctx context "API design patterns"

# 4. Check token cost
devctx tokens
```

### Workflow 4: Team Onboarding

```bash
# For new team members:

# 1. Initialize DevContext
devctx init

# 2. Review architecture
cat .devctx/architecture.md

# 3. Review security rules
cat .devctx/security.md

# 4. Review coding standards
cat .devctx/coding-standards.md

# 5. Search for specific topics
devctx memory search "authentication"
devctx memory search "database design"
```

## Examples by Use Case

### Example 1: API Development

```bash
# Get API design guidelines
devctx context "REST API design"

# Check authentication requirements
devctx context "authentication"

# Get security rules for APIs
devctx context "API security"

# Export for AI assistant
devctx export -m claude
```

### Example 2: Database Work

```bash
# Get database schema overview
devctx context "database schema"

# Check data protection rules
devctx context "data protection encryption"

# Get migration patterns
devctx context "database migrations"

# Get AI assistance
devctx export -m gpt-4
```

### Example 3: Security Implementation

```bash
# Scan for vulnerabilities
devctx security-scan

# Get security requirements
devctx context "security requirements"

# Check authentication standards
devctx context "authentication standards"

# Export for security-focused AI
devctx export -m claude
```

### Example 4: Performance Optimization

```bash
# Check caching patterns
devctx context "caching strategy"

# Review architecture decisions
devctx memory search "performance"

# Check technical debt related to performance
devctx memory search "technical debt performance"

# Get AI suggestions
devctx export -m gpt-4 # GPT-4 often better for complex optimization
```

## Tips & Tricks

### Tip 1: Keep Memory Updated
```bash
# Regularly sync your project
devctx sync

# Track new features
devctx track "feature-name" "Description"
```

### Tip 2: Context Search
```bash
# Search memory by keywords
devctx memory search "authentication"
devctx memory search "caching"
devctx memory search "performance"

# Get specific context
devctx context "implement JWT"
devctx context "database optimization"
```

### Tip 3: Batch AI Requests
```bash
# Export context once
devctx export -m claude > claude-context.txt

# Use in multiple requests to reduce costs
# Paste context.txt at the start of each request
```

### Tip 4: Monitor Costs
```bash
# Check token usage before large projects
devctx tokens -m gpt-4 --cost

# Compare models
devctx tokens # Shows comparison by default
```

### Tip 5: Security First
```bash
# Always scan before code review
devctx security-scan

# Check for conflicts
devctx conflicts < my-code.ts
```

## Troubleshooting

### DevContext not found

```bash
# Make sure it's installed
npm install -g devctx-engine

# Or use locally with npx
npx devctx --help
```

### `.devctx` folder not found

```bash
# Initialize the project first
devctx init

# Make sure you're in the project root
pwd
# Should show your project directory
```

### Context not retrieves

```bash
# Check if memory is initialized
ls -la .devctx/memory.json

# Sync memory
devctx sync

# Try searching instead
devctx memory search "your-keyword"
```

### High token usage

```bash
# Analyze and optimize
devctx tokens --cost

# Use context compression
devctx export -m claude # Optimized for Claude

# Or manually chunk your requests
```

## Next Steps

1. **Customize Configuration**: Edit `.devctx/context-config.json`
2. **Document Architecture**: Write detailed `.devctx/architecture.md`
3. **Establish Security Rules**: Complete `.devctx/security.md`
4. **Start Using with AI**: Use `devctx export` with your favorite AI
5. **Track Progress**: Use `devctx track` to document features

## Resources

- **Main Documentation**: See README.md
- **API Reference**: See docs/API.md
- **Architecture Details**: See docs/ARCHITECTURE.md
- **Examples**: See examples/
- **Contributing**: See CONTRIBUTING.md

## Support

- 📧 Email: help@devctx.dev
- 🐛 Issues: https://github.com/devctx-engine/issues
- 💬 Discussions: https://github.com/devctx-engine/discussions

---

Happy coding with DevContext Engine! 🚀
