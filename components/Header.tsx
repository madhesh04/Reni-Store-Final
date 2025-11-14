import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const Header: React.FC = () => {
  const { cartCount } = useCart();

  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1">
            <Link to="/" className="text-2xl font-bold tracking-wider">
              RENIS
            </Link>
          </div>
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center space-x-8">
              <li>
                <NavLink to="/" className={({ isActive }) => `hover:text-gray-300 transition-colors ${isActive ? 'text-white font-semibold' : 'text-gray-400'}`}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/products" className={({ isActive }) => `hover:text-gray-300 transition-colors ${isActive ? 'text-white font-semibold' : 'text-gray-400'}`}>Shop</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => `hover:text-gray-300 transition-colors ${isActive ? 'text-white font-semibold' : 'text-gray-400'}`}>About</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => `hover:text-gray-300 transition-colors ${isActive ? 'text-white font-semibold' : 'text-gray-400'}`}>Contact Us</NavLink>
              </li>
            </ul>
          </nav>
          <div className="flex-1 flex items-center justify-end">
            <Link to="/cart" className="relative group">
              <ShoppingBagIcon />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;