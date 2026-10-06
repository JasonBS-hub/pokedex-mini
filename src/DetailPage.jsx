import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "./config";
import { capitalize } from "./utils";

export default function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true; // Race condition cleanup flag[cite: 107]

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
        if (!response.ok) {
          throw new Error(`Could not find Pokémon "${name}". Check spelling.`);
        }
        const data = await response.json();
        if (isCurrent) {
          setPokemon(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      isCurrent = false; // Discards stale fetches[cite: 107]
    };
  }, [name]);

  if (isLoading) return <p style={{ color: "var(--text-muted)" }}>Loading details...</p>;
  if (error) return (
    <div>
      <p style={{ color: "#f87171", marginBottom: "1rem" }}>{error}</p>
      <Link to="/" className="back-link">← Back to list</Link>
    </div>
  );

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem" }}>
      <Link to="/" className="back-link">← Back to list</Link>

      {pokemon && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <img
              src={pokemon.sprites.other?.["official-artwork"]?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              width="96"
              height="96"
            />
            <div>
              <h2 style={{ fontSize: "1.5rem", textTransform: "capitalize" }}>{pokemon.name}</h2>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                {pokemon.types.map((t) => (
                  <span key={t.type.name} className="badge">
                    {capitalize(t.type.name)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Base Stats</h3>
          {pokemon.stats.map((s) => (
            <div key={s.stat.name} className="stat-row">
              <span style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>{s.stat.name}</span>
              <span style={{ fontWeight: "600" }}>{s.base_stat}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}