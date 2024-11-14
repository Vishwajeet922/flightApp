import React, { useState, useEffect } from "react";
import { FaPlane, FaHotel, FaCar } from 'react-icons/fa';
import { API_MASTER_DATA_URL } from "../utils/contants";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedAirport, setSelectedAirport] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDestinationAirport, setSelectedDestinationAirport] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_MASTER_DATA_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCountryChange = (e) => {
    const country = data.countries.find(c => c.countryName === e.target.value);
    setSelectedCountry(country ? country.countryId : "");
    setSelectedAirport("");
  };

  const handleAirportChange = (e) => {
    setSelectedAirport(e.target.value);
  };

  const handleDestinationChange = (e) => {
    const country = data.countries.find(c => c.countryName === e.target.value);
    setSelectedDestination(country ? country.countryId : "");
    setSelectedDestinationAirport("");
  };

  const handleDestinationAirportChange = (e) => {
    setSelectedDestinationAirport(e.target.value);
  };

  const fromAirports = selectedCountry && data ? data.countries.find(country => country.countryId === selectedCountry)?.airportsList : [];
  const toAirports = selectedDestination && data ? data.countries.find(country => country.countryId === selectedDestination)?.airportsList : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      fromCountry: selectedCountry,
      fromAirport: selectedAirport,
      toCountry: selectedDestination,
      toAirport: selectedDestinationAirport,
      departDate: document.getElementById('depart').value,
      passengers: document.getElementById('passengers').value
    });
    navigate(`/flights?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Explore the World</h1>
          <p className="text-xl text-white/90">Find and book the best flight deals worldwide</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 text-blue-600 border-b-2 border-blue-600 pb-2">
              <FaPlane className="text-xl" />
              <span className="font-semibold">Flight Search</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700">From Country</label>
                <select
                  id="country"
                  value={selectedCountry ? data?.countries.find(c => c.countryId === selectedCountry)?.countryName : ""}
                  onChange={handleCountryChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a country</option>
                  {data && data.countries.map(country => (
                    <option key={country.countryId} value={country.countryName}>
                      {country.countryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="airport" className="block text-sm font-medium text-gray-700 mb-1">Airport</label>
                <select id="airport" value={selectedAirport} onChange={handleAirportChange} className="w-full p-2 border border-gray-300 rounded" disabled={!selectedCountry}>
                  <option value="">Select an airport</option>
                  {fromAirports.map(airport => (
                    <option key={airport.airportId} value={airport.airportName}>
                      {airport.airportName} ({airport.airportCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">To Destination</label>
                <select id="destination" value={selectedDestination ? data.countries.find(c => c.countryId === selectedDestination)?.countryName : ""} onChange={handleDestinationChange} className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select a destination</option>
                  {data && data.countries.map(country => (
                    <option key={country.countryId} value={country.countryName}>
                      {country.countryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="destination-airport" className="block text-sm font-medium text-gray-700 mb-1">To Airport</label>
                <select id="destination-airport" value={selectedDestinationAirport} onChange={handleDestinationAirportChange} className="w-full p-2 border border-gray-300 rounded" disabled={!selectedDestination}>
                  <option value="">Select a destination airport</option>
                  {toAirports.map(airport => (
                    <option key={airport.airportId} value={airport.airportName}>
                      {airport.airportName} ({airport.airportCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="depart" className="block text-sm font-medium text-gray-700 mb-1">Depart</label>
                <input type="date" id="depart" className="w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <label htmlFor="passengers" className="block text-sm font-semibold text-gray-700">Passengers</label>
                <select id="passengers" className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>1 adult</option>
                  <option>2 adults</option>
                  <option>3 adults</option>
                  <option>4 adults</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-lg">
                Search Flights
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <FaPlane className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Popular Routes</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <span className="w-24">London</span>
                <FaPlane className="mx-4 text-blue-400 transform rotate-90" />
                <span>New York</span>
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-24">Dubai</span>
                <FaPlane className="mx-4 text-blue-400 transform rotate-90" />
                <span>Singapore</span>
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-24">Paris</span>
                <FaPlane className="mx-4 text-blue-400 transform rotate-90" />
                <span>Tokyo</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Last Minute Deals</h2>
            </div>
            <p className="text-gray-600">Find incredible savings on last-minute flight bookings!</p>
            <button className="mt-4 text-blue-600 font-semibold hover:text-blue-800">View Deals →</button>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Why Choose Us</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Best Price Guarantee
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                24/7 Customer Support
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Secure Booking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
