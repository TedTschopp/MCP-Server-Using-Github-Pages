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
    // Normalize inputs to lowercase for lookup
    const normalizedEnv = environment?.toLowerCase();
    const normalizedDiff = difficulty?.toLowerCase();
    const encounters = data.encounters[normalizedEnv]?.[normalizedDiff] || [];
    
    if (encounters.length === 0) {
      return { error: `No encounters found for ${environment} / ${difficulty}` };
    }
    
    const encounter = encounters[Math.floor(Math.random() * encounters.length)];
    return {
      environment: normalizedEnv,
      difficulty: normalizedDiff,
      partyLevel: level,
      ...encounter
    };
  },

  async generate_npc_name({ race, gender }) {
    const data = await fetchData('names.json');
    // Normalize inputs to lowercase for lookup
    const normalizedRace = race?.toLowerCase();
    const normalizedGender = gender?.toLowerCase();
    const names = data.names[normalizedRace]?.[normalizedGender] || [];
    
    if (names.length === 0) {
      return { error: `No names found for ${race} / ${gender}` };
    }
    
    const name = names[Math.floor(Math.random() * names.length)];
    return { name, race: normalizedRace, gender: normalizedGender };
  },

  async generate_location_name({ type }) {
    const data = await fetchData('locations.json');
    // Normalize type to lowercase for lookup
    const normalizedType = type?.toLowerCase();
    const location = data.locations[normalizedType];
    
    if (!location) {
      return { error: `No location type found: ${type}` };
    }
    
    const prefix = location.prefixes[Math.floor(Math.random() * location.prefixes.length)];
    const suffix = location.suffixes[Math.floor(Math.random() * location.suffixes.length)];
    
    return {
      name: `${prefix} ${suffix}`,
      type: normalizedType
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
    const normalizedType = type?.toLowerCase();
    if (normalizedType === 'hoard' && cr >= 5) {
      const itemPool = cr >= 11 ? items.magic_major : items.magic_medium;
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numItems; i++) {
        treasureItems.push(itemPool[Math.floor(Math.random() * itemPool.length)]);
      }
    }
    
    return {
      challengeRating: cr,
      type: normalizedType,
      coins,
      items: treasureItems
    };
  },

  async generate_weather({ climate, season }) {
    const data = await fetchData('weather.json');
    // Normalize inputs to lowercase for lookup
    const normalizedClimate = climate?.toLowerCase();
    const normalizedSeason = season?.toLowerCase();
    const weatherOptions = normalizedSeason && data.weather[normalizedClimate]?.[normalizedSeason] 
      ? data.weather[normalizedClimate][normalizedSeason]
      : data.weather[normalizedClimate]?.any || [];
    
    if (weatherOptions.length === 0) {
      return { error: `No weather found for ${climate} / ${season}` };
    }
    
    const description = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    return { climate: normalizedClimate, season: normalizedSeason, description };
  },

  async generate_plot_hook({ theme, level }) {
    const data = await fetchData('plot_hooks.json');
    // Normalize theme to lowercase for lookup
    const normalizedTheme = theme?.toLowerCase();
    const hooks = data.plot_hooks[normalizedTheme] || [];
    
    if (hooks.length === 0) {
      return { error: `No plot hooks found for theme: ${theme}` };
    }
    
    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    return {
      theme: normalizedTheme,
      suggestedLevel: level,
      hook
    };
  }
};

// MCP Protocol Handler
async function handleMCPRequest(request) {
  const body = await request.json();
  const { jsonrpc, id, method, params } = body;
  
  // Helper to create JSON-RPC response
  const createResponse = (result) => ({
    jsonrpc: '2.0',
    id: id,
    result: result
  });
  
  const createError = (code, message) => ({
    jsonrpc: '2.0',
    id: id,
    error: { code, message }
  });
  
  switch (method) {
    case 'initialize':
      return createResponse({
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        },
        serverInfo: {
          name: 'ttrpg-gm-tools',
          version: '1.0.0'
        },
        instructions: `TTRPG GM Tools MCP Server\n\nThis server provides procedural generation utilities and reference data for tabletop RPG session prep.\n\nAvailable Features:\n- Tools: Generate encounters, NPC names, location names, personality traits, treasure, weather, and plot hooks.\n- Resources: Read underlying JSON datasets (encounters, names, locations, traits, treasure, weather, plot hooks).\n- Prompts: High-level prompt templates (session_prep, quick_npc, dungeon_room).\n\nUsage Guidelines:\n1. List tools with 'tools/list' then call via 'tools/call' with required arguments. Input matching is case-insensitive (values are normalized).\n2. Use 'resources/read' to inspect raw datasets for context or custom logic.\n3. Prompts provide structured starting points—fetch with 'prompts/get' then expand.\n4. Randomness: Each generator selects uniformly from the relevant pool; treasure uses simple dice simulation.\n5. Error Handling: If a combination has no data (e.g., unsupported environment/difficulty), you'll receive an error object instead of content.\n\nRecommended Workflow Example:\n- Call tools/list\n- Call tools/call generate_encounter { level: 5, environment: 'forest', difficulty: 'medium' }\n- Call tools/call generate_npc_name { race: 'elf', gender: 'female' }\n- Call prompts/get session_prep { party_level: 5, session_theme: 'mystery' }\n\nNotes:\n- Data is sourced live from GitHub Pages (https://ttrpg-mcp.tedt.org/data).\n- Transport is stateless HTTP JSON-RPC 2.0.\n- Extend by adding new tool functions and updating tools/list schema.\n\nHave fun and may your dice roll high!`
      });
    
    case 'tools/list':
      return createResponse({
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
      });
    
    case 'resources/list':
      return createResponse({
        resources: [
          {
            uri: 'ttrpg://data/encounters',
            name: 'Encounter Database',
            description: 'Complete database of random encounters organized by environment and difficulty',
            mimeType: 'application/json'
          },
          {
            uri: 'ttrpg://data/names',
            name: 'Name Database',
            description: 'Fantasy name lists organized by race and gender',
            mimeType: 'application/json'
          },
          {
            uri: 'ttrpg://data/locations',
            name: 'Location Names',
            description: 'Location name components and templates',
            mimeType: 'application/json'
          },
          {
            uri: 'ttrpg://data/traits',
            name: 'Personality Traits',
            description: 'Personality traits, ideals, bonds, and flaws for NPCs',
            mimeType: 'application/json'
          },
          {
            uri: 'ttrpg://data/treasure',
            name: 'Treasure Tables',
            description: 'Treasure and loot tables by challenge rating',
            mimeType: 'application/json'
          },
          {
            uri: 'ttrpg://data/weather',
            name: 'Weather Descriptions',
            description: 'Weather conditions by climate and season',
            mimeType: 'application/json'
          },
          {
            uri: 'ttrpg://data/plot-hooks',
            name: 'Plot Hooks',
            description: 'Adventure hooks and quest ideas by theme',
            mimeType: 'application/json'
          }
        ]
      });
    
    case 'resources/read':
      const resourceUri = params.uri;
      const resourceMap = {
        'ttrpg://data/encounters': 'encounters.json',
        'ttrpg://data/names': 'names.json',
        'ttrpg://data/locations': 'locations.json',
        'ttrpg://data/traits': 'traits.json',
        'ttrpg://data/treasure': 'treasure.json',
        'ttrpg://data/weather': 'weather.json',
        'ttrpg://data/plot-hooks': 'plot_hooks.json'
      };
      
      const filename = resourceMap[resourceUri];
      if (!filename) {
        return createError(-32602, `Unknown resource URI: ${resourceUri}`);
      }
      
      try {
        const data = await fetchData(filename);
        return createResponse({
          contents: [
            {
              uri: resourceUri,
              mimeType: 'application/json',
              text: JSON.stringify(data, null, 2)
            }
          ]
        });
      } catch (error) {
        return createError(-32603, `Failed to read resource: ${error.message}`);
      }
    
    case 'prompts/list':
      return createResponse({
        prompts: [
          {
            name: 'session_prep',
            description: 'Prepare a complete game session with encounters, NPCs, and plot hooks',
            arguments: [
              {
                name: 'party_level',
                description: 'Average party level',
                required: true
              },
              {
                name: 'session_theme',
                description: 'Theme or focus of the session',
                required: true
              }
            ]
          },
          {
            name: 'quick_npc',
            description: 'Generate a complete NPC with name, personality, and background',
            arguments: [
              {
                name: 'role',
                description: "NPC's role (merchant, guard, villain, ally, etc.)",
                required: true
              }
            ]
          },
          {
            name: 'dungeon_room',
            description: 'Generate a dungeon room with encounter, treasure, and description',
            arguments: [
              {
                name: 'party_level',
                description: 'Average party level',
                required: true
              },
              {
                name: 'difficulty',
                description: 'Room difficulty',
                required: false
              }
            ]
          }
        ]
      });
    
    case 'prompts/get':
      const promptName = params.name;
      const promptArgs = params.arguments || {};
      
      if (promptName === 'session_prep') {
        const { party_level, session_theme } = promptArgs;
        return createResponse({
          description: `Session preparation for level ${party_level} party with ${session_theme} theme`,
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Create a complete game session for a level ${party_level} party with a ${session_theme} theme. Include: 1) A main encounter appropriate for the party level, 2) 2-3 NPCs they might meet, 3) A plot hook to drive the session, 4) Potential treasure rewards, 5) Weather/atmosphere description.`
              }
            }
          ]
        });
      } else if (promptName === 'quick_npc') {
        const { role } = promptArgs;
        return createResponse({
          description: `Generate a complete ${role} NPC`,
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Create a detailed ${role} NPC including: 1) A fantasy name (choose appropriate race/gender), 2) 2-3 personality traits, 3) A brief backstory (2-3 sentences), 4) What they want from the party, 5) A unique quirk or mannerism.`
              }
            }
          ]
        });
      } else if (promptName === 'dungeon_room') {
        const { party_level, difficulty = 'medium' } = promptArgs;
        return createResponse({
          description: `Generate a dungeon room for level ${party_level} party at ${difficulty} difficulty`,
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Create a dungeon room for a level ${party_level} party at ${difficulty} difficulty. Include: 1) Room description and atmosphere, 2) An encounter in the room (if any), 3) Treasure or rewards, 4) Potential hazards or traps, 5) Clues or secrets players might discover.`
              }
            }
          ]
        });
      } else {
        return createError(-32602, `Unknown prompt: ${promptName}`);
      }
    
    case 'tools/call':
      const { name, arguments: args } = params;
      if (tools[name]) {
        try {
          const result = await tools[name](args);
          return createResponse({
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          });
        } catch (error) {
          return createResponse({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: error.message }, null, 2)
              }
            ],
            isError: true
          });
        }
      }
      return createError(-32601, `Unknown tool: ${name}`);
    
    default:
      return createError(-32601, `Unknown method: ${method}`);
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
