import React, { useState } from 'react';
import Toast from '../components/Toast';

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const ContactPage: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string
    };

    try {
      console.log('Sending email with data:', data);
      const response = await fetch('https://reni-store-final.railway.internal/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
        (e.target as HTMLFormElement).reset();
      } else {
        console.error('Server error:', responseData);
        alert(`Failed to send message: ${responseData.details || responseData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to send message. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-2 text-lg text-gray-400">We're here to help. Get in touch with us for any inquiries.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
              <div>
                  <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                  <p className="text-gray-400">
                      Have a question about our products, an order, or anything else? Our team is ready to answer all your questions.
                  </p>
              </div>
              <div className="flex items-start space-x-4">
                  <div className="bg-gray-800 p-3 rounded-full">
                      <MailIcon />
                  </div>
                  <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-gray-400">For support, questions, or feedback.</p>
                      <a href="mailto:madheshp42@gmail.com" className="text-white hover:underline">madheshp42@gmail.com</a>
                  </div>
              </div>
             <div className="flex items-start space-x-4">
                <div className="bg-gray-800 p-3 rounded-full">
                    <PhoneIcon />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-gray-400">Mon-Fri from 9am to 5pm.</p>
                    <a href="tel:+1234567890" className="text-white hover:underline">+1 (234) 567-890</a>
                </div>
            </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-900 p-8 rounded-lg">
           <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
           <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input type="text" name="name" id="name" required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-white focus:border-white" />
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input type="email" name="email" id="email" required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-white focus:border-white" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
              <textarea name="message" id="message" rows={5} required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-white focus:border-white"></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-black py-3 px-6 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
    <Toast message="Feedback sent!" show={showToast} />
    </>
  );
};

export default ContactPage;