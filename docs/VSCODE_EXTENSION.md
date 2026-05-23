# VS Code Extension Architecture

## Overview

The DevContext VS Code Extension provides IDE integration for the DevContext Engine, offering real-time context suggestions, security warnings, and AI-assisted development features.

## Extension Structure

```
vscode-extension/
├── src/
│   ├── extension.ts         # Main extension entry point
│   ├── webview/
│   │   ├── contextPanel.ts  # Memory browser webview
│   │   ├── metricsPanel.ts  # Metrics dashboard
│   │   └── styles.css
│   ├── commands/
│   │   ├── initProject.ts
│   │   ├── syncMemory.ts
│   │   ├── scanSecurity.ts
│   │   └── trackFeature.ts
│   ├── providers/
│   │   ├── contextProvider.ts     # Context hints
│   │   ├── diagnosticsProvider.ts # Problem detection
│   │   └── completionProvider.ts  # Code completion
│   └── services/
│       ├── devctxService.ts       # Bridge to CLI
│       └── statusBar.ts           # Status bar updates
├── media/
│   └── icons/
├── package.json
└── tsconfig.json
```

## Key Features

### 1. Context Panel
Shows relevant context as you code
- Architecture overview
- Security rules
- Related features
- Code standards

### 2. Diagnostic Provider
Warns about:
- Security rule violations
- Architecture violations
- Removed feature re-implementation
- Code style issues

### 3. Quick Actions
Context menu commands:
- "Initialize DevContext"
- "Sync Memory"
- "Scan for Secrets"
- "Get Context..."
- "Check Conflicts"
- "Export for AI"

### 4. Status Bar
- Shows DevContext status
- Displays current model
- Token usage indicator
- Quick access to commands

### 5. Code Hints
Inline hints for:
- Security implications
- Architectural decisions
- Related code
- Best practices

## Implementation Approach

### Extension Activation
```typescript
export function activate(context: vscode.ExtensionContext) {
  const devctxService = new DevContextService();
  
  // Register commands
  registerCommands(context, devctxService);
  
  // Register providers
  registerProviders(context, devctxService);
  
  // Update status bar
  updateStatusBar(devctxService);
}
```

### Command Examples
```typescript
// Get context command
vscode.commands.registerCommand('devctx.getContext', async () => {
  const editor = vscode.window.activeTextEditor;
  const selectedText = editor?.document.getText(editor.selection);
  
  const context = await devctxService.getAIContext({
    query: selectedText || "current task"
  });
  
  // Display in webview panel
  showContextPanel(context);
});
```

### Diagnostic Provider
```typescript
class DevContextDiagnosticsProvider {
  async updateDiagnostics(document: vscode.TextDocument) {
    const diagnostics: vscode.Diagnostic[] = [];
    
    // Check for conflicts
    const conflicts = await engine.detectConflicts(document.getText());
    
    for (const violation of conflicts.architectureViolations) {
      diagnostics.push({
        message: violation,
        severity: vscode.DiagnosticSeverity.Warning,
        range: new vscode.Range(0, 0, 0, 0)
      });
    }
    
    this.diagnosticCollection.set(document.uri, diagnostics);
  }
}
```

## Configuration in package.json

```json
{
  "contributes": {
    "commands": [
      {
        "command": "devctx.init",
        "title": "DevContext: Initialize Project"
      },
      {
        "command": "devctx.sync",
        "title": "DevContext: Sync Memory"
      }
    ],
    "keybindings": [
      {
        "command": "devctx.getContext",
        "key": "cmd+shift+d",
        "mac": "cmd+shift+d",
        "win": "ctrl+shift+d"
      }
    ],
    "views": {
      "explorer": [
        {
          "id": "devctxMemory",
          "name": "DevContext Memory",
          "when": "devctxInitialized"
        }
      ]
    }
  }
}
```

## Future Enhancements

- **Code Completion**: AI-assisted completion based on context
- **Hover Provider**: Show security/architecture info on hover
- **Task Integration**: Run DevContext commands from Tasks
- **Git Integration**: Show feature evolution in Source Control
- **Settings UI**: Graphical configuration editor
- **Memory Browser**: Browse and edit memory directly
- **Metrics Dashboard**: Real-time metrics visualization

---

This extension architecture provides a foundation for deep IDE integration while maintaining separation of concerns and modularity.
