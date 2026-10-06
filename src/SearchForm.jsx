import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault(); // Stop full-page reload[cite: 91]
    const name = query.trim().toLowerCase(); // Sanitize input[cite: 92]
    
    if (name === "") {
      setError("Please enter a Pokémon name.");
      return;
    }
    
    setError(null);
    navigate(`/pokemon/${name}`); // Navigate directly to detail route[cite: 101]
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name (e.g., pikachu)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {error && <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}
    </div>
  );
}