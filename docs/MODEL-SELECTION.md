# Model Selection Guide

Choose the right model for your task based on cost, speed, and capability.

---

## Quick Reference

| Model | Best For | Speed | Cost | Context |
|-------|----------|-------|------|---------|
| **GPT-5.4** | Complex refactoring, architecture | Medium | $$$ | 272K |
| **GPT-5.3-Codex** | General coding, reviews | Medium | $$ | 272K |
| **GPT-5.2-Codex** | Quick tasks, high volume | Fast | $ | 272K |
| **GPT-5.1-Codex-Max** | Large projects, deep reasoning | Slow | $$$$ | 272K |
| **Claude Opus 4.6** | Alternative perspective | Medium | $$$ | 200K |
| **Ollama (local)** | Privacy, offline, free | Varies | Free | Varies |

---

## Model Details

### GPT-5.4 (Default)

**Use when:**
- Complex architectural decisions
- Multi-file refactoring
- Security-critical code review
- Production deployments

**Avoid when:**
- Simple formatting fixes
- High-volume repetitive tasks
- Cost is a primary concern

```bash
codex --model gpt-5.4 "Refactor authentication to use OAuth2"
```

### GPT-5.3-Codex

**Use when:**
- Day-to-day coding tasks
- Code reviews
- Test generation
- Documentation

**Sweet spot:** Best balance of capability and cost for most tasks.

```bash
codex --model gpt-5.3-codex "Add unit tests for UserService"
```

### GPT-5.2-Codex

**Use when:**
- Simple fixes and formatting
- Rapid iteration
- Learning and experimentation
- CI/CD pipelines (cost control)
- High volume tasks

**Avoid when:**
- Complex multi-step reasoning
- Security-sensitive analysis

```bash
codex --model gpt-5.2-codex "Fix the typo in line 42"
```

**Note:** Available on free tier.

### GPT-5.1-Codex-Max

**Use when:**
- Entire codebase analysis
- Long-running sessions (hours)
- Project-scale refactoring
- Deep reasoning tasks

**Avoid when:**
- Quick tasks (overkill)
- Cost-sensitive projects

```bash
codex --model gpt-5.1-codex-max "Analyze this entire microservices repo"
```

### Anthropic Claude

**Use when:**
- Want a second opinion
- Prefer Claude's style
- Cross-referencing responses

```toml
# In config.toml
[providers.anthropic]
type = "anthropic"
api_key = "${ANTHROPIC_API_KEY}"
model = "claude-sonnet-4-20250514"
```

### Local Models (Ollama)

**Use when:**
- Working with sensitive/proprietary code
- No internet connection
- Cost must be zero
- Privacy requirements

**Trade-offs:**
- Slower than cloud models
- Less capable for complex tasks
- Requires local GPU for best performance

```toml
# In config.toml
[providers.ollama]
type = "ollama"
base_url = "http://localhost:11434"
model = "codellama:34b"
```

---

## Cost Optimization Strategies

### 1. Use Profiles

```toml
# config.toml
[profiles.quick]
model = "gpt-5.2-codex"
approval_policy = "never"

[profiles.thorough]
model = "gpt-5.4"
approval_policy = "on-request"
```

```bash
codex --profile quick "Fix formatting"
codex --profile thorough "Security audit"
```

### 2. Use Fast Mode

Fast mode is now enabled by default. Toggle with `/fast` in the TUI
or pass `--fast` on the command line.

### 3. Be Specific in Prompts

```bash
# Expensive: vague, generates lots of output
codex "Review this file"

# Cheaper: specific, focused output
codex "Check line 50-60 for null pointer issues"
```

### 4. Reduce Context Size

```toml
# Smaller AGENTS.md = fewer tokens
project_doc_max_bytes = 16384  # 16KB instead of 32KB
```

### 5. Use Smaller Models for CI/CD

```yaml
# In GitHub Actions
codex exec "..." --model gpt-5.2-codex
```

---

## Decision Flowchart

```
Is this a quick fix or formatting?
├─ Yes → GPT-5.2-Codex
└─ No
   │
   Is this security/production critical?
   ├─ Yes → GPT-5.4
   └─ No
      │
      Does it need deep reasoning?
      ├─ Yes → GPT-5.1-Codex-Max
      └─ No
         │
         Is cost a concern?
         ├─ Yes → GPT-5.2-Codex
         └─ No → GPT-5.3-Codex
```

---

## Monitoring Usage

```bash
# Check API usage (OpenAI dashboard)
open https://platform.openai.com/usage

# Enable logging to track token usage
[logging]
level = "info"
file = "~/.codex/log/codex.log"
```

---

## Recommendations by Task

| Task | Recommended Model |
|------|-------------------|
| Fix typos, formatting | 5.2-Codex |
| Add comments/docs | 5.2-Codex |
| Simple bug fixes | 5.2-Codex |
| Unit test generation | 5.3-Codex |
| Code review | 5.3-Codex |
| Refactoring | 5.3-Codex or 5.4 |
| Architecture design | 5.4 |
| Security audit | 5.4 |
| Full codebase analysis | 5.1-Codex-Max |
| CI/CD automation | 5.2-Codex |
| Learning/experimenting | 5.2-Codex |
