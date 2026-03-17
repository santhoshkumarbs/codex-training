# Lab 6: MCP Servers with Context7

## Objective

Configure an MCP (Model Context Protocol) server in Codex and use it to pull live library documentation into your prompts.

**Time:** 15–20 minutes

## Background: What Is MCP?

MCP is an open protocol that lets AI tools connect to external data sources and services. Instead of relying solely on training data, Codex can call MCP servers at runtime to fetch up-to-date information.

Each MCP server exposes **tools** that Codex can invoke. Context7, for example, exposes two tools:

| Tool | Purpose |
|------|---------|
| `resolve-library-id` | Converts a library name (e.g., "react-hook-form") to a Context7 ID |
| `query-docs` | Fetches current documentation and code examples for a library |

When you add Context7 as an MCP server, Codex gains the ability to look up live documentation for any library — no copy-pasting from docs sites.

## Prerequisites

- Codex CLI installed and working
- Node.js 18+ (for npx)
- A free Context7 API key (see Step 1)

## Step-by-Step Guide

### Step 1: Get a Context7 API Key

1. Visit [context7.com](https://context7.com) and sign in
2. Go to the dashboard and copy your API key
3. The service is free — the key is used for rate limiting

### Step 2: Add Context7 to Codex

Run this command, replacing `YOUR_API_KEY` with your actual key:

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY
```

This adds Context7 to your `~/.codex/config.toml`. You can verify by running:

```bash
codex mcp list
```

You should see `context7` listed with its two tools.

### What Just Happened?

The command added a block like this to your `~/.codex/config.toml`:

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
```

When Codex starts, it launches this server as a subprocess. Codex discovers the server's tools and can call them during any conversation.

### Step 3: Test It — Simple Query

Start Codex and ask a documentation question:

```
What does the useForm hook from react-hook-form return? Use context7 to look up the current docs.
```

**What to observe:**
- Codex calls `resolve-library-id` to find the Context7 ID for react-hook-form
- Then calls `query-docs` to fetch the actual documentation
- The response includes current API details, not just training data

### Step 4: Apply It to Real Code

Navigate to the React forms exercise and start Codex:

```bash
cd exercises/react-forms/starter
codex
```

Now try a prompt that benefits from live docs:

```
Look up the current Zod documentation using context7, then create a
registration form schema with email, password, confirmPassword, and
username validation. Use the latest Zod API.
```

**What to observe:**
- Codex fetches Zod's current API before writing code
- The generated code uses up-to-date syntax and features
- Compare this with asking the same question without Context7

### Step 5: Compare With and Without

Try this experiment to see the difference MCP makes:

1. Ask Codex to generate something using a library you know well
2. Check whether the response uses current APIs
3. Now ask the same question but explicitly say "use context7 to look up the docs first"
4. Compare the two responses

### Step 6: Try Other Libraries

Context7 has documentation for thousands of libraries. Try looking up docs for libraries from the other exercises:

```
Use context7 to look up Spring Boot 3.2 @RestController documentation
and show me the current best practices for exception handling
```

```
Use context7 to find the current pytest fixtures documentation
and show me how to use tmp_path
```

## How MCP Servers Work

When Codex starts with MCP servers configured:

1. **Launch** — Codex starts each MCP server as a child process
2. **Discovery** — Codex asks each server what tools it provides
3. **Availability** — The tools appear alongside Codex's built-in tools
4. **Invocation** — When a tool is relevant, Codex calls it and uses the result
5. **Shutdown** — Servers are stopped when Codex exits

The server communicates with Codex over **stdio** (standard input/output) using JSON-RPC messages. You don't need to manage this — Codex handles it automatically.

## Configuration Options

### User-Level (All Projects)

The `codex mcp add` command writes to `~/.codex/config.toml` by default.

### Project-Level (Single Project)

For project-scoped servers, add `--scope project`:

```bash
codex mcp add --scope project context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY
```

This writes to `.codex/config.toml` in the current project directory.

### Remote HTTP Servers

Some MCP servers offer a remote HTTP endpoint instead of a local process:

```bash
codex mcp add --transport http --header "CONTEXT7_API_KEY: YOUR_API_KEY" context7-remote https://mcp.context7.com/mcp
```

### Manual Configuration

You can also edit `~/.codex/config.toml` directly:

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
```

## Success Criteria

- [ ] Context7 appears in `codex mcp list`
- [ ] Codex can resolve a library name to a Context7 ID
- [ ] Codex fetches live documentation when asked
- [ ] You've used live docs to generate code in one of the exercises
- [ ] You understand the difference between user-level and project-level MCP config

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Server failed to start" | Check that `npx` is on your PATH and Node.js 18+ is installed |
| "Tool timed out" | Network issue — check your internet connection |
| "Rate limited" | Verify your API key is set correctly |
| Tools don't appear | Restart Codex after adding the server |

## Advanced Challenges

1. **Add a second MCP server** — Try adding another server from the [MCP server directory](https://github.com/modelcontextprotocol/servers)
2. **Project-scoped config** — Add Context7 at the project level for one exercise and verify it only appears there
3. **Combine with AGENTS.md** — Add a note in an exercise's AGENTS.md telling Codex to always use Context7 for documentation lookups
