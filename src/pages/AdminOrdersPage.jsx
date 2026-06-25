import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency, formatDate } from '../lib/format';
import { useAuth } from '../components/AuthProvider.jsx';

const statusOptions = [
  ['paid', 'Bezahlt'],
  ['processing', 'In Bearbeitung'],
  ['shipped', 'Versendet'],
  ['cancelled', 'Storniert']
];

export default function AdminOrdersPage() {
  const { isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  async function loadOrders() {
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    setOrders(data || []);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(orderId, status) {
    setMessage('Status wird gespeichert...');
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) { setMessage('Fehler: ' + error.message); return; }
    setMessage('Status wurde aktualisiert.');
    loadOrders();
  }

  if (!loading && !isAdmin) return <Navigate to="/" replace />;

  return (
    <section>
      <h1>Alle Bestellungen</h1>
      {message && <p className="notice">{message}</p>}
      {orders.length === 0 && <p>Keine Bestellungen vorhanden.</p>}
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <h2>{formatDate(order.created_at)}</h2>
          <p><b>Kunde:</b> {order.customer_name ? order.customer_name + ' · ' : ''}{order.customer_email}</p>
          {order.delivery_address && <p><b>Lieferadresse:</b><br />{order.delivery_address}</p>}
          <label className="field-label">
            Status
            <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}>
              {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <ul>{order.order_items?.map((item) => <li key={item.id}>{item.quantity} × {item.product_name}</li>)}</ul>
          <b>{formatCurrency(order.total)}</b>
        </article>
      ))}
    </section>
  );
}
