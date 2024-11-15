import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/contants';
import { getAuthToken } from '../utils/cookies';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
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

    const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedBooking) return;

        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/booking/${selectedBooking.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            setBookings(bookings.filter(booking => booking.id !== selectedBooking.id));
            setShowModal(false);
            setSelectedBooking(null);
        } catch (err) {
            setError(err.message);
        }
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
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewFlight(booking.flightCode)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                                    >
                                        View Flight Details
                                    </button>
                                    <button
                                        onClick={() => handleCancelClick(booking)}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4">Confirm Cancellation</h2>
                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">Are you sure you want to cancel this booking?</p>
                            <div className="bg-gray-100 p-4 rounded">
                                <p><strong>Booking ID:</strong> {selectedBooking?.id}</p>
                                <p><strong>Class:</strong> {selectedBooking?.bookingClass}</p>
                                <p><strong>Price:</strong> ${selectedBooking?.price.toFixed(2)}</p>
                                <p><strong>Status:</strong> {selectedBooking?.status}</p>
                                <p><strong>Booked On:</strong> {new Date(selectedBooking?.bookedOn).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                            >
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;