import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import avatar from '../assets/clipart.png'
import icon from '../assets/icon.jpeg';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0">
              <img src={icon} alt="Website Logo" className="h-8 w-auto sm:mr-4" />
              <nav className="w-full sm:w-auto">
                <ul className="flex flex-wrap justify-center sm:justify-start space-x-4">
                  <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
                  <li><Link to="/flights" className="hover:text-gray-300">Flights</Link></li>
                  {!user && (
                    <>
                      <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                      <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
                    </>
                  )}
                  {user && (
                    <li><Link to="/my-bookings" className="hover:text-gray-300">My Bookings</Link></li>
                  )}
                </ul>
              </nav>
            </div>
            {user && (
              <div className="flex items-center">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{user.username}</span>
              </div>
            )}
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
