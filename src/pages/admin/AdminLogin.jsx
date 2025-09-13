import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import apiService from '../../utils/api';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.auth.login(credentials);
      localStorage.setItem('adminToken', response.token);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Nature Coffee</h2>
          <p className="text-green-100 mt-2">Silakan masuk untuk mengakses dashboard admin</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Masukkan username admin"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="Masukkan password admin"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/"
              className="text-primary hover:text-primary-dark font-medium"
            >
              ← Kembali ke Website Utama
            </a>
          </div>
        </div>

        <div className="text-center text-green-100 text-sm">
          <p>Demo Credentials: admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;