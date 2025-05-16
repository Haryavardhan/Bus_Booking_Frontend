import React, { useState } from 'react';
import Cookies from 'js-cookie'
import { useNavigate,Link } from 'react-router-dom';
import { BiShow } from "react-icons/bi"
import './index.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    if (!email || !password ) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const url = `${import.meta.env.VITE_APP_BASE_URL}/user/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(response)
      console.log(data)

      if (!response.ok) {
        setError(data.error)
      } else {
        Cookies.set('token', data.token, {expires: 7})
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-bg">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>

        <div className='input-wrapper'>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            <BiShow className='eye-icon' />
          </span>
        </div>

        

        <button type="submit" className="submit-button">
          Login
        </button>

        {error && <p className="error-text">{error}</p>}
        <p>or</p>
      <Link to="/register"> Create Account</Link> 
      </form>
      
    </div>
  );
};

export default Login;
