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
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const orderItems = cart.items.map((item) => ({ product_id: item.product_id, quantity: item.quantity }));

  async function buyAsUser() {
    setStatus('Bestellung wird gespeichert...');
    const { data, error } = await supabase.rpc('create_order', { items: orderItems });
    if (error) { setStatus('Fehler: ' + error.message); return; }
    cart.clear();
    setStatus('Bestellung abgeschlossen. Nummer: ' + data);
  }

  async function buyAsGuest(event) {
    event.preventDefault();
    setStatus('Gastbestellung wird gespeichert...');
    const { data, error } = await supabase.rpc('create_guest_order', {
      items: orderItems,
      guest_email: guestEmail,
      guest_name: guestName || 'Gast'
    });
    if (error) { setStatus('Fehler: ' + error.message); return; }
    cart.clear();
    setStatus('Gastbestellung abgeschlossen. Nummer: ' + data);
  }

  return (
    <section className="panel checkout-panel">
      <h1>Kasse</h1>
      <p>Gesamtsumme: <b>{formatCurrency(cart.total)}</b></p>

      {user ? (
        <>
          <p>Du bist angemeldet und kannst die Bestellung deinem Kundenkonto zuordnen.</p>
          <button className="button" disabled={cart.items.length === 0} onClick={buyAsUser}>Bestellung abschließen</button>
        </>
      ) : (
        <>
          <p>Du kannst dich anmelden oder die Bestellung als Gast abschließen.</p>
          <div className="button-row">
            <Link className="button ghost" to="/login">Einloggen</Link>
          </div>
          <form className="guest-form" onSubmit={buyAsGuest}>
            <label className="field-label">
              Name für die Bestellung
              <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Gast" />
            </label>
            <label className="field-label">
              E-Mail für die Bestellung
              <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="gast@example.test" required />
            </label>
            <button className="button" disabled={cart.items.length === 0}>Als Gast bestellen</button>
          </form>
        </>
      )}

      {status && <p className="notice">{status}</p>}
    </section>
  );
}
