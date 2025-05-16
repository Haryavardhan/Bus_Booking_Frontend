import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './index.css';

const Booking = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [journeyDate, setJourneyDate] = useState('');
  const token = Cookies.get('token');

  const today = new Date().toISOString().split('T')[0];
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const maxDate = oneMonthLater.toISOString().split('T')[0];

  useEffect(() => {
    const fetchBusAndBookings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/bus/${busId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch bus');

        setBus(data.bus);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
        });
      }
    };

    fetchBusAndBookings();
  }, [busId]);

  const fetchBookedSeats = async (date) => {
    const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/booking/booked-seats/${busId}?date=${date}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setBookedSeats(data.bookedSeats);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setJourneyDate(date);
    setSelectedSeats([]);
    fetchBookedSeats(date);
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    if (!journeyDate || selectedSeats.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a date and at least one seat.',
      });
      return;
    }

    const totalPrice = selectedSeats.length * bus.price;

    const result = await Swal.fire({
      icon: 'question',
      title: 'Confirm Booking',
      html: `You are booking <strong>${selectedSeats.length}</strong> seat(s) for a total of <strong>₹${totalPrice}</strong>. Proceed?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Book',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/booking/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ busId, seatsBooked: selectedSeats, journeyDate }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Booking failed');

      Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: `You have booked seats: ${selectedSeats.join(', ')}`,
      });

      navigate('/my-bookings');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
      });
    }
  };

  const renderSeats = () => {
    if (!bus) return null;

    const totalSeats = bus.seats;
    const rows = [];
    for (let i = 0; i < totalSeats; i += 4) {
      const left = [i + 1, i + 2].filter(n => n <= totalSeats);
      const right = [i + 3, i + 4].filter(n => n <= totalSeats);

      rows.push(
        <div className="seat-row" key={i}>
          <div className="seat-group">
            {left.map(seat => (
              <div
                key={seat}
                className={`seat ${bookedSeats.includes(seat) ? 'booked' : ''} ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </div>
            ))}
          </div>
          <div className="aisle"></div>
          <div className="seat-group">
            {right.map(seat => (
              <div
                key={seat}
                className={`seat ${bookedSeats.includes(seat) ? 'booked' : ''} ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="booking-container">
      <h2>Book Seats</h2>

      {bus && (
        <div className="bus-info">
          <p><strong>Bus:</strong> {bus.name}</p>
          <p><strong>From:</strong> {bus.from} → <strong>To:</strong> {bus.to}</p>
          <p><strong>Ticket Price:</strong> ₹{bus?.price} per seat</p>
        </div>
      )}

      <input
        type="date"
        id="journeyDate"
        value={journeyDate}
        onChange={handleDateChange}
        required
        min={today}
        max={maxDate}
      />

      <div className="bus-layout">
        <div className="driver">🧑‍✈️</div>
        <div className="seats-grid">{renderSeats()}</div>
      </div>

      <p><strong>Selected Seats:</strong> {selectedSeats.join(', ') || 'None'}</p>

      <p><strong>Total Price:</strong> ₹{selectedSeats.length * bus?.price}</p>

      <button onClick={handleBooking} disabled={selectedSeats.length === 0}>Confirm Booking</button>
    </div>
  );
};

export default Booking;
