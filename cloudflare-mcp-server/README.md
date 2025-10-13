# TTRPG MCP Server - Cloudflare Worker

This Cloudflare Worker implements a real MCP (Model Context Protocol) server that connects to the static data hosted on GitHub Pages.

## Problem It Solves

GitHub Pages can only serve static files. The MCP protocol requires a real server that can:
- Handle dynamic requests
- Execute tool logic
- Return formatted responses

This worker bridges that gap.

## Setup

### 1. Install Dependencies

```bash
cd cloudflare-mcp-server
npm install
```

### 2. Configure Wrangler

Make sure you're logged into Cloudflare:

```bash
npx wrangler login
```

### 3. Test Locally

```bash
npm run dev
```

### 4. Deploy to Cloudflare

```bash
npm run deploy
```

### 5. Configure Custom Domain

In Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Go to Settings → Triggers
4. Add custom domain route: `ttrpg-mcp.tedt.org/mcp`

## MCP Client Configuration

Update your MCP client configuration to use the worker endpoint:

```json
{
  "mcpServers": {
    "ttrpg-gm-tools": {
      "url": "https://ttrpg-mcp.tedt.org/mcp",
      "transport": "http"
    }
  }
}
```

**Note:** Changed from `"transport": "sse"` to `"transport": "http"` because Cloudflare Workers use HTTP, not Server-Sent Events.

## Alternative: Use SSE Transport

If your MCP client requires SSE transport, you'll need to use a different approach (see below).

## How It Works

1. Worker receives MCP protocol requests
2. Fetches necessary data from GitHub Pages JSON files
3. Executes tool logic (random selection, dice rolling, etc.)
4. Returns formatted MCP responses

## Available Tools

All 7 tools are implemented:
- ✅ generate_encounter
- ✅ generate_npc_name
- ✅ generate_location_name
- ✅ generate_personality
- ✅ generate_treasure
- ✅ generate_weather
- ✅ generate_plot_hook

## Cost

Cloudflare Workers Free Tier:
- 100,000 requests per day
- More than enough for personal use!
