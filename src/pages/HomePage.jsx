import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../lib/format';
import { useCart } from '../components/CartProvider.jsx';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const { add } = useCart();

  useEffect(() => {
    supabase.from('products').select('*, categories(name, slug)').order('name').then(({ data }) => {
      setProducts(data || []);
    });
  }, []);

  const visible = products.filter((p) => {
    const text = (p.name + ' ' + p.description).toLowerCase();
    return p.active && text.includes(query.toLowerCase());
  });

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Hier bekommt wirklich jede Person die Banane, die sie verdient.</p>
        <h1>Eine Banane ist eine Banane ist eine Banane.</h1>
        <p>"Die Banane ist eine Hoffnung für viele und eine Notwendigkeit für uns alle." (Konrad Adenauer)</p>
      </section>
      <section className="filters">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Produkt suchen" />
      </section>
      <section className="product-grid">
        {visible.map((p) => (
          <article className="product-card" key={p.id}>
            <div className="product-image"><img src={p.image_url || '/images/banana-large.svg'} alt={p.name} /></div>
            <p className="category-label">{p.categories?.name}</p>
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <div className="product-meta"><b>{formatCurrency(p.price)}</b><span>{p.stock} verfügbar</span></div>
            <div className="button-row">
              <Link className="button ghost" to={'/product/' + p.id}>Ansehen</Link>
              <button className="button" onClick={() => add(p)}>Warenkorb</button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
