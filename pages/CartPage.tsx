
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);


const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  return (
    <div className="flex items-center py-6 border-b border-gray-800">
      <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md" />
      <div className="flex-grow ml-4 sm:ml-6">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-400">{item.color} / {item.size}</p>
        <p className="sm:hidden mt-2 font-semibold">${item.price.toFixed(2)}</p>
      </div>
      <div className="hidden sm:block w-32 text-center">
        <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
      </div>
      <div className="w-28 text-center">
        <input 
          type="number" 
          value={item.quantity}
          min="1"
          max={item.stock}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 bg-gray-800 text-white text-center rounded-md p-2 border border-gray-700"
        />
      </div>
      <div className="w-28 text-right font-semibold text-lg">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      <div className="w-12 text-right">
        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-white">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};


const CartPage: React.FC = () => {
  const { cart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-4 text-gray-400">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="mt-8 inline-block bg-white text-black px-8 py-3 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="hidden sm:flex text-sm text-gray-400 uppercase pb-4 border-b border-gray-800">
        <div className="flex-grow">Product</div>
        <div className="w-32 text-center">Price</div>
        <div className="w-28 text-center">Quantity</div>
        <div className="w-28 text-right">Total</div>
        <div className="w-12 text-right"></div>
      </div>

      <div>
        {cart.map(item => <CartItemRow key={item.id} item={item} />)}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-sm bg-gray-900 p-6 rounded-lg">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Shipping & taxes calculated at checkout.</p>
          <Link to="/checkout">
            <button className="w-full mt-6 bg-white text-black py-3 px-6 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
