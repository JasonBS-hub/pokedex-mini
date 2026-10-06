import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <h2>404 - Page Not Found</h2>
      <p style={{ color: "var(--text-muted)", margin: "1rem 0" }}>The Pokémon or route you are looking for does not exist.</p>
      <Link to="/" className="back-link">← Return to List</Link>
    </div>
  );
}