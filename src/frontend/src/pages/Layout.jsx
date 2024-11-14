import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import avatar from '../assets/clipart.png'
import icon from '../assets/icon.jpeg';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white relative">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex w-full lg:w-auto justify-between items-center">
              <a href="/" className="flex items-center">
                <img src={icon} alt="Website Logo" className="h-12 mr-4" />
                <h1 className="font-bold uppercase text-2xl">Flighter</h1>
              </a>
              <button
                className="lg:hidden p-2 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </button>
            </div>
            <div className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row w-full lg:w-auto items-center space-y-4 lg:space-y-0 mt-4 lg:mt-0`}>
              <nav className="w-full lg:w-auto">
                <ul className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-10">
                  <li><Link to="/" className="hover:text-gray-300 text-xl block py-2">Home</Link></li>
                  <li><Link to="/flights" className="hover:text-gray-300 text-xl block py-2">Flights</Link></li>
                  {!user && (
                    <>
                      <li><Link to="/login" className="hover:text-gray-300 text-xl block py-2">Login</Link></li>
                      <li><Link to="/register" className="hover:text-gray-300 text-xl block py-2">Register</Link></li>
                    </>
                  )}
                  {user && (
                    <li><Link to="/my-bookings" className="hover:text-gray-300 text-xl block py-2">My Bookings</Link></li>
                  )}
                </ul>
              </nav>
              {user && (
                <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 lg:ml-10">
                  <div className="flex items-center">
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 w-full lg:w-auto"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">About Us</a></li>
                <li><a href="#" className="hover:text-gray-300">Careers</a></li>
                <li><a href="#" className="hover:text-gray-300">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-300">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Facebook</a></li>
                <li><a href="#" className="hover:text-gray-300">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-300">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
