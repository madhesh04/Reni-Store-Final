import React from 'react';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-8">Shipping Policy</h1>
        <div className="space-y-6 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Order Processing</h2>
          <p>All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          
          <h2 className="text-xl font-semibold text-white mt-6">Shipping Rates & Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout. We offer standard and express shipping options.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Standard Shipping:</strong> 5-7 business days</li>
            <li><strong>Express Shipping:</strong> 2-3 business days</li>
          </ul>
          <p>Please note that delivery times are estimates and may vary depending on your location and carrier delays.</p>

          <h2 className="text-xl font-semibold text-white mt-6">Order Tracking</h2>
          <p>Once your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
          
          <h2 className="text-xl font-semibold text-white mt-6">International Shipping</h2>
          <p>We currently do not offer international shipping.</p>
          
          <h2 className="text-xl font-semibold text-white mt-6">Contact Us</h2>
          <p>If you have any further questions, please don't hesitate to contact us at <a href="mailto:support@renis.store" className="text-white hover:underline">support@renis.store</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
