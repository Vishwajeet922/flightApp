import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { API_FLIGHT_URL, API_BOOKING_URL } from '../utils/contants';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../utils/cookies';
import LoadingSpinner from '../components/LoadingSpinner';

const FlightDetails = () => {
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState('Economy');
    const { flightId } = useParams();
    const { user } = useAuth();
    const [bookingStatus, setBookingStatus] = useState(null);

    const getClassPriceMultiplier = (classType) => {
        switch (classType) {
            case 'Business':
                return 2.5;
            case 'First Class':
                return 4;
            default:
                return 1;
        }
    };

    useEffect(() => {
        const fetchFlightDetails = async () => {
            try {
                const response = await fetch(`${API_FLIGHT_URL}/${flightId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch flight details');
                }
                const data = await response.json();
                setFlight(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFlightDetails();
    }, [flightId]);

    const handleBooking = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const bookingData = {
                flightCode: flightId,
                price: flight.price * getClassPriceMultiplier(selectedClass),
                bookingClass: selectedClass,
                status: 'pending',
                bookedBy: user.username
            };

            const response = await fetch(API_BOOKING_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                throw new Error('Booking failed');
            }

            setBookingStatus('success');
        } catch (err) {
            setBookingStatus('error');
            console.error('Booking error:', err);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    if (!flight) return <div className="text-center py-8">Flight not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image Carousel */}
                <div className="w-full h-96">
                    <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={true}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={5000}
                        className="h-full"
                    >
                        {flight.images.map((image, index) => (
                            <div key={index} className="h-96">
                                <img
                                    src={image}
                                    alt={`Flight ${index + 1}`}
                                    className="object-cover h-full w-full"
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>

                {/* Flight Details */}
                <div className="p-8 pt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">{flight.airline}</h1>
                        <div className="flex items-center gap-4">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="border rounded-md px-3 py-1 text-gray-700 relative z-10"
                            >
                                <option value="Economy">Economy</option>
                                <option value="Business">Business</option>
                                <option value="First Class">First Class</option>
                            </select>
                            <span className="text-2xl font-bold text-blue-600">
                                ${(flight.price * getClassPriceMultiplier(selectedClass)).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Flight Information</h2>
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    <span className="font-medium">From:</span> {flight.fromAirport}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">To:</span> {flight.toAirport}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Date:</span> {new Date(flight.flyDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Duration:</span> {flight.duration}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={`font-semibold ${flight.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {flight.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Features</h2>
                            <ul className="space-y-2">
                                {flight.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {flight.status === 'AVAILABLE' && (
                        <>
                            <button
                                onClick={handleBooking}
                                disabled={!user}
                                className={`w-full ${user ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                                    } text-white py-3 px-6 rounded-lg font-semibold transition duration-300`}
                            >
                                {user ? 'Book This Flight' : 'Please login to book'}
                            </button>
                            {bookingStatus === 'success' && (
                                <p className="text-green-600 text-center mt-2">Booking successful!</p>
                            )}
                            {bookingStatus === 'error' && (
                                <p className="text-red-600 text-center mt-2">Booking failed. Please try again.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlightDetails; 