import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Coffee, 
  Image, 
  UtensilsCrossed, 
  Calendar,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import apiService from '../../utils/api';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    await apiService.auth.logout();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Menu', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Biji Kopi', href: '/admin/biji-kopi', icon: Coffee },
    { name: 'Galeri', href: '/admin/galeri', icon: Image },
    { name: 'Reservasi', href: '/admin/reservasi', icon: Calendar },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-primary-dark">
          <Link to="/admin/dashboard" className="text-white font-bold text-lg">
            Nature Coffee Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-light text-white'
                      : 'text-green-100 hover:bg-primary-light/50 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-primary-light mt-8 pt-6">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-sm font-medium text-green-100 hover:bg-primary-light/50 hover:text-white rounded-lg transition-colors duration-200 w-full"
            >
              <LogOut size={20} className="mr-3" />
              Keluar
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 lg:hidden mr-4"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Lihat Website
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;