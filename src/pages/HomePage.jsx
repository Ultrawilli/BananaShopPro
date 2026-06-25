import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../lib/format';
import { useCart } from '../components/CartProvider.jsx';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const { add } = useCart();

  useEffect(() => {
    supabase.from('products').select('*, categories(name, slug)').order('sort_order').then(({ data }) => {
      setProducts(data || []);
    });
  }, []);

  const categories = Array.from(
    new Map(products.map((p) => [p.categories?.slug, p.categories]).filter(([slug]) => slug)).values()
  );

  const visible = products.filter((p) => {
    const text = (p.name + ' ' + p.description).toLowerCase();
    const matchesText = text.includes(query.toLowerCase());
    const matchesCategory = category === 'all' || p.categories?.slug === category;
    return p.active && matchesText && matchesCategory;
  });

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Hier findest du die Banane die du verdienst!</p>
        <h1>Eine Banane ist eine Banane ist eine Banane.</h1>
        <p>"Die Banane ist eine Hoffnung für viele und eine Notwendigkeit für uns alle." (Konrad Adenauer)</p>
      </section>
      <section className="filters">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Produkt suchen" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Kategorie filtern">
          <option value="all">Alle Kategorien</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </section>
      <section className="product-grid">
        {visible.map((p) => {
          const soldOut = Number(p.stock) <= 0;
          return (
            <article className="product-card" key={p.id}>
              <div className="product-image"><img src={p.image_url || '/images/banana-large.svg'} alt={p.name} /></div>
              <p className="category-label">{p.categories?.name}</p>
              <h2>{p.name}</h2>
              <p>{p.description}</p>
              <div className="product-meta"><b>{formatCurrency(p.price)}</b><span>{soldOut ? 'Ausverkauft' : p.stock + ' verfügbar'}</span></div>
              <div className="button-row">
                <Link className="button ghost" to={'/product/' + p.id}>Ansehen</Link>
                <button className="button" disabled={soldOut} onClick={() => add(p)}>{soldOut ? 'Ausverkauft' : 'In den Warenkorb'}</button>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
