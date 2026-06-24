import { Link, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-shell">
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>BananaShopPro</span>
        <Link to="/impressum">Impressum</Link>
        <span>Reduzierter Demo-Shop</span>
      </footer>
    </div>
  );
}
