import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/contants';
import { getAuthToken } from '../utils/cookies';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${API_BASE_URL}/booking/myBookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleViewFlight = (flightId) => {
        navigate(`/flight/${flightId}`);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            {bookings.length === 0 ? (
                <p className="text-center text-gray-600">No bookings found.</p>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold mb-2">Booking ID: {booking.id}</p>
                                    <p className="text-gray-600">Class: {booking.bookingClass}</p>
                                    <p className="text-gray-600">Price: ${booking.price.toFixed(2)}</p>
                                    <p className="text-gray-600">Status: {booking.status}</p>
                                    <p className="text-gray-600">Booked On: {new Date(booking.bookedOn).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleViewFlight(booking.flightCode)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                                >
                                    View Flight Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings; 