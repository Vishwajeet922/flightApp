import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_FLIGHT_URL } from '../utils/contants';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`${API_FLIGHT_URL}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }
        const data = await response.json();
        console.log(data);
        const fromAirport = searchParams.get('fromAirport');
        const toAirport = searchParams.get('toAirport');
        const departDate = searchParams.get('departDate');

        if (!fromAirport && !toAirport && !departDate) {
          const currentDate = new Date();
          const fiveDaysFromNow = new Date();
          fiveDaysFromNow.setDate(currentDate.getDate() + 5);

          const nextFiveDaysFlights = data.filter(flight => {
            const flightDate = new Date(flight.flyDate);
            return flightDate >= currentDate && flightDate <= fiveDaysFromNow;
          });

          setFlights(nextFiveDaysFlights);
          return;
        }

        const filteredFlights = data.filter(flight => {
          const flightDate = new Date(flight.flyDate);
          return (
            flight.fromAirport === decodeURIComponent(fromAirport) &&
            flight.toAirport === decodeURIComponent(toAirport) &&
            (departDate ? flightDate >= new Date(departDate) : true)
          );
        });

        setFlights(filteredFlights);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [location.search]);

  const handleBookNow = (flightId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    navigate(`/flight/${flightId}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Flights</h1>
      {flights.length === 0 ? (
        <p>No flights found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-lg shadow-md p-6">
              <img src={flight.images[0]} alt={flight.id} className="w-full h-48 object-cover rounded-t-lg mb-4" />
              <h2 className="text-xl font-semibold mb-2">{flight.airline}</h2>
              <p className="mb-2">From: {flight.fromAirport}</p>
              <p className="mb-2">To: {flight.toAirport}</p>
              <p className="mb-2">Date: {flight.flyDate}</p>
              <p className="mb-2">Duration: {flight.duration}</p>
              <p className="mb-2">Price: ${flight.price.toFixed(2)}</p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="list-disc list-inside">
                  {flight.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleBookNow(flight.id)}
                className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Flights;
