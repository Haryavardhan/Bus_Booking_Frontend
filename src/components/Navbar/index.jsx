import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import './index.css'

const Navbar = () => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = Cookies.get('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" >
                <Link to="/">🚌 BusBooking</Link>
            </div>

            <ul className="navbar-links">
                <li><Link to="/my-bookings">My Bookings</Link></li>
                {isLoggedIn ? (
                    <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
