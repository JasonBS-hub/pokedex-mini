// src/utils.js
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

// Recursively parse the evolution chain into a flat array of names
export function parseEvolutionChain(chain) {
  const evolutions = [];
  let current = chain;
  while (current) {
    evolutions.push(current.species.name);
    current = current.evolves_to[0]; 
  }
  return evolutions;
}

// Map stats to the exact colors from the mockup
export function getStatColor(statName) {
  const colors = {
    hp: '#ef4444', // Red
    attack: '#f97316', // Orange
    defense: '#eab308', // Yellow
    'special-attack': '#3b82f6', // Blue
    'special-defense': '#22c55e', // Green
    speed: '#f43f5e' // Pink
  };
  return colors[statName] || '#94a3b8';
}

export function formatStatName(name) {
  const map = {
    'special-attack': 'SpA',
    'special-defense': 'SpD',
    'attack': 'ATK',
    'defense': 'DEF',
    'speed': 'SPD',
    'hp': 'HP'
  };
  return map[name] || name.toUpperCase();
}