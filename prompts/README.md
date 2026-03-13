# Codex Custom Prompts

This directory contains custom prompt templates for use with OpenAI Codex CLI.

## Installation

Copy these files to your Codex prompts directory:

```bash
cp -r prompts/* ~/.codex/prompts/
```

## Available Prompts

### `/refactor`
Refactors code following clean code principles.

### `/security-audit`
Performs comprehensive security analysis with severity ratings.

### `/test-gen`
Generates unit tests with 80% coverage target.

### `/pr-review`
Reviews code like a senior engineer would.

### `/api-upgrade`
Migrates code to use latest API versions.

### `/perf-fix`
Analyzes and optimizes performance bottlenecks.

## Usage

After installing, use these prompts in Codex:

```bash
# Interactive mode
codex
> /security-audit

# Non-interactive mode
codex exec "Run /security-audit on the UserService class"
```

## Creating Your Own

1. Create a new `.md` file in `~/.codex/prompts/`
2. Name it after your command (e.g., `deploy-check.md` for `/deploy-check`)
3. Write clear instructions in markdown format

## Note on Arguments

Codex doesn't currently support parameterized prompts like Claude Code's `$ARGUMENTS`.
See `scripts/review-file.sh` for a workaround using shell scripts.

---

## Prompts vs Skills: When to Use Each

Since December 2025, Codex supports **Agent Skills** - a more powerful alternative to custom prompts.

| Aspect | Custom Prompts | Agent Skills |
|--------|---------------|--------------|
| **Structure** | Single `.md` file | Directory with `SKILL.md` + resources |
| **Invocation** | `/prompt-name` | `$skill-name` or auto-detected |
| **Resources** | Text only | Scripts, templates, reference docs |
| **Sharing** | Copy file | Git-friendly directory |
| **Complexity** | Simple templates | Multi-step workflows |

### Use Custom Prompts When:
- You need a quick, reusable instruction set
- The task is straightforward (< 20 lines of instructions)
- No supporting files or scripts are needed
- You want fast, inline invocation

### Use Agent Skills When:
- The workflow has multiple steps or decision points
- You need supporting resources (scripts, templates, examples)
- You want team-wide sharing via repository
- The task benefits from implicit auto-detection
- You need to invoke external tools or scripts

### Migrating to Skills

To convert a prompt to a skill:

```bash
# Use the built-in skill creator
$skill-creator Convert my /security-audit prompt to a skill

# Or manually create:
mkdir -p ~/.agents/skills/security-audit
mv ~/.codex/prompts/security-audit.md ~/.agents/skills/security-audit/SKILL.md
# Add YAML frontmatter to SKILL.md
```

See the [Agent Skills documentation](https://developers.openai.com/codex/skills/) for details.
