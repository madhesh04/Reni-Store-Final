
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { downloadInvoice, generateInvoice } from '../utils/invoiceGenerator';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  const handleDownloadInvoice = async () => {
    const orders = JSON.parse(localStorage.getItem('renisOrders') || '[]');
    const order = orders.find((o: any) => o.id === orderId);
    if (order) {
      // Download invoice
      downloadInvoice(order);
      
      // Send email automatically
      try {
        const invoicePdf = generateInvoice(order);
        await fetch('http://localhost:3001/api/send-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order, invoicePdf })
        });
      } catch (error) {
        console.error('Error sending invoice email:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Thank You For Your Order!</h1>
        <p className="mt-4 text-gray-300">
          Your order <span className="font-semibold text-white">#{orderId}</span> has been placed successfully.
        </p>
        <p className="mt-2 text-gray-400">
          We are now awaiting payment confirmation. You will receive a notification once your payment is verified and your order is processed.
        </p>
        <div className="mt-8 space-y-4">
          <button 
            onClick={handleDownloadInvoice}
            className="block w-full max-w-xs mx-auto bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-md hover:bg-green-700 transition-all duration-300"
          >
            Download Invoice
          </button>
          <Link 
            to="/products" 
            className="block w-full max-w-xs mx-auto bg-white text-black px-8 py-3 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300 text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
