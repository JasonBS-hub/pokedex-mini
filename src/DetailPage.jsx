import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "./config";
import { capitalize, formatStatName, getStatColor, parseEvolutionChain } from "./utils";

export default function DetailPage() {
  const { name } = useParams();
  const [data, setData] = useState({ pokemon: null, evos: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    async function loadAll() {
      setIsLoading(true);
      try {
        // 1. Fetch base pokemon data
        const pokeRes = await fetch(`${API_BASE_URL}/pokemon/${name}`);
        const pokemon = await pokeRes.json();
        
        // 2. Fetch species data to get evolution chain URL
        const speciesRes = await fetch(pokemon.species.url);
        const species = await speciesRes.json();

        // 3. Fetch evolution chain
        const evoRes = await fetch(species.evolution_chain.url);
        const evoData = await evoRes.json();
        const evoNames = parseEvolutionChain(evoData.chain);

        // 4. Fetch sprites for the evolution chain
        const evos = await Promise.all(
          evoNames.map(async (evoName) => {
            const res = await fetch(`${API_BASE_URL}/pokemon/${evoName}`);
            const data = await res.json();
            return { name: data.name, sprite: data.sprites.front_default };
          })
        );

        if (isCurrent) setData({ pokemon, evos });
      } catch (err) {
        console.error(err);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }
    loadAll();
    return () => { isCurrent = false; };
  }, [name]);

  if (isLoading) return <p style={{textAlign: 'center'}}>Loading details...</p>;
  const { pokemon, evos } = data;

  return (
    <div>
      <Link to="/" style={{display: 'inline-block', marginBottom: '1rem', color: 'var(--text-muted)', textDecoration: 'none'}}>← Back</Link>
      
      <div className="detail-container">
        {/* Left Side: Large Image */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img 
            src={pokemon.sprites.other?.showdown?.front_default || pokemon.sprites.front_default} 
            alt={pokemon.name} 
            className="detail-image"
          />
        </div>

        {/* Right Side: Details */}
        <div>
          <span style={{color: 'var(--text-muted)', fontWeight: '700'}}>#{String(pokemon.id).padStart(3, '0')}</span>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
            <h2 style={{fontSize: '2.5rem', textTransform: 'capitalize', fontWeight: '800'}}>{pokemon.name}</h2>
            {pokemon.cries?.latest && (
              <button onClick={() => new Audio(pokemon.cries.latest).play()} style={{background:'transparent', border:'none', cursor:'pointer', fontSize:'1.5rem'}}>
                🔊
              </button>
            )}
          </div>

          <div style={{marginBottom: '1rem'}}>
            {pokemon.types.map(t => (
              <span key={t.type.name} className="type-badge">{t.type.name}</span>
            ))}
          </div>

          <div style={{display: 'flex', gap: '2rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem'}}>
            <p>Height <span style={{fontWeight: '400', marginLeft: '0.5rem'}}>{pokemon.height / 10}m</span></p>
            <p>Weight <span style={{fontWeight: '400', marginLeft: '0.5rem'}}>{pokemon.weight / 10}kg</span></p>
          </div>

          <h3 style={{fontSize: '1rem', marginBottom: '0.5rem'}}>Stats</h3>
          <div className="stats-grid">
            {pokemon.stats.map(s => (
              <div key={s.stat.name} className="stat-pill" style={{background: getStatColor(s.stat.name)}}>
                <span>{formatStatName(s.stat.name)}</span>
                <span>{s.base_stat}</span>
              </div>
            ))}
          </div>

          <h3 style={{fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem'}}>Abilities</h3>
          <div className="abilities">
            {pokemon.abilities.map(a => (
              <span key={a.ability.name} className="ability-badge" style={{textTransform: 'capitalize'}}>{a.ability.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution Chain Section */}
      <div className="evolution-section">
        <h3 style={{fontSize: '1.5rem'}}>Evolution</h3>
        <div className="evolution-row">
          {evos.map((evo, index) => (
            <div key={evo.name} style={{display: 'flex', alignItems: 'center'}}>
              <Link to={`/pokemon/${evo.name}`} className="evo-item">
                <img src={evo.sprite} alt={evo.name} />
              </Link>
              {index < evos.length - 1 && <span style={{margin: '0 1rem', fontSize: '1.5rem'}}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}