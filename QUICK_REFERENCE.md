# DevContext Engine - Quick Reference

## 📖 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](README.md) | Overview & quick start | Everyone |
| [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) | Tutorials & workflows | New users |
| [docs/API.md](docs/API.md) | Complete API reference | Developers |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design & components | Architects |
| [docs/VSCODE_EXTENSION.md](docs/VSCODE_EXTENSION.md) | Extension architecture | Contributors |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | File organization | Developers |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guide | Contributors |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What was built | Stakeholders |

## 🚀 Quick Commands

### Getting Started
```bash
npm install
npm run build
devctx init
```

### Development
```bash
npm run dev              # Watch mode for all packages
npm run build            # Build all packages
npm run test             # Run tests
npm run lint             # Check code style
npm run clean            # Clean everything
```

### CLI
```bash
devctx init              # Initialize project
devctx sync              # Sync state
devctx context <query>   # Get context
devctx tokens -m gpt-4   # Analyze tokens
devctx security-scan     # Scan for secrets
devctx export -m claude  # Export for AI
devctx metrics           # Show metrics
devctx help              # Show help
```

## 💻 Common Code Examples

### Initialize Engine
```typescript
import { createDevContextEngine } from '@devctx/core';

const engine = createDevContextEngine('/path/to/project');
await engine.initialize();
```

### Get Context for AI
```typescript
const context = await engine.getAIContext({
  query: 'implement authentication',
  limit: 5,
  includeArchitecture: true,
  includeSecurity: true
});
```

### Scan for Security
```typescript
const report = await engine.scanSecurity();
console.log(`Score: ${report.securityScore}%`);
```

### Analyze Tokens
```typescript
const analyzer = new TokenAnalyzer();
const estimate = analyzer.generateEstimate(prompt, 'gpt-4');
console.log(`Cost: $${estimate.estimatedCost}`);
```

### Use AI Adapters
```typescript
import { AIAdapterFactory } from '@devctx/adapters';

const adapter = AIAdapterFactory.createAdapter('claude');
const injected = adapter.injectContext(prompt, contextData);
```

## 📁 Key Files

### Core Implementation
- `packages/core/src/index.ts` - Main API
- `packages/cli/src/cli.ts` - Command-line tool
- `packages/context-engine/src/index.ts` - Context engine
- `packages/security/src/index.ts` - Security module
- `packages/shared/src/index.ts` - Types

### Documentation
- `docs/ARCHITECTURE.md` - System design
- `docs/API.md` - API reference
- `docs/GETTING_STARTED.md` - Tutorial
- `examples/basic-usage.ts` - Code examples

## 🎯 Common Tasks

### Set Up New Project
1. Run `devctx init`
2. Edit `.devctx/architecture.md`
3. Edit `.devctx/security.md`
4. Run `devctx sync`

### Get Context for Task
1. Run `devctx context "your task"`
2. Or run `devctx export -m claude`
3. Copy output to AI assistant

### Check Code Quality
1. Run `devctx security-scan`
2. Run `devctx conflicts < your-code.ts`
3. Review recommendations

### Add New Feature
1. Read relevant context: `devctx context "feature name"`
2. Implement with AI assistance
3. Track with: `devctx track "feature" "description"`
4. Run: `devctx sync`

### Switch AI Models
```bash
# Get context for Claude
devctx export -m claude

# Get context for GPT-4
devctx export -m openai

# Compare costs
devctx tokens
```

## 🔍 Troubleshooting

### Issue: ".devctx not found"
```bash
# Make sure you're in project root
cd /path/to/project
devctx init
```

### Issue: "Permission denied"
```bash
# On macOS/Linux
chmod +x node_modules/.bin/devctx
# Or use npx
npx devctx command
```

### Issue: "Context is empty"
```bash
# Sync project first
devctx sync

# Check memory file
cat .devctx/memory.json

# Update with data
devctx track "feature" "description"
```

### Issue: "High token usage"
```bash
# Analyze and optimize
devctx tokens --cost

# Export for specific model (optimized)
devctx export -m claude  # More efficient
```

## 📚 API Cheat Sheet

### DevContextEngine
```typescript
engine.initialize()              // Set up project
engine.getAIContext(request)     // Get context
engine.scanSecurity()            // Scan for secrets
engine.detectConflicts(code)     // Check code
engine.analyzeTokenUsage(prompts) // Analyze tokens
engine.trackFeature(name, desc)  // Track feature
engine.getMetrics()              // Get metrics
engine.exportContext(provider)   // Export for AI
```

### ContextEngine
```typescript
engine.retrieveContext(request)      // Get context
engine.getArchitectureContext()      // Get architecture
engine.getSecurityContext()          // Get security rules
engine.loadProjectMemory()           // Load memory
engine.saveProjectMemory(memory)     // Save memory
```

### TokenAnalyzer
```typescript
analyzer.estimatePromptTokens(text)
analyzer.generateEstimate(message, model)
analyzer.calculateCost(model, inputTokens, outputTokens)
analyzer.compareModelCosts(message, models)
analyzer.analyzePromptOptimization(prompt)
```

### SecuritySanitizer
```typescript
sanitizer.scanForSecrets(text)
sanitizer.redact(text)
sanitizer.maskSensitiveData(text)
sanitizer.isSafeForAI(text)
```

### AIAdapterFactory
```typescript
AIAdapterFactory.createAdapter('openai')
AIAdapterFactory.createAdapter('claude')
AIAdapterFactory.createAdapter('gemini')
AIAdapterFactory.createAdapter('amazon-q')
AIAdapterFactory.getSupportedProviders()
```

## 🛠️ Development Workflow

### Start Development
```bash
npm run dev    # All packages in watch mode
```

### Test Changes
```bash
npm run build
npm run test
npm run lint
```

### Submit Changes
```bash
git commit -m "feat: description"
git push origin feature-branch
# Create PR on GitHub
```

## 📊 Project Stats

- **Packages:** 12
- **Modules:** 40+
- **Classes:** 15+
- **Interfaces:** 50+
- **CLI Commands:** 15+
- **Lines of Code:** 6000+
- **Documentation Pages:** 6+
- **Test Coverage:** Ready for 80%+

## 🔗 Important Links

- **Repository:** https://github.com/devctx-engine/devctx-engine
- **Issue Tracker:** https://github.com/devctx-engine/devctx-engine/issues
- **Discussions:** https://github.com/devctx-engine/devctx-engine/discussions
- **Documentation:** See `docs/` folder

## 📞 Support

- 📧 Email: support@devctx.dev
- 💬 GitHub Discussions
- 🐛 Report Issues
- ✨ Request Features

## 📋 Checklist for Contributors

- [ ] Read CONTRIBUTING.md
- [ ] Set up dev environment
- [ ] Run `npm install && npm run build`
- [ ] Create feature branch
- [ ] Make changes with tests
- [ ] Run `npm run lint` and `npm run test`
- [ ] Commit with descriptive message
- [ ] Push and create PR
- [ ] Respond to review feedback

## 🎓 Learning Path

1. **Start Here:** [README.md](README.md)
2. **Try It:** [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
3. **Understand Design:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
4. **Learn API:** [docs/API.md](docs/API.md)
5. **See Examples:** [examples/basic-usage.ts](examples/basic-usage.ts)
6. **Contribute:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Quick Reference v0.1.0**  
**Last Updated:** 2024  
**License:** MIT
