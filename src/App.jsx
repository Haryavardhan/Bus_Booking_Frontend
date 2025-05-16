import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Booking from './components/Booking'
import MyBookings from './components/myBookings'
import ProtectedRoute from './components/ProductedRoute'

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes go inside this parent route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/booking/:busId" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
