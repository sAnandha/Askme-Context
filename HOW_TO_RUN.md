# How to Run the DevContext Engine Project

This guide will help you get the DevContext Engine up and running on your machine.

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
  - [Download Node.js](https://nodejs.org/)
  - Verify installation: `node --version`
  
- **npm** (usually comes with Node.js)
  - Verify installation: `npm --version`

- **Git** (optional, for cloning the repository)
  - [Download Git](https://git-scm.com/)

---

## Installation Steps

### 1. Navigate to the Project Directory

```bash
cd /workspace/devctx-engine
```

### 2. Install Dependencies

Install all dependencies for the monorepo and all 12 packages:

```bash
npm install
```

This will:
- Download all packages from npm
- Set up npm workspaces
- Install dev dependencies

**Expected time:** 2-5 minutes

---

## Building the Project

### Build All Packages

```bash
npm run build
```

This will:
- Compile all TypeScript to JavaScript
- Generate type definitions
- Output to `dist/` folders in each package

**Expected time:** 30-60 seconds

### Build Specific Package

```bash
cd packages/core
npm run build
```

---

## Running the CLI

### Option 1: Using npx (Recommended)

```bash
npx devctx init
npx devctx sync
npx devctx help
```

### Option 2: Install Globally (Development)

```bash
npm install -g ./packages/cli
devctx init
devctx help
```

### Available Commands

```bash
devctx init              # Initialize a new project
devctx sync              # Sync project state
devctx context <query>   # Get context for a query
devctx tokens -m <model> # Analyze token usage
devctx security-scan     # Scan for security issues
devctx export -m <model> # Export for AI model
devctx track <feature>   # Track a feature
devctx metrics           # Show project metrics
devctx help              # Show help
```

---

## Development Mode

### Run in Watch Mode

Watch all packages for changes and rebuild automatically:

```bash
npm run dev
```

### Run Tests

```bash
npm run test
```

### Run Linter

```bash
npm run lint
```

### Clean Build Artifacts

```bash
npm run clean
```

---

## Using the Core SDK

### In a TypeScript Project

```typescript
import { createDevContextEngine } from '@devctx/core';

// Initialize engine
const engine = createDevContextEngine('/path/to/project');
await engine.initialize();

// Get context for AI
const context = await engine.getAIContext({
  query: 'how to implement authentication',
  limit: 5,
  includeArchitecture: true
});

console.log(context);
```

### In a Node.js Project

```javascript
const { createDevContextEngine } = require('@devctx/core');

(async () => {
  const engine = createDevContextEngine('./my-project');
  await engine.initialize();
  
  const metrics = await engine.getMetrics();
  console.log(metrics);
})();
```

---

## Project Structure

```
devctx-engine/
├── packages/              # 12 npm packages
│   ├── core/             # Main SDK
│   ├── cli/              # Command-line tool
│   ├── context-engine/   # Context retrieval
│   ├── security/         # Security module
│   ├── token-analyzer/   # Token analytics
│   ├── adapters/         # AI adapters
│   ├── git-intelligence/ # Git integration
│   ├── parsers/          # Code analysis
│   ├── embeddings/       # Embeddings (future)
│   ├── shared/           # Type definitions
│   └── vscode-extension/ # VS Code plugin
├── docs/                 # Documentation
├── examples/             # Code examples
├── package.json          # Root monorepo config
├── tsconfig.json         # TypeScript config
└── README.md             # Main documentation
```

---

## Common Tasks

### Initialize a New Project

```bash
cd my-new-project
npx devctx init
```

This creates:
- `.devctx/` folder with starter files
- `memory.json` - Project memory
- `architecture.md` - Architecture template
- `security.md` - Security rules

### Get Context for a Task

```bash
devctx context "implement user authentication"
```

Returns relevant architecture and security context.

### Track a Feature

```bash
devctx track "authentication" "JWT-based user authentication system"
```

### Check Security

```bash
devctx security-scan
```

Scans your code for exposed secrets and vulnerabilities.

### Analyze Token Usage

```bash
devctx tokens -m gpt-4
```

Shows estimated tokens and costs for different models.

---

## Troubleshooting

### Issue: "Cannot find module"

**Solution:** Make sure you've installed dependencies:
```bash
npm install
npm run build
```

### Issue: "devctx command not found"

**Solution:** Use npx instead:
```bash
npx devctx help
```

Or build and install locally:
```bash
npm run build
npm install -g ./packages/cli
```

### Issue: TypeScript errors during build

**Solution:** Check TypeScript version:
```bash
npx tsc --version
```

Should be 5.0.0 or higher.

### Issue: Port already in use (if running dev server)

**Solution:** Kill the process using the port or use a different port:
```bash
# On Windows
netstat -ano | findstr :PORT_NUMBER

# On macOS/Linux
lsof -i :PORT_NUMBER
```

### Issue: npm install hangs

**Solution:** Clear npm cache:
```bash
npm cache clean --force
npm install
```

---

## Documentation

For more information, see:

- **[README.md](README.md)** - Project overview
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design
- **[docs/API.md](docs/API.md)** - API reference
- **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** - Tutorials
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - File organization
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands

---

## Next Steps

1. **Run the build:**
   ```bash
   npm install
   npm run build
   ```

2. **Initialize a test project:**
   ```bash
   mkdir test-project
   cd test-project
   npx devctx init
   ```

3. **Try a command:**
   ```bash
   devctx sync
   ```

4. **Read the documentation:**
   - Start with [README.md](README.md)
   - Then [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)

---

## Support

- 📧 Email: support@devctx.dev
- 🐛 Report Issues: [GitHub Issues](https://github.com/devctx-engine/devctx-engine/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/devctx-engine/devctx-engine/discussions)

---

**Version:** 0.1.0  
**Last Updated:** May 2026
