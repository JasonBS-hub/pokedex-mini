import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "./config";
import { capitalize, getIdFromUrl } from "./utils";
import SearchForm from "./SearchForm";

export default function ListPage() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPokemons() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=20`);
        if (!response.ok) {
          throw new Error(`Server status: ${response.status}`);
        }
        const data = await response.json();
        setPokemons(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadPokemons();
  }, []);

  return (
    <div>
      <SearchForm />
      {isLoading && <p style={{ color: "var(--text-muted)" }}>Loading Pokémon...</p>}
      {error && <p style={{ color: "#f87171" }}>Error: {error}</p>}
      
      {!isLoading && !error && (
        <ul className="pokemon-list">
          {pokemons.map((pokemon) => {
            const id = getIdFromUrl(pokemon.url);
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
            return (
              <li key={pokemon.name}>
                <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card">
                  <div className="pokemon-info">
                    <img src={spriteUrl} alt={pokemon.name} width="48" height="48" />
                    <span className="pokemon-name">{capitalize(pokemon.name)}</span>
                  </div>
                  <span className="badge">#{String(id).padStart(3, '0')}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}