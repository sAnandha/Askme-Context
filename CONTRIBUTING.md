# Contributing to DevContext Engine

Thank you for your interest in contributing! This document provides guidelines for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others succeed
- Focus on ideas, not individuals

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- TypeScript knowledge

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/devctx-engine/devctx-engine.git
cd devctx-engine

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test
```

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive

### 3. Build and Test
```bash
npm run build
npm run test
npm run lint
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Create pull request on GitHub with:
- Clear description
- Related issues
- Testing notes

## Architecture Guidelines

### Package Organization
- Each package is independent and testable
- Use dependency injection for flexibility
- Keep interfaces stable
- Document public APIs

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Document complex logic
- Use clear variable names

### Performance
- Minimize file I/O
- Cache where appropriate
- Use streams for large data
- Profile before optimizing

### Security
- Validate all inputs
- Don't expose sensitive data
- Use established libraries
- Follow OWASP guidelines

## Testing Requirements

- Write tests for all features
- Aim for 80%+ coverage
- Test error cases
- Test edge cases
- Use descriptive test names

```typescript
describe('SecuritySanitizer', () => {
  it('should detect API keys', () => {
    const sanitizer = new SecuritySanitizer();
    const result = sanitizer.scanForSecrets('api_key=sk_123');
    expect(result.hasSecrets).toBe(true);
  });
});
```

## Documentation

### Code Documentation
- Document all public APIs
- Use JSDoc comments
- Provide examples
- Document parameters and returns

```typescript
/**
 * Retrieve context for an AI assistant query
 * @param request - Context retrieval request with query and filters
 * @returns Retrieved context ranked by relevance
 * @example
 * const context = await engine.getAIContext({
 *   query: "implement authentication",
 *   limit: 5
 * });
 */
async getAIContext(request: ContextRetrievalRequest): Promise<string>
```

### README Updates
- Keep main README up to date
- Document breaking changes
- Update version numbers
- Add new features to docs

## PR Review Process

### What We Look For
- ✓ Clear implementation
- ✓ Comprehensive tests
- ✓ Updated documentation
- ✓ No performance regressions
- ✓ Security best practices
- ✓ Follows code style

### Review Feedback
- Be constructive
- Suggest improvements
- Approve when satisfied
- Merge after approval

## Release Process

### Version Numbering
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Steps
1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Publish to npm
5. Create GitHub release

## Areas for Contribution

### High Priority
- [ ] Vector embeddings integration
- [ ] VS Code extension
- [ ] GitHub integration
- [ ] Performance improvements

### Medium Priority
- [ ] Additional language parsers
- [ ] More AI adapters
- [ ] Web dashboard
- [ ] Team features

### Low Priority
- [ ] Documentation improvements
- [ ] Example projects
- [ ] Tooling enhancements
- [ ] CI/CD improvements

## Reporting Bugs

### Bug Report Template
```markdown
**Description**
Brief description of the bug

**Reproduction Steps**
1. Step 1
2. Step 2
3. ...

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [Windows/Mac/Linux]
- Node: [version]
- Package: [@devctx/package-name]

**Error Message**
[Paste any error messages]
```

## Feature Requests

### Feature Request Template
```markdown
**Description**
What feature would be useful?

**Use Case**
Why do we need this?

**Proposed Solution**
How could this be implemented?

**Alternatives**
Other approaches considered
```

## Questions or Need Help?

- 📧 Email: developers@devctx.dev
- 💬 GitHub Discussions: [link]
- 🐛 Issues: [link]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DevContext Engine! 🚀
