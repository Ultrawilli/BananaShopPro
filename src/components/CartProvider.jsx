import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const storageKey = 'banana-shop-pro-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  function add(product, amount = 1) {
    const qty = Math.max(1, Number(amount) || 1);
    setItems((current) => {
      const found = current.find((item) => item.product_id === product.id);
      if (found) {
        return current.map((item) => item.product_id === product.id ? { ...item, quantity: Math.min(item.quantity + qty, product.stock) } : item);
      }
      return [...current, {
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        stock: product.stock,
        quantity: Math.min(qty, product.stock)
      }];
    });
  }

  function update(productId, amount) {
    setItems((current) => current.map((item) => item.product_id === productId ? { ...item, quantity: Math.max(1, Math.min(Number(amount) || 1, item.stock)) } : item));
  }

  function remove(productId) {
    setItems((current) => current.filter((item) => item.product_id !== productId));
  }

  function clear() { setItems([]); }

  const total = items.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const value = useMemo(() => ({ items, total, count, add, update, remove, clear }), [items, total, count]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
