
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShippingAddress } from '../types';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, createOrder } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ShippingAddress>({
    customerName: '',
    phoneNumber: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      navigate('/products');
      return;
    }
    const order = createOrder(formData);
    navigate(`/payment`);
  };

  if (cart.length === 0) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-2xl font-bold">Your cart is empty.</h1>
            <button onClick={() => navigate('/products')} className="mt-4 text-white font-semibold border-b-2 border-white pb-1">Continue Shopping</button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input type="text" name="customerName" id="customerName" value={formData.customerName} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-white focus:border-white" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">Phone Number</label>
              <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-white focus:border-white" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300">Full Delivery Address</label>
              <textarea name="address" id="address" rows={4} value={formData.address} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-white focus:border-white"></textarea>
            </div>
            <button type="submit" className="w-full bg-white text-black py-3 px-6 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300">
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-900 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.color} / {item.size} x {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
