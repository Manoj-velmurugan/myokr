import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from '../utils/axiosInstance'; // axiosInstance with baseURL + token header

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/auth/login', form);

      console.log('✅ Login Response:', res.data); // 👈 Check this in browser DevTools

      const { token, user } = res.data;

      if (!token || !user) {
        setError('Login failed. Invalid response from server.');
        return;
      }

      // ✅ Save token and user ID to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);

      // ✅ Decode token to get role
      const decoded = jwtDecode(token);
      const role = decoded.role;

      console.log('🎫 JWT Decoded:', decoded); // 👈 See if token contains role

      // ✅ Navigate based on role
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/employee/dashboard');
      }

    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Login to MyOKR
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-purple-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
