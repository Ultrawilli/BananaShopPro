import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency, formatDate } from '../lib/format';
import { useAuth } from '../components/AuthProvider.jsx';

const statusLabels = {
  paid: 'Bezahlt',
  processing: 'In Bearbeitung',
  shipped: 'Versendet',
  cancelled: 'Storniert'
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).then(({ data }) => setOrders(data || []));
  }, [user]);

  if (!user) return <section className="panel"><h1>Login nötig</h1><Link className="button" to="/login">Login</Link></section>;

  return (
    <section>
      <h1>Historie</h1>
      {orders.length === 0 && <p>Noch keine Daten.</p>}
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <h2>{formatDate(order.created_at)}</h2>
          <p><b>Status:</b> {statusLabels[order.status] || order.status}</p>
          {order.delivery_address && <p><b>Lieferadresse:</b><br />{order.delivery_address}</p>}
          <ul>{order.order_items?.map((item) => <li key={item.id}>{item.quantity} × {item.product_name}</li>)}</ul>
          <b>{formatCurrency(order.total)}</b>
        </article>
      ))}
    </section>
  );
}
