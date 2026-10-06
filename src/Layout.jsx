import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-container">
      <header>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="logo">PokéDex</div>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}