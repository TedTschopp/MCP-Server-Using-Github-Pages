---
layout: default
title: Interactive Demo
---

<style>
    .tool-section {
        margin: 20px 0;
        padding: 20px;
        background: #ecf0f1;
        border-radius: 5px;
    }
    button {
        background: #3498db;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin: 5px 0;
    }
    button:hover {
        background: #2980b9;
    }
    .result {
        margin-top: 15px;
        padding: 15px;
        background: white;
        border-left: 4px solid #3498db;
        border-radius: 3px;
    }
    select, input {
        padding: 8px;
        margin: 5px;
        border: 1px solid #bdc3c7;
        border-radius: 3px;
    }
    .error {
        background: #e74c3c;
        color: white;
        padding: 10px;
        border-radius: 3px;
        margin: 10px 0;
    }
</style>

# 🎲 Interactive Demo

This page demonstrates how the TTRPG data can be used directly in a web browser using JavaScript.

<div class="tool-section">
    <h2>Generate NPC Name</h2>
    <select id="race">
        <option value="human">Human</option>
        <option value="elf">Elf</option>
        <option value="dwarf">Dwarf</option>
        <option value="halfling">Halfling</option>
        <option value="orc">Orc</option>
        <option value="goblin">Goblin</option>
    </select>
    <select id="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
    </select>
    <button onclick="generateName()">Generate Name</button>
    <div id="nameResult" class="result" style="display:none;"></div>
</div>

<div class="tool-section">
    <h2>Generate Location Name</h2>
    <select id="locationType">
        <option value="tavern">Tavern</option>
        <option value="city">City</option>
        <option value="dungeon">Dungeon</option>
        <option value="castle">Castle</option>
        <option value="inn">Inn</option>
        <option value="town">Town</option>
        <option value="village">Village</option>
    </select>
    <button onclick="generateLocation()">Generate Location</button>
    <div id="locationResult" class="result" style="display:none;"></div>
</div>

<div class="tool-section">
    <h2>Generate Personality Trait</h2>
    <button onclick="generateTrait()">Generate Trait</button>
    <div id="traitResult" class="result" style="display:none;"></div>
</div>

<div class="tool-section">
    <h2>Generate Plot Hook</h2>
    <select id="theme">
        <option value="mystery">Mystery</option>
        <option value="combat">Combat</option>
        <option value="intrigue">Intrigue</option>
        <option value="exploration">Exploration</option>
        <option value="horror">Horror</option>
    </select>
    <button onclick="generatePlotHook()">Generate Hook</button>
    <div id="hookResult" class="result" style="display:none;"></div>
</div>

<div class="tool-section">
    <h2>Generate Weather</h2>
    <select id="climate">
        <option value="temperate">Temperate</option>
        <option value="arctic">Arctic</option>
        <option value="tropical">Tropical</option>
        <option value="desert">Desert</option>
        <option value="mountain">Mountain</option>
    </select>
    <button onclick="generateWeather()">Generate Weather</button>
    <div id="weatherResult" class="result" style="display:none;"></div>
</div>

<script>
    const BASE_URL = 'https://ttrpg-mcp.tedt.org/data';
    
    async function loadData(filename) {
        try {
            const response = await fetch(`${BASE_URL}/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            throw error;
        }
    }

    async function generateName() {
        const race = document.getElementById('race').value;
        const gender = document.getElementById('gender').value;
        const resultDiv = document.getElementById('nameResult');
        
        try {
            const data = await loadData('names.json');
            const names = data.names[race][gender];
            const randomName = names[Math.floor(Math.random() * names.length)];
            
            resultDiv.innerHTML = `<strong>${randomName}</strong> (${race} ${gender})`;
            resultDiv.style.display = 'block';
            resultDiv.className = 'result';
        } catch (error) {
            resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
            resultDiv.style.display = 'block';
        }
    }

    async function generateLocation() {
        const type = document.getElementById('locationType').value;
        const resultDiv = document.getElementById('locationResult');
        
        try {
            const data = await loadData('locations.json');
            const prefixes = data.locations[type].prefixes;
            const suffixes = data.locations[type].suffixes;
            
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            const locationName = `${prefix} ${suffix}`;
            
            resultDiv.innerHTML = `<strong>${locationName}</strong>`;
            resultDiv.style.display = 'block';
            resultDiv.className = 'result';
        } catch (error) {
            resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
            resultDiv.style.display = 'block';
        }
    }

    async function generateTrait() {
        const resultDiv = document.getElementById('traitResult');
        
        try {
            const data = await loadData('traits.json');
            const allTraits = [
                ...data.traits,
                ...data.ideals,
                ...data.bonds,
                ...data.flaws,
                ...data.quirks
            ];
            
            const randomTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
            
            resultDiv.innerHTML = `<strong>${randomTrait}</strong>`;
            resultDiv.style.display = 'block';
            resultDiv.className = 'result';
        } catch (error) {
            resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
            resultDiv.style.display = 'block';
        }
    }

    async function generatePlotHook() {
        const theme = document.getElementById('theme').value;
        const resultDiv = document.getElementById('hookResult');
        
        try {
            const data = await loadData('plot_hooks.json');
            const hooks = data.plot_hooks[theme];
            const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
            
            resultDiv.innerHTML = `<strong>${randomHook}</strong>`;
            resultDiv.style.display = 'block';
            resultDiv.className = 'result';
        } catch (error) {
            resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
            resultDiv.style.display = 'block';
        }
    }

    async function generateWeather() {
        const climate = document.getElementById('climate').value;
        const resultDiv = document.getElementById('weatherResult');
        
        try {
            const data = await loadData('weather.json');
            const conditions = data.weather[climate];
            const randomWeather = conditions[Math.floor(Math.random() * conditions.length)];
            
            resultDiv.innerHTML = `<strong>${randomWeather}</strong>`;
            resultDiv.style.display = 'block';
            resultDiv.className = 'result';
        } catch (error) {
            resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
            resultDiv.style.display = 'block';
        }
    }
</script>

---

## How It Works

This demo page loads data directly from the GitHub Pages `/data/` directory using simple JavaScript fetch calls. Each button:

1. Fetches the relevant JSON file from `https://ttrpg-mcp.tedt.org/data/`
2. Randomly selects an appropriate item from the data
3. Displays the result

This is the same data that the MCP server uses, demonstrating how the hybrid architecture works:
- **MCP Server** (Cloudflare Worker): Provides structured tool access via JSON-RPC
- **GitHub Pages**: Hosts the data files publicly for direct access
