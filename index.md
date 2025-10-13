A **Model Context Protocol** server for tabletop RPG game masters, providing tools for generating encounters, NPCs, locations, and more!

## 📡 MCP Endpoint

```
https://ttrpg-mcp.tedt.org/mcp
```

## 🛠️ Available Tools

### 🗡️ Generate Random Encounter

Create random encounters based on party level, environment type, and difficulty.

**Parameters:** level (1-20), environment (forest, dungeon, city, etc.), difficulty (easy, medium, hard, deadly)

### 👤 Generate NPC Name

Generate character names for various fantasy races and cultures.

**Parameters:** race (human, elf, dwarf, orc, etc.), gender (optional)

### 🏛️ Generate Location Name

Create names for taverns, cities, dungeons, and other locations.

**Parameters:** type (tavern, city, dungeon, shop, guild)

### 🎭 Generate Personality Traits

Create personality traits, ideals, bonds, and flaws for NPCs.

**Parameters:** count (number of traits to generate)

### 💰 Generate Treasure

Generate treasure hoards and loot based on challenge rating.

**Parameters:** cr (challenge rating 0-30), type (individual, hoard)

### 🌤️ Generate Weather

Create atmospheric weather descriptions for your game sessions.

**Parameters:** climate (temperate, arctic, desert, tropical), season (optional)

### 📖 Generate Plot Hook

Generate adventure hooks and quest ideas for your campaign.

**Parameters:** theme (mystery, combat, intrigue, exploration, horror)

## 🔧 Setup Instructions

To use this MCP server with Claude Desktop or other MCP clients, add this to your configuration:

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

### Configuration File Locations

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## 📚 Resources

- [GitHub Repository](https://github.com/TedTschopp/MCP-Server-Using-Github-Pages)
- [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- [View MCP Manifest](mcp.json)
- [Quick Start Guide](QUICKSTART.html)
- [Deployment Guide](DEPLOYMENT.html)
- [Project Structure](PROJECT_STRUCTURE.html)

## 🤝 Contributing

Want to add more tools, encounters, or names? Contributions are welcome! Check out the GitHub repository to contribute.

## 🎯 Features

### 7 Powerful Tools

- **Generate Encounter**: Random combat encounters by environment and difficulty
- **Generate NPC Name**: 700+ fantasy names across 11 races
- **Generate Location Name**: Thousands of location name combinations
- **Generate Personality**: Rich NPC personality traits
- **Generate Treasure**: D&D-style treasure tables by challenge rating
- **Generate Weather**: Atmospheric weather descriptions
- **Generate Plot Hook**: 80+ adventure hooks across 8 themes

### 7 Data Resources

Access to complete TTRPG data files:
- Encounter database (70+ encounters)
- Name database (700+ names)
- Location name components
- Personality traits (100+ traits)
- Treasure tables
- Weather descriptions (50+ conditions)
- Plot hooks (80+ hooks)

### 3 AI Prompts

Pre-built prompts for complex generation:
- **Session Prep**: Complete game session preparation
- **Quick NPC**: Full NPC with name, personality, and background
- **Dungeon Room**: Room description with encounter and treasure

## 🏗️ Architecture

This server uses a hybrid architecture:
- **GitHub Pages**: Hosts static TTRPG data
- **Cloudflare Worker**: Implements MCP protocol via HTTP
- **Free hosting**: Both layers use generous free tiers
- **Global CDN**: Fast access worldwide

## 📖 Documentation

- [🎮 Interactive Demo](demo.html) - Try the tools in your browser!
- [Quick Start Guide](QUICKSTART.html) - Get started in 5 minutes
- [Deployment Guide](DEPLOYMENT.html) - Deploy your own server
- [Implementation Details](IMPLEMENTATION.html) - Technical architecture
- [Project Structure](PROJECT_STRUCTURE.html) - File organization
- [Cloudflare Worker](cloudflare-mcp-server/) - Server implementation

---

Built with ❤️ for Game Masters everywhere! 🎲
