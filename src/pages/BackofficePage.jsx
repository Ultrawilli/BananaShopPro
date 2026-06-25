import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../lib/format';
import { useAuth } from '../components/AuthProvider.jsx';

export default function BackofficePage() {
  const { isAdmin, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('id, name, description, price, stock, active, sort_order, image_url, categories(name)')
      .order('sort_order');
    setProducts(data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function changeProduct(id, field, value) {
    setProducts((rows) => rows.map((p) => p.id === id ? { ...p, [field]: value } : p));
  }

  async function saveProduct(product) {
    setMessage('Produkt wird gespeichert...');
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock),
        active: Boolean(product.active),
        sort_order: Number(product.sort_order),
        image_url: product.image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', product.id);

    if (error) {
      setMessage('Fehler: ' + error.message);
      return;
    }

    setMessage('Produkt wurde gespeichert.');
    loadProducts();
  }

  if (!loading && !isAdmin) return <Navigate to="/" replace />;

  return (
    <section>
      <h1>Produkte verwalten</h1>
      <p>Hier kann der Admin Produktnamen, Beschreibungen, Preise, Bestände, Reihenfolge und Sichtbarkeit bearbeiten.</p>
      {message && <p className="notice">{message}</p>}
      <div className="admin-products">
        {products.map((product) => (
          <article className="order-card" key={product.id}>
            <h2>{product.name}</h2>
            <p className="category-label">{product.categories?.name}</p>
            <p>Aktueller Preis: <b>{formatCurrency(product.price)}</b></p>
            <label className="field-label">
              Name
              <input value={product.name} onChange={(e) => changeProduct(product.id, 'name', e.target.value)} />
            </label>
            <label className="field-label">
              Beschreibung
              <textarea value={product.description} onChange={(e) => changeProduct(product.id, 'description', e.target.value)} />
            </label>
            <label className="field-label">
              Bildpfad
              <input value={product.image_url || ''} onChange={(e) => changeProduct(product.id, 'image_url', e.target.value)} />
            </label>
            <div className="admin-product-grid">
              <label className="field-label">
                Preis
                <input type="number" step="0.01" min="0" value={product.price} onChange={(e) => changeProduct(product.id, 'price', e.target.value)} />
              </label>
              <label className="field-label">
                Bestand
                <input type="number" min="0" value={product.stock} onChange={(e) => changeProduct(product.id, 'stock', e.target.value)} />
              </label>
              <label className="field-label">
                Reihenfolge
                <input type="number" min="1" value={product.sort_order} onChange={(e) => changeProduct(product.id, 'sort_order', e.target.value)} />
              </label>
            </div>
            <label className="field-label checkbox-label">
              <input type="checkbox" checked={product.active} onChange={(e) => changeProduct(product.id, 'active', e.target.checked)} />
              Produkt im Shop anzeigen
            </label>
            <button className="button" onClick={() => saveProduct(product)}>Speichern</button>
          </article>
        ))}
      </div>
    </section>
  );
}
