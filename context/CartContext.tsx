
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order, Product, ProductSize, ShippingAddress } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, color: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  lastOrder: Order | null;
  createOrder: (shippingAddress: ShippingAddress) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const localCart = window.localStorage.getItem('renisCart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage", error);
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('renisCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cart]);

  const addToCart = (product: Product, size: ProductSize, color: string, quantity: number) => {
    const variant = product.variants.find(v => v.color === color);
    const sizeInfo = variant?.sizes.find(s => s.size === size);

    if (!variant || !sizeInfo) {
      console.error("Invalid product variant or size");
      return;
    }

    const cartItemId = `${product.id}-${color}-${size}`;
    const existingItem = cart.find(item => item.id === cartItemId);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === cartItemId
          ? { ...item, quantity: Math.min(item.quantity + quantity, sizeInfo.stock) }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[variant.imageIndex],
        size,
        color,
        quantity,
        stock: sizeInfo.stock,
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };
  
  const createOrder = async (shippingAddress: ShippingAddress) => {
    const newOrder: Order = {
      id: `RENIS-${Date.now()}`,
      customer: shippingAddress,
      items: cart,
      total: cartTotal,
      orderStatus: 'Processing',
      paymentStatus: 'Awaiting Confirmation',
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('renisOrders') || '[]');
    localStorage.setItem('renisOrders', JSON.stringify([...existingOrders, newOrder]));

    // Auto-sync to database
    try {
      await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrder.id,
          customer: newOrder.customer,
          items: newOrder.items,
          total: newOrder.total,
          orderStatus: newOrder.orderStatus,
          paymentStatus: newOrder.paymentStatus
        })
      });
      console.log('Order synced to database:', newOrder.id);
    } catch (error) {
      console.error('Failed to sync order to database:', error);
    }

    setLastOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, lastOrder, createOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
