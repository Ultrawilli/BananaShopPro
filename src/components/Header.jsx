import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.jsx';
import { useCart } from './CartProvider.jsx';

export default function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  async function logout() {
    await signOut();
    navigate('/');
  }

  return (
    <header className="site-header">
      <Link to="/" className="logo">
        <img className="shop-logo" src="/images/logo.png" alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
        <span>Banana Shop Pro</span>
      </Link>
      <nav className="main-nav">
        <NavLink to="/">Shop</NavLink>
        <NavLink to="/cart">Cart ({count})</NavLink>
        {user && <NavLink to="/orders">Orders</NavLink>}
        {isAdmin && <NavLink to="/admin/products">Admin</NavLink>}
        {isAdmin && <NavLink to="/admin/orders">All orders</NavLink>}
        {user ? <button onClick={logout}>Logout</button> : <NavLink to="/login">Login</NavLink>}
      </nav>
    </header>
  );
}
