# Antigravity Multi-MCP Interoperability & Integration Rules

This configuration enables seamless collaboration across all connected Model Context Protocol (MCP) servers and workspace services for Surfcamp.world.

## Connected MCP Ecosystem

1. **Filesystem & Git**:
   - Access workspace files, read project structures, inspect code, and commit/track changes.
   - Filesystem path: `c:\Users\rgute\Desktop\surfcamp.world dashboard`

2. **Supabase & Postgres**:
   - Query backend database schemas, run SQL queries, inspect tables, and sync user/booking metrics with `server.ts` and dashboard components.

3. **GitHub**:
   - Query repository issues, inspect pull requests, read remote code changes, and sync task tracking.

4. **Puppeteer**:
   - Perform automated browser testing, capture UI screenshots, and test front-end dashboard flows visually.

5. **Memory**:
   - Maintain active knowledge graphs and context across sessions for user preferences, schema mappings, and development state.

## Multi-MCP Automated Workflows

- **Database-to-UI Workflow**: Query Supabase/Postgres -> Update `src/data/` or API routes in `server.ts` -> Verify frontend with Puppeteer screenshot.
- **GitHub-to-Codebase Workflow**: Read GitHub Issue -> Edit corresponding components via Filesystem -> Commit changes using Git MCP.
- **Memory Tracking**: Persist architectural decisions and schema relationships into Memory MCP after major modifications.
