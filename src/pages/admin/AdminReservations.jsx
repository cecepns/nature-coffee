import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import apiService from '../../utils/api';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'cancelled', label: 'Dibatalkan' },
    { value: 'completed', label: 'Selesai' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const statusIcons = {
    pending: AlertCircle,
    confirmed: CheckCircle,
    cancelled: XCircle,
    completed: CheckCircle,
    default: AlertCircle
  };

  useEffect(() => {
    fetchReservations();
  }, [pagination.currentPage, searchTerm, statusFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await apiService.reservations.getAll(pagination.currentPage, pagination.itemsPerPage);
      setReservations(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      // Set sample data for demo
      setReservations([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '081234567890',
          date: '2024-01-20',
          time: '14:00',
          guests: 4,
          notes: 'Meja dekat jendela',
          status: 'pending',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '081234567891',
          date: '2024-01-21',
          time: '19:00',
          guests: 2,
          notes: '',
          status: 'confirmed',
          created_at: '2024-01-14T10:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const reservation = reservations.find(r => r.id === id);
      await apiService.reservations.update(id, {
        ...reservation,
        status: newStatus
      });
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) {
      try {
        await apiService.reservations.delete(id);
        fetchReservations();
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.phone.includes(searchTerm);
    const matchesStatus = !statusFilter || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <AdminLayout title="Kelola Reservasi">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kelola Reservasi</h2>
            <p className="text-gray-600">Lihat dan kelola reservasi pelanggan</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-lg font-semibold text-gray-900">
                  {reservations.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Dikonfirmasi</p>
                <p className="text-lg font-semibold text-gray-900">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-lg font-semibold text-gray-900">
                  {reservations.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Dibatalkan</p>
                <p className="text-lg font-semibold text-gray-900">
                  {reservations.filter(r => r.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau nomor telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal & Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Tamu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => {
                    const StatusIcon = statusIcons[reservation.status] || statusIcons.default;
                    return (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Mail size={14} className="mr-1" />
                              {reservation.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone size={14} className="mr-1" />
                              {reservation.phone}
                            </div>
                            {reservation.notes && (
                              <div className="text-sm text-gray-500 mt-1">
                                <strong>Catatan:</strong> {reservation.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Calendar size={16} className="mr-2 text-gray-400" />
                            {formatDate(reservation.date)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock size={16} className="mr-2 text-gray-400" />
                            {formatTime(reservation.time)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Users size={16} className="mr-2 text-gray-400" />
                            {reservation.guests} orang
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[reservation.status] || statusColors.default}`}>
                            {StatusIcon && <StatusIcon size={12} className="mr-1" />}
                            {statusOptions.find(s => s.value === reservation.status)?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col space-y-1">
                            {reservation.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-900 text-xs"
                                >
                                  Konfirmasi
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900 text-xs"
                                >
                                  Batalkan
                                </button>
                              </>
                            )}
                            {reservation.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(reservation.id, 'completed')}
                                className="text-blue-600 hover:text-blue-900 text-xs"
                              >
                                Selesai
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(reservation.id)}
                              className="text-red-600 hover:text-red-900 text-xs"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} sampai{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} dari{' '}
              {pagination.totalItems} reservasi
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;
