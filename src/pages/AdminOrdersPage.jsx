import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency, formatDate } from '../lib/format';
import { useAuth } from '../components/AuthProvider.jsx';

export default function AdminOrdersPage() {
  const { isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).then(({ data }) => setOrders(data || []));
  }, []);

  if (!loading && !isAdmin) return <Navigate to="/" replace />;

  return (
    <section>
      <h1>Alle Bestellungen</h1>
      {orders.length === 0 && <p>Keine Bestellungen vorhanden.</p>}
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <h2>{formatDate(order.created_at)}</h2>
          <p>{order.customer_email}</p>
          <ul>{order.order_items?.map((item) => <li key={item.id}>{item.quantity} × {item.product_name}</li>)}</ul>
          <b>{formatCurrency(order.total)}</b>
        </article>
      ))}
    </section>
  );
}
