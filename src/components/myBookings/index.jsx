import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './index.css';
import Navbar from '../Navbar';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/booking/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');

        setBookings(data.bookings);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
        });
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
    <Navbar />
    <div className="my-bookings-container">
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <div className="booking-header">
                <h3>{booking.busId.name}</h3>
                <p>{booking.busId.from} → {booking.busId.to}</p>
              </div>

              <div className="booking-details">
                <p><strong>Journey Date:</strong> {new Date(booking.journeyDate).toLocaleDateString()}</p>
                <p><strong>Departure:</strong> {booking.busId.departureTime}</p>
                <p><strong>Arrival:</strong> {booking.busId.arrivalTime}</p>
                <p><strong>Seats:</strong> {booking.seatsBooked.join(', ')}</p>
                <p><strong>Ticket Price:</strong> ₹{booking.busId.price}</p>
                <p><strong>Total:</strong> ₹{booking.busId.price * booking.seatsBooked.length}</p>
              </div>

              <div className="booking-footer">
                <small>Booked on: {new Date(booking.bookingTime).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default MyBookings;
