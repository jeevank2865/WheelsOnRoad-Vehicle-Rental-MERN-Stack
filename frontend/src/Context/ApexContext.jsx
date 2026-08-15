import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const ApexContext = createContext();

export const ApexProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lockedVehicles, setLockedVehicles] = useState({});
  const socketRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    let socket = null;
    try {
      const io = require('socket.io-client');
      socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 5000,
      });

      socketRef.current = socket;

      socket.on('vehicleLocked', (data) => {
        setLockedVehicles((prev) => ({
          ...prev,
          [data.vehicleId]: { startDate: data.startDate, endDate: data.endDate },
        }));
      });

      socket.on('vehicleAvailabilityUpdated', (data) => {
        if (data.status === 'CONFIRMED') {
          // You could optionally refetch vehicles or update specific lock state here
          console.log('Vehicle booking confirmed real-time:', data.bookingId);
        }
      });

      socket.on('connect_error', (err) => {
        console.warn('Socket connection issue (non-critical):', err.message);
      });
    } catch (err) {
      console.warn('Socket.io initialization skipped:', err.message);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchVehicles();
    const token = localStorage.getItem('apexlease_token');
    if (token) {
      axios
        .get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          fetchMyBookings(token);
        })
        .catch(() => {
          localStorage.removeItem('apexlease_token');
        });
    }
  }, []);

  const fetchVehicles = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      ).toString();
      const res = await axios.get(`${API_URL}/vehicles${params ? '?' + params : ''}`);
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async (token) => {
    try {
      const t = token || localStorage.getItem('apexlease_token');
      if (!t) return;
      const res = await axios.get(`${API_URL}/bookings/mybookings`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setMyBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err.message);
    }
  };

  const checkAvailability = async (vehicleId, startDate, endDate) => {
    const res = await axios.post(`${API_URL}/vehicles/${vehicleId}/check-availability`, {
      startDate,
      endDate,
    });
    return res.data;
  };

  const createBooking = async (vehicleId, startDate, endDate) => {
    const token = localStorage.getItem('apexlease_token');
    const res = await axios.post(
      `${API_URL}/bookings`,
      { vehicleId, startDate, endDate },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (socketRef.current?.connected) {
      socketRef.current.emit('selectDateRange', { vehicleId, startDate, endDate });
    }
    await fetchMyBookings();
    return res.data;
  };

  const addVehicle = async (vehicleData) => {
    const token = localStorage.getItem('apexlease_token');
    const res = await axios.post(`${API_URL}/vehicles`, vehicleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchVehicles();
    return res.data;
  };

  const updateVehicle = async (vehicleId, vehicleData) => {
    const token = localStorage.getItem('apexlease_token');
    const res = await axios.put(`${API_URL}/vehicles/${vehicleId}`, vehicleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchVehicles();
    return res.data;
  };

  const deleteVehicle = async (vehicleId) => {
    const token = localStorage.getItem('apexlease_token');
    const res = await axios.delete(`${API_URL}/vehicles/${vehicleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchVehicles();
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem('apexlease_token', res.data.token);
    setUser(res.data);
    fetchMyBookings(res.data.token);
    return res.data;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
    localStorage.setItem('apexlease_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('apexlease_token');
    setUser(null);
    setMyBookings([]);
  };

  return (
    <ApexContext.Provider
      value={{
        vehicles,
        user,
        myBookings,
        loading,
        lockedVehicles,
        fetchVehicles,
        checkAvailability,
        createBooking,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        login,
        register,
        logout,
        fetchMyBookings,
      }}
    >
      {children}
    </ApexContext.Provider>
  );
};
