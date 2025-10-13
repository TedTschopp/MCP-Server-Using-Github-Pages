# Project Structure

```
MCP-Server-Using-Github-Pages/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md                # Setup guide
├── 📄 IMPLEMENTATION.md            # Technical implementation notes
├── 📄 _config.yml                  # Jekyll configuration
├── 📄 Gemfile                      # Ruby dependencies
├── 📄 .gitignore                   # Git ignore rules
│
├── 🏠 index.html                   # Landing page
├── 🎮 demo.html                    # Interactive demo
├── 🔧 mcp.json                     # MCP server manifest
│
├── 📁 data/                        # TTRPG data files
│   ├── encounters.json             # Random encounters by environment
│   ├── names.json                  # NPC names by race/gender
│   ├── locations.json              # Location name components
│   ├── traits.json                 # Personality traits & quirks
│   ├── treasure.json               # Treasure tables by CR
│   ├── weather.json                # Weather descriptions
│   └── plot_hooks.json             # Adventure hooks by theme
│
├── 📁 cloudflare-mcp-server/       # Cloudflare Worker
│   └── src/index.js                # MCP server implementation
│
└── 📁 .github/                     # GitHub configuration
    └── workflows/
        └── jekyll.yml              # Auto-deployment workflow
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                         │
│                                                         │
│  ┌─────────────┐         ┌──────────────┐            │
│  │  mcp.json   │────────▶│  MCP Client  │            │
│  │  (manifest) │         │  (Claude,    │            │
│  └─────────────┘         │   etc.)      │            │
│                          └──────────────┘             │
│  ┌─────────────┐               │                      │
│  │ api/        │               │                      │
│  │ tools.json  │◀──────────────┘                      │
│  │ resources   │                                      │
│  │ prompts     │                                      │
│  └─────────────┘                                      │
│                                                        │
│  ┌─────────────┐         ┌──────────────┐            │
│  │ data/       │────────▶│  Static      │            │
│  │ *.json      │         │  Files       │            │
│  └─────────────┘         └──────────────┘            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Tools Overview

| Tool | Input | Output | Data Source |
|------|-------|--------|-------------|
| `generate_encounter` | level, environment, difficulty | Encounter details | `encounters.json` |
| `generate_npc_name` | race, gender | Character name | `names.json` |
| `generate_location_name` | type | Location name | `locations.json` |
| `generate_personality` | count | Traits/quirks | `traits.json` |
| `generate_treasure` | CR, type | Loot list | `treasure.json` |
| `generate_weather` | climate, season | Description | `weather.json` |
| `generate_plot_hook` | theme, level | Quest hook | `plot_hooks.json` |

## Content Statistics

### Encounters
- **5 Environments**: forest, dungeon, city, mountain, swamp
- **4 Difficulty Levels**: easy, medium, hard, deadly
- **~70+ Unique Encounters**

### Names
- **11 Races**: human, elf, dwarf, halfling, gnome, half-elf, half-orc, tiefling, dragonborn, orc, goblin
- **2-3 Gender Options** per race
- **30 Names** per race/gender combination
- **Total: ~700+ names**

### Locations
- **10 Location Types**: tavern, inn, city, town, village, dungeon, castle, shop, guild, temple
- **10-20 Prefixes/Suffixes** per type
- **Thousands of possible combinations**

### Personality Traits
- **20 Personality Traits**
- **20 Ideals**
- **20 Bonds**
- **20 Flaws**
- **20 Quirks**
- **Total: 100 unique traits**

### Treasure
- **4 CR Ranges**: 0-4, 5-10, 11-16, 17+
- **2 Types**: individual, hoard
- **50+ Items**: mundane, gems, art objects
- **30+ Magic Items**: categorized by rarity

### Weather
- **5 Climate Zones**: temperate, arctic, tropical, desert, mountain
- **4 Seasons** (where applicable)
- **50+ Unique Descriptions**

### Plot Hooks
- **8 Themes**: mystery, combat, intrigue, exploration, horror, comedy, romance, rescue
- **10 Hooks** per theme
- **Total: 80 adventure hooks**

## File Sizes (approximate)

| File | Size | Purpose |
|------|------|---------|
| `encounters.json` | ~15 KB | Encounter data |
| `names.json` | ~20 KB | NPC names |
| `locations.json` | ~5 KB | Location names |
| `traits.json` | ~8 KB | Personality data |
| `treasure.json` | ~10 KB | Treasure tables |
| `weather.json` | ~6 KB | Weather descriptions |
| `plot_hooks.json` | ~8 KB | Adventure hooks |

**Total Data: ~75 KB** - Perfect for GitHub Pages!

## Future Expansion Ideas

### More Content
- [ ] Additional environments (underwater, planar, urban)
- [ ] More races (tabaxi, aarakocra, genasi, etc.)
- [ ] Expanded treasure (legendary items, cursed items)
- [ ] NPC backgrounds and motivations
- [ ] Random events and complications
- [ ] Settlement generator
- [ ] Faction generator

### More Tools
- [ ] Dungeon room generator
- [ ] Combat encounter balancing
- [ ] Trap generator
- [ ] Puzzle generator
- [ ] Shop inventory generator
- [ ] Quest chain generator
- [ ] NPC relationship mapper

### Enhanced Features
- [ ] Web UI for testing tools
- [ ] Example MCP client implementation
- [ ] Dice roller integration
- [ ] Export to common formats (JSON, XML, Markdown)
- [ ] Import from other sources
- [ ] Community contributions system

## Technology Choices

### Why Jekyll?
- ✅ Native GitHub Pages support
- ✅ No build configuration needed
- ✅ Liquid templating for data processing
- ✅ Free hosting
- ✅ Automatic deployment

### Why Static Files?
- ✅ No server costs
- ✅ Instant global CDN
- ✅ No security concerns
- ✅ Version controlled content
- ✅ Easy to contribute

### Why JSON?
- ✅ Universal format
- ✅ Easy to edit
- ✅ Client-side friendly
- ✅ Structured data
- ✅ No database needed

## Contributing Guide

### Adding New Encounters
1. Open `data/encounters.json`
2. Find the environment and difficulty
3. Add object with: `name`, `creatures`, `description`
4. Commit and push

### Adding New Names
1. Open `data/names.json`
2. Navigate to race → gender
3. Add names to array
4. Maintain alphabetical order (optional)
5. Commit and push

### Adding New Tools
1. Update Cloudflare Worker code in `cloudflare-mcp-server/src/index.js`
2. Create/update data in `data/`
3. Document in README.md
4. Add to demo.md if interactive demo needed

## License & Credits

**License**: MIT - Free to use and modify

**Credits**:
- D&D 5E SRD for inspiration
- Community contributors (you!)
- GitHub Pages for hosting
- MCP protocol by Anthropic

---

Built with ❤️ for Game Masters everywhere! 🎲
