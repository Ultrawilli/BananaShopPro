import { Link } from 'react-router-dom';
import { useCart } from '../components/CartProvider.jsx';
import { formatCurrency } from '../lib/format';

export default function CartPage() {
  const cart = useCart();

  if (cart.items.length === 0) {
    return <section className="panel"><h1>Warenkorb</h1><p>Leer.</p><Link className="button" to="/">Shop</Link></section>;
  }

  return (
    <section>
      <h1>Warenkorb</h1>
      {cart.items.map((item) => (
        <div className="cart-row" key={item.product_id}>
          <span>{item.name}</span>
          <input type="number" min="1" max={item.stock} value={item.quantity} onChange={(e) => cart.update(item.product_id, e.target.value)} />
          <b>{formatCurrency(item.price * item.quantity)}</b>
          <button onClick={() => cart.remove(item.product_id)}>X</button>
        </div>
      ))}
      <div className="total-row"><span>Summe</span><b>{formatCurrency(cart.total)}</b></div>
      <Link className="button" to="/checkout">Kasse</Link>
    </section>
  );
}
