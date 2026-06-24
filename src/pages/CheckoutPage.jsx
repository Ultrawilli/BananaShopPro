import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../lib/format';
import { useAuth } from '../components/AuthProvider.jsx';
import { useCart } from '../components/CartProvider.jsx';
import { useState } from 'react';

export default function CheckoutPage() {
  const { user } = useAuth();
  const cart = useCart();
  const [status, setStatus] = useState('');

  async function buy() {
    if (!user) return;
    setStatus('Bestellung wird gespeichert...');
    const orderItems = cart.items.map((item) => ({ product_id: item.product_id, quantity: item.quantity }));
    const { data, error } = await supabase.rpc('create_order', { items: orderItems });
    if (error) { setStatus('Fehler: ' + error.message); return; }
    cart.clear();
    setStatus('Bestellung abgeschlossen. Nummer: ' + data);
  }

  if (!user) {
    return <section className="panel"><h1>Anmeldung erforderlich</h1><p>Für den Kauf bitte einloggen.</p><Link className="button" to="/login">Login</Link></section>;
  }

  return (
    <section className="panel">
      <h1>Kasse</h1>
      <p>Gesamtsumme: <b>{formatCurrency(cart.total)}</b></p>
      <button className="button" disabled={cart.items.length === 0} onClick={buy}>Bestellung abschließen</button>
      {status && <p className="notice">{status}</p>}
    </section>
  );
}
