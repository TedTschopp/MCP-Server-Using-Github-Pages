# 🚀 Deployment Guide

## Quick Start

Follow these steps to deploy your TTRPG MCP Server:

### Step 1: Deploy GitHub Pages (Data Layer)

```bash
# Commit and push your changes
git add .
git commit -m "Add Cloudflare Worker MCP implementation"
git push origin main
```

GitHub Actions will automatically deploy to: `https://ttrpg-mcp.tedt.org/`

### Step 2: Deploy Cloudflare Worker (Server Layer)

```bash
# Navigate to worker directory
cd cloudflare-mcp-server

# Install dependencies
npm install

# Login to Cloudflare (if not already)
npx wrangler login

# Deploy the worker
npm run deploy
```

### Step 3: Configure Custom Domain Route

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click on your worker (`ttrpg-mcp-server`)
4. Go to **Settings** → **Triggers**
5. Under **Custom Domains**, add route:
   - **Route:** `ttrpg-mcp.tedt.org/mcp`
   - **Zone:** `tedt.org`

### Step 4: Test the Server

Test the MCP endpoint:

```bash
curl -X POST https://ttrpg-mcp.tedt.org/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"initialize","params":{}}'
```

You should see a response with protocol version and capabilities.

### Step 5: Configure Your MCP Client

Add to your MCP client config (e.g., Claude Desktop):

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

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

Restart your MCP client to load the new server.

## Verification Checklist

- [ ] GitHub Pages deployed successfully
- [ ] Can access `https://ttrpg-mcp.tedt.org/`
- [ ] Can view data files at `https://ttrpg-mcp.tedt.org/_data/encounters.json`
- [ ] Cloudflare Worker deployed successfully
- [ ] Custom domain route configured
- [ ] Can POST to `https://ttrpg-mcp.tedt.org/mcp`
- [ ] MCP client configuration updated
- [ ] Can use tools in MCP client

## Troubleshooting

### "Server does not support streaming"

This means your MCP client is trying to use SSE transport. Make sure:
- Transport is set to `"http"` not `"sse"`
- URL points to `/mcp` endpoint, not `/mcp.json`

### "Failed to fetch data"

Check that:
- GitHub Pages is deployed and accessible
- Data files exist at `https://ttrpg-mcp.tedt.org/_data/*.json`
- Cloudflare Worker can access GitHub Pages (check CORS)

### Worker not responding

- Check Cloudflare Dashboard for worker logs
- Verify custom domain route is configured correctly
- Test worker directly: `npx wrangler tail`

### Tools not working

- Check worker logs for errors
- Verify data files are correctly formatted JSON
- Test individual data files in browser

## Local Development

### Test Worker Locally

```bash
cd cloudflare-mcp-server
npm run dev
```

Then test against localhost:

```bash
curl -X POST http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/list","params":{}}'
```

### Test GitHub Pages Locally

```bash
bundle exec jekyll serve
# Visit http://localhost:4000/
```

## Cost Breakdown

### GitHub Pages
- **Cost:** FREE ✅
- **Limits:** 100GB bandwidth/month, 1GB repo size

### Cloudflare Workers
- **Free Tier:** 100,000 requests/day ✅
- **Paid Plan:** $5/month for 10M requests/month

For personal use, both stay within free tiers! 🎉

## Next Steps

1. ✅ Deploy everything
2. 🧪 Test with your MCP client
3. 🎨 Customize the data files
4. 📊 Monitor usage in Cloudflare Dashboard
5. 🚀 Share with other GMs!

## Alternative: Local MCP Server

If you prefer to run the server locally instead of using Cloudflare Workers, see the `ALTERNATIVE_LOCAL_SERVER.md` guide.
