# Quick Start Guide

## Local Development

1. **Install Dependencies**
   ```bash
   bundle install
   ```

2. **Run Jekyll Locally**
   ```bash
   bundle exec jekyll serve
   ```

3. **View Site**
   Open http://localhost:4000/

## Deploy to GitHub Pages

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: TTRPG GM Tools MCP Server"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Source: GitHub Actions (should be auto-detected)
   - The `.github/workflows/jekyll.yml` will handle deployment

3. **Wait for Deployment**
   - Check the Actions tab for build status
   - Once complete, your site will be live at:
     `https://ttrpg-mcp.tedt.org/`

## Configure MCP Client

Once deployed, add this to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "ttrpg-gm-tools": {
      "url": "https://ttrpg-mcp.tedt.org/mcp",
      "transport": {
        "type": "http"
      }
    }
  }
}
```

### Claude Desktop Configuration Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## Next Steps

1. **Customize Data**: Edit JSON files in `data/` to add your own content
2. **Test Locally**: Run `bundle exec jekyll serve` to test changes
3. **Push Changes**: Commit and push to automatically redeploy
4. **Expand**: Add more tools, resources, or prompts as needed

## Troubleshooting

**Bundle install fails?**
- Make sure Ruby is installed: `ruby --version`
- Try: `gem install bundler`

**Jekyll serve fails?**
- Run: `bundle update`
- Check Ruby version (needs 2.7+)

**GitHub Pages not deploying?**
- Check Actions tab for errors
- Ensure GitHub Pages is enabled in Settings
- Verify the workflow file is present

**MCP client can't connect?**
- Verify the URL is correct
- Check that the site is deployed and accessible
- Ensure `mcp.json` exists at the root URL

## Adding More Content

### Add New Encounters
Edit `data/encounters.json` and add to the appropriate environment/difficulty array.

### Add New Names
Edit `data/names.json` and add to the race/gender arrays.

### Add New Plot Hooks
Edit `data/plot_hooks.json` and add to the theme arrays.

### Add New Tools
1. Update the Cloudflare Worker in `cloudflare-mcp-server/src/index.js`
2. Create data source in `data/` if needed
3. Document in README.md and demo.md

Happy Gaming! 🎲
