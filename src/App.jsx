import { Outlet } from 'react-router-dom';
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
        <span>Reduzierter Demo-Shop</span>
      </footer>
    </div>
  );
}
