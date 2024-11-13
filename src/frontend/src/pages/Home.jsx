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
    const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "mode": "no-cors",
    };
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_MASTER_DATA_URL, { headers });
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
    <div className="bg-blue-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">Find your next adventure</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex mb-4">
            <button className="flex items-center mr-4 text-blue-600 font-semibold">
              <FaPlane className="mr-2" />
              Flights
            </button>
            <button className="flex items-center mr-4 text-gray-600 font-semibold">
              <FaHotel className="mr-2" />
              Hotels
            </button>
            <button className="flex items-center text-gray-600 font-semibold">
              <FaCar className="mr-2" />
              Car Rental
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select id="country" value={selectedCountry ? data.countries.find(c => c.countryId === selectedCountry)?.countryName : ""} onChange={handleCountryChange} className="w-full p-2 border border-gray-300 rounded">
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
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                <select id="passengers" className="p-2 border border-gray-300 rounded">
                  <option>1 adult</option>
                  <option>2 adults</option>
                  <option>3 adults</option>
                  <option>4 adults</option>
                </select>
              </div>
              <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300">
                Search flights
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">Popular destinations</h2>
            <ul className="list-disc list-inside">
              <li>Paris, France</li>
              <li>Tokyo, Japan</li>
              <li>New York, USA</li>
              <li>Rome, Italy</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">Travel tips</h2>
            <p>Get the best deals by booking your flights and accommodations together!</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">Why choose us?</h2>
            <ul className="list-disc list-inside">
              <li>Best price guarantee</li>
              <li>24/7 customer support</li>
              <li>Flexible booking options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
