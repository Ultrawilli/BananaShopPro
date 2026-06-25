import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../lib/format';
import { useCart } from '../components/CartProvider.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    supabase.from('products').select('*, categories(name)').eq('id', id).single().then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <section className="panel">Produkt wird geladen...</section>;

  const soldOut = Number(product.stock) <= 0;

  return (
    <section className="detail-layout">
      <div className="product-image large"><img src={product.image_url || '/images/banana-large.svg'} alt={product.name} /></div>
      <div>
        <p className="category-label">{product.categories?.name}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="price">{formatCurrency(product.price)}</p>
        <p>{soldOut ? 'Ausverkauft' : product.stock + ' verfügbar'}</p>
        <label className="field-label">Menge
          <input type="number" min="1" max={product.stock} disabled={soldOut} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <button className="button" disabled={soldOut} onClick={() => { add(product, quantity); navigate('/cart'); }}>{soldOut ? 'Ausverkauft' : 'In den Warenkorb'}</button>
      </div>
    </section>
  );
}
