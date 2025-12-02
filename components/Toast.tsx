import React from 'react';

interface ToastProps {
  message: string;
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-600 text-white py-3 px-6 rounded-lg shadow-2xl z-50">
      <p>{message}</p>
    </div>
  );
};

export default Toast;