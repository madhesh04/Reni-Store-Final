
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MOCK_UPI_DETAILS } from '../data/mockData';
import { generateInvoice, downloadInvoice } from '../utils/invoiceGenerator';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { lastOrder, cartTotal } = useCart();
  const [upiDetails, setUpiDetails] = useState(MOCK_UPI_DETAILS);
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'checking' | 'success' | 'failed'>('waiting');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const storedUpi = localStorage.getItem('renisUpiDetails');
    if (storedUpi) {
      setUpiDetails(JSON.parse(storedUpi));
    }
  }, []);
  
  useEffect(() => {
    if (paymentStatus === 'waiting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && paymentStatus === 'waiting') {
      setPaymentStatus('failed');
      const orders = JSON.parse(localStorage.getItem('renisOrders') || '[]');
      const updatedOrders = orders.map((order: any) => 
        order.id === lastOrder?.id ? {...order, paymentStatus: 'Failed'} : order
      );
      localStorage.setItem('renisOrders', JSON.stringify(updatedOrders));
    }
  }, [timeLeft, paymentStatus, lastOrder]);

  if (!lastOrder) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-2xl font-bold">No order found to pay for.</h1>
            <button onClick={() => navigate('/products')} className="mt-4 text-white font-semibold border-b-2 border-white pb-1">Start Shopping</button>
        </div>
    );
  }

  const handlePaymentConfirmation = () => {
    setPaymentStatus('checking');
    
    // Simulate payment verification (70% success rate)
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      if (isSuccess) {
        setPaymentStatus('success');
        // Update order payment status
        const orders = JSON.parse(localStorage.getItem('renisOrders') || '[]');
        const updatedOrders = orders.map((order: any) => 
          order.id === lastOrder.id ? {...order, paymentStatus: 'Paid'} : order
        );
        localStorage.setItem('renisOrders', JSON.stringify(updatedOrders));
        
        // Generate and send invoice
        const invoicePdf = generateInvoice(lastOrder);
        
        // Send invoice email
        fetch('http://localhost:3001/api/send-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: lastOrder, invoicePdf })
        }).catch(err => console.error('Failed to send invoice email:', err));
        
        setTimeout(() => navigate(`/confirmation/${lastOrder.id}`), 2000);
      } else {
        setPaymentStatus('failed');
        // Update order payment status
        const orders = JSON.parse(localStorage.getItem('renisOrders') || '[]');
        const updatedOrders = orders.map((order: any) => 
          order.id === lastOrder.id ? {...order, paymentStatus: 'Failed'} : order
        );
        localStorage.setItem('renisOrders', JSON.stringify(updatedOrders));
      }
    }, 3000);
  };
  
  const handleRetryPayment = () => {
    setPaymentStatus('waiting');
    setTimeLeft(300);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-2xl text-center">
        <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-gray-400 mb-6">Scan the QR code using any UPI app.</p>

        <div className="flex justify-center mb-4">
          <img src={upiDetails.qrCodeUrl} alt="UPI QR Code" className="w-56 h-56 rounded-lg bg-white p-2" />
        </div>
        
        <div className="mb-6">
          <p className="text-gray-400">Amount to be paid:</p>
          <p className="text-3xl font-bold tracking-wider">${lastOrder.total.toFixed(2)}</p>
        </div>

        <div className="mb-6">
            <p className="text-gray-400">Or pay to UPI ID:</p>
            <p className="font-semibold text-lg bg-gray-800 py-2 px-4 rounded-md inline-block mt-2">{upiDetails.upiId}</p>
        </div>
        
        {paymentStatus === 'waiting' && (
          <>
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-400">Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            </div>
            <button 
              onClick={handlePaymentConfirmation}
              className="w-full bg-white text-black py-3 px-6 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300"
            >
              I have completed my payment
            </button>
          </>
        )}
        
        {paymentStatus === 'checking' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Verifying payment...</p>
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <div className="text-center text-green-400">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-lg">Payment successful! Redirecting...</p>
          </div>
        )}
        
        {paymentStatus === 'failed' && (
          <div className="text-center">
            <div className="text-4xl mb-4 text-red-400">✗</div>
            <p className="text-lg text-red-400 mb-4">Payment failed or timed out</p>
            <button 
              onClick={handleRetryPayment}
              className="w-full bg-red-600 text-white py-3 px-6 text-lg font-semibold rounded-md hover:bg-red-700 transition-all duration-300"
            >
              Retry Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
