import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, 
  Coffee, 
  Calendar,
  Image,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import apiService from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalCoffeeBeans: 0,
    totalGallery: 0,
    totalReservations: 0,
    todayReservations: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.dashboard.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set sample data for demo
        setStats({
          totalMenus: 12,
          totalCoffeeBeans: 6,
          totalGallery: 8,
          totalReservations: 25,
          todayReservations: 3,
          monthlyRevenue: 15000000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Menu',
      value: stats.totalMenus,
      icon: Coffee,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Biji Kopi',
      value: stats.totalCoffeeBeans,
      icon: Coffee,
      color: 'bg-amber-500',
      change: '+8%'
    },
    {
      title: 'Foto Galeri',
      value: stats.totalGallery,
      icon: Image,
      color: 'bg-green-500',
      change: '+15%'
    },
    {
      title: 'Total Reservasi',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Reservasi Hari Ini',
      value: stats.todayReservations,
      icon: Users,
      color: 'bg-red-500',
      change: '+5%'
    },
    // {
    //   title: 'Pendapatan Bulan Ini',
    //   value: `Rp ${stats.monthlyRevenue.toLocaleString('id-ID')}`,
    //   icon: DollarSign,
    //   color: 'bg-indigo-500',
    //   change: '+18%'
    // },
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-primary text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang di Admin Panel</h2>
          <p className="text-green-100">
            Kelola konten dan reservasi Nature Coffee dengan mudah melalui dashboard ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                  <span className="text-gray-500 text-sm ml-2">dari bulan lalu</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/menu"
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors duration-200"
            >
              <Coffee className="text-blue-600 mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Kelola Menu</h4>
              <p className="text-sm text-gray-600">Tambah/edit menu kafe</p>
            </a>
            
            <a
              href="/admin/biji-kopi"
              className="bg-amber-50 hover:bg-amber-100 p-4 rounded-lg transition-colors duration-200"
            >
              <Coffee className="text-amber-600 mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Biji Kopi</h4>
              <p className="text-sm text-gray-600">Kelola produk biji kopi</p>
            </a>
            
            <a
              href="/admin/galeri"
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors duration-200"
            >
              <Image className="text-green-600 mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Galeri</h4>
              <p className="text-sm text-gray-600">Upload foto terbaru</p>
            </a>
            
            <a
              href="/admin/reservasi"
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors duration-200"
            >
              <Calendar className="text-purple-600 mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Reservasi</h4>
              <p className="text-sm text-gray-600">Lihat reservasi terbaru</p>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="text-blue-500 mr-3" size={20} />
              <div>
                <p className="text-sm font-medium">Reservasi baru dari John Doe</p>
                <p className="text-xs text-gray-500">2 jam yang lalu</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Coffee className="text-green-500 mr-3" size={20} />
              <div>
                <p className="text-sm font-medium">Menu "Espresso Special" ditambahkan</p>
                <p className="text-xs text-gray-500">5 jam yang lalu</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Image className="text-purple-500 mr-3" size={20} />
              <div>
                <p className="text-sm font-medium">3 foto baru ditambahkan ke galeri</p>
                <p className="text-xs text-gray-500">1 hari yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;