import React from 'react';

const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-8">Return & Refund Policy</h1>
        <div className="space-y-6 text-gray-300">
          <p>We have a 14-day return policy, which means you have 14 days after receiving your item to request a return.</p>
          
          <h2 className="text-xl font-semibold text-white mt-6">Eligibility for a Return</h2>
          <p>Due to hygiene reasons, we can only accept returns for innerwear if the item is in the same condition that you received it, unworn or unused, with tags, and in its original packaging. Items sent back to us without first requesting a return will not be accepted.</p>
          <p>You’ll also need the receipt or proof of purchase.</p>

          <h2 className="text-xl font-semibold text-white mt-6">How to Start a Return</h2>
          <p>To start a return, you can contact us at <a href="mailto:support@renis.store" className="text-white hover:underline">support@renis.store</a>. If your return is accepted, we’ll send you instructions on how and where to send your package. The customer is responsible for return shipping costs.</p>

          <h2 className="text-xl font-semibold text-white mt-6">Damages and Issues</h2>
          <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>
          
          <h2 className="text-xl font-semibold text-white mt-6">Refunds</h2>
          <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>

          <h2 className="text-xl font-semibold text-white mt-6">Exchanges</h2>
          <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
