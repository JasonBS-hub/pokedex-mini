import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-container">
      <header>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1>PokéDex <span>Mini</span></h1>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}