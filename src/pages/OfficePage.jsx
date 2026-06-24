import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../lib/format';

export default function OfficePage() {
  const [items, setItems] = useState([]);
  async function load() {
    const { data } = await supabase.from('products').select('*').order('name');
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);
  async function save(id, value) {
    await supabase.from('products').update({ stock: Number(value) }).eq('id', id);
    await load();
  }
  return <section><h1>Produktpflege</h1>{items.map((p) => <div className="admin-row" key={p.id}><span>{p.name}</span><b>{formatCurrency(p.price)}</b><input type="number" defaultValue={p.stock} onBlur={(e) => save(p.id, e.target.value)} /></div>)}</section>;
}
