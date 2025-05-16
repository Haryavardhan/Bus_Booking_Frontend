import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../Navbar';
import './index.css';

const Home = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
  });

  const navigate = useNavigate()

  const [buses, setBuses] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBuses([]);

    const { from, to, date } = formData;

    if (!from || !to || !date) {
      setError('Please fill all fields.');
      return;
    }

    const token = Cookies.get('token')

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/bus/search-buses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setBuses(data.buses);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="home-container">
        <h2>Search Buses</h2>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            name="from"
            placeholder="From"
            value={formData.from}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="to"
            placeholder="To"
            value={formData.to}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <button type="submit">Search</button>
        </form>

        {error && <p className="error">{error}</p>}
{
  bus.length === 0 && <p>No Buses Available</p>
}
        {buses.length > 0 && (
          <div className="bus-results">
            <h3>Available Buses</h3>
            <ul>
              {buses.map(bus => (
                <li key={bus._id} className="bus-card" >
                  <p><strong>Bus Name:</strong> {bus.name}</p>
                  <p><strong>From:</strong> {bus.from}</p>
                  <p><strong>To:</strong> {bus.to}</p>
                  <p><strong>Departure:</strong> {bus.departureTime}</p>
                  <p><strong>Seats Left:</strong> {bus.seatsLeft}</p>
                  <button
                    onClick={() => navigate(`/booking/${bus._id}`)}
                    className="book-button"
                  >
                    Book Seats
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
