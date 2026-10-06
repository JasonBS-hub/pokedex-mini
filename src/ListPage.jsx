import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "./config";
import { capitalize } from "./utils";
import SearchForm from "./SearchForm";

const TYPES = ["All", "Grass", "Fire", "Water", "Bug", "Electric"];

export default function ListPage() {
  const [pokemons, setPokemons] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        let results = [];
        if (activeFilter === "All") {
          const res = await fetch(`${API_BASE_URL}/pokemon?limit=21`);
          const data = await res.json();
          results = data.results;
        } else {
          const res = await fetch(`${API_BASE_URL}/type/${activeFilter.toLowerCase()}`);
          const data = await res.json();
          // Extract first 21 pokemon from the type endpoint
          results = data.pokemon.slice(0, 21).map(p => p.pokemon);
        }

        // Fetch details for each to get types and sprites
        const detailedData = await Promise.all(
          results.map(async (p) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );
        setPokemons(detailedData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [activeFilter]);

  return (
    <div>
      <SearchForm />
      
      <div className="filter-container">
        {TYPES.map(type => (
          <button 
            key={type} 
            className={`filter-btn ${activeFilter === type ? 'active' : ''}`}
            onClick={() => setActiveFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {isLoading ? <p style={{textAlign: 'center'}}>Loading...</p> : (
        <div className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <Link to={`/pokemon/${pokemon.name}`} className="card" key={pokemon.id}>
              <div className="card-info">
                <div>
                  {pokemon.types.map(t => (
                    <span key={t.type.name} className="type-badge" style={{background: t.type.name === 'grass' ? '#dcfce7' : t.type.name === 'poison' ? '#f3e8ff' : '#f1f5f9'}}>
                      {t.type.name}
                    </span>
                  ))}
                </div>
                <h3 className="card-title">{pokemon.name}</h3>
                <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>A strange seed was planted on its back at birth...</p>
                <span className="know-more">Know More</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <span className="card-id">#{String(pokemon.id).padStart(3, '0')}</span>
                <img 
                  src={pokemon.sprites.front_default} 
                  alt={pokemon.name} 
                  style={{width: '96px', marginTop: 'auto', imageRendering: 'pixelated'}} 
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}