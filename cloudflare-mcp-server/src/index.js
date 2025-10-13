/**
 * TTRPG GM Tools MCP Server - Cloudflare Worker Implementation
 * 
 * This worker implements the Model Context Protocol (MCP) and serves
 * as a bridge between MCP clients and the static data hosted on GitHub Pages.
 */

// Helper function to fetch data from GitHub Pages
async function fetchData(filename) {
  const response = await fetch(`https://ttrpg-mcp.tedt.org/data/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
  }
  return response.json();
}

// Tool implementations
const tools = {
  async generate_encounter({ level, environment, difficulty = 'medium' }) {
    const data = await fetchData('encounters.json');
    const encounters = data.encounters[environment]?.[difficulty] || [];
    
    if (encounters.length === 0) {
      return { error: `No encounters found for ${environment} / ${difficulty}` };
    }
    
    const encounter = encounters[Math.floor(Math.random() * encounters.length)];
    return {
      environment,
      difficulty,
      partyLevel: level,
      ...encounter
    };
  },

  async generate_npc_name({ race, gender }) {
    const data = await fetchData('names.json');
    const names = data.names[race]?.[gender] || [];
    
    if (names.length === 0) {
      return { error: `No names found for ${race} / ${gender}` };
    }
    
    const name = names[Math.floor(Math.random() * names.length)];
    return { name, race, gender };
  },

  async generate_location_name({ type }) {
    const data = await fetchData('locations.json');
    const location = data.locations[type];
    
    if (!location) {
      return { error: `No location type found: ${type}` };
    }
    
    const prefix = location.prefixes[Math.floor(Math.random() * location.prefixes.length)];
    const suffix = location.suffixes[Math.floor(Math.random() * location.suffixes.length)];
    
    return {
      name: `${prefix} ${suffix}`,
      type
    };
  },

  async generate_personality({ count = 4 }) {
    const data = await fetchData('traits.json');
    const allTraits = [
      ...data.traits,
      ...data.ideals,
      ...data.bonds,
      ...data.flaws,
      ...data.quirks
    ];
    
    const selected = [];
    for (let i = 0; i < Math.min(count, allTraits.length); i++) {
      const trait = allTraits[Math.floor(Math.random() * allTraits.length)];
      if (!selected.includes(trait)) {
        selected.push(trait);
      }
    }
    
    return { traits: selected };
  },

  async generate_treasure({ cr, type = 'individual' }) {
    const data = await fetchData('treasure.json');
    
    // Determine CR range
    let crRange = 'cr0-4';
    if (cr >= 17) crRange = 'cr17+';
    else if (cr >= 11) crRange = 'cr11-16';
    else if (cr >= 5) crRange = 'cr5-10';
    
    const treasureData = data.treasure[type][crRange];
    const items = data.treasure.items;
    
    // Generate coins
    const coins = {};
    if (treasureData) {
      for (const [coinType, diceData] of Object.entries(treasureData)) {
        if (coinType !== 'items') {
          // Simple dice roller simulation
          const rolls = diceData.dice.split('d');
          const numDice = parseInt(rolls[0]);
          const diceSize = parseInt(rolls[1]);
          let total = 0;
          for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * diceSize) + 1;
          }
          coins[coinType] = total * diceData.multiplier;
        }
      }
    }
    
    // Add random items for hoard type
    const treasureItems = [];
    if (type === 'hoard' && cr >= 5) {
      const itemPool = cr >= 11 ? items.magic_major : items.magic_medium;
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numItems; i++) {
        treasureItems.push(itemPool[Math.floor(Math.random() * itemPool.length)]);
      }
    }
    
    return {
      challengeRating: cr,
      type,
      coins,
      items: treasureItems
    };
  },

  async generate_weather({ climate, season }) {
    const data = await fetchData('weather.json');
    const weatherOptions = season && data.weather[climate]?.[season] 
      ? data.weather[climate][season]
      : data.weather[climate]?.any || [];
    
    if (weatherOptions.length === 0) {
      return { error: `No weather found for ${climate} / ${season}` };
    }
    
    const description = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    return { climate, season, description };
  },

  async generate_plot_hook({ theme, level }) {
    const data = await fetchData('plot_hooks.json');
    const hooks = data.plot_hooks[theme] || [];
    
    if (hooks.length === 0) {
      return { error: `No plot hooks found for theme: ${theme}` };
    }
    
    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    return {
      theme,
      suggestedLevel: level,
      hook
    };
  }
};

// MCP Protocol Handler
async function handleMCPRequest(request) {
  const { method, params } = await request.json();
  
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'ttrpg-gm-tools',
          version: '1.0.0'
        }
      };
    
    case 'tools/list':
      return {
        tools: [
          {
            name: 'generate_encounter',
            description: 'Generate a random encounter for a TTRPG session',
            inputSchema: {
              type: 'object',
              properties: {
                level: { type: 'integer', minimum: 1, maximum: 20 },
                environment: { type: 'string', enum: ['forest', 'dungeon', 'city', 'mountain', 'swamp'] },
                difficulty: { type: 'string', enum: ['easy', 'medium', 'hard', 'deadly'], default: 'medium' }
              },
              required: ['level', 'environment']
            }
          },
          {
            name: 'generate_npc_name',
            description: 'Generate an NPC name for a fantasy character',
            inputSchema: {
              type: 'object',
              properties: {
                race: { type: 'string', enum: ['human', 'elf', 'dwarf', 'halfling', 'gnome', 'half-elf', 'half-orc', 'tiefling', 'dragonborn', 'orc', 'goblin'] },
                gender: { type: 'string', enum: ['male', 'female'] }
              },
              required: ['race', 'gender']
            }
          },
          {
            name: 'generate_location_name',
            description: 'Generate a name for a location',
            inputSchema: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['tavern', 'inn', 'city', 'town', 'village', 'dungeon', 'castle', 'shop', 'guild', 'temple'] }
              },
              required: ['type']
            }
          },
          {
            name: 'generate_personality',
            description: 'Generate personality traits for an NPC',
            inputSchema: {
              type: 'object',
              properties: {
                count: { type: 'integer', minimum: 1, maximum: 10, default: 4 }
              }
            }
          },
          {
            name: 'generate_treasure',
            description: 'Generate treasure based on challenge rating',
            inputSchema: {
              type: 'object',
              properties: {
                cr: { type: 'integer', minimum: 0, maximum: 30 },
                type: { type: 'string', enum: ['individual', 'hoard'], default: 'individual' }
              },
              required: ['cr']
            }
          },
          {
            name: 'generate_weather',
            description: 'Generate weather conditions',
            inputSchema: {
              type: 'object',
              properties: {
                climate: { type: 'string', enum: ['temperate', 'arctic', 'tropical', 'desert', 'mountain'] },
                season: { type: 'string', enum: ['spring', 'summer', 'autumn', 'winter'] }
              },
              required: ['climate']
            }
          },
          {
            name: 'generate_plot_hook',
            description: 'Generate adventure hooks and quest ideas',
            inputSchema: {
              type: 'object',
              properties: {
                theme: { type: 'string', enum: ['mystery', 'combat', 'intrigue', 'exploration', 'horror', 'comedy', 'romance', 'rescue'] },
                level: { type: 'integer', minimum: 1, maximum: 20 }
              },
              required: ['theme']
            }
          }
        ]
      };
    
    case 'tools/call':
      const { name, arguments: args } = params;
      if (tools[name]) {
        try {
          const result = await tools[name](args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: error.message }, null, 2)
              }
            ],
            isError: true
          };
        }
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: `Unknown tool: ${name}` }, null, 2)
          }
        ],
        isError: true
      };
    
    default:
      return { error: `Unknown method: ${method}` };
  }
}

// Main Worker Handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Handle MCP requests
    if (url.pathname === '/mcp' && request.method === 'POST') {
      try {
        const result = await handleMCPRequest(request);
        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }
    
    // Redirect root to GitHub Pages
    return Response.redirect('https://ttrpg-mcp.tedt.org/', 302);
  }
};
