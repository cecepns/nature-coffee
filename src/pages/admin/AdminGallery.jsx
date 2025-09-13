import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Search,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import apiService from '../../utils/api';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    is_active: true
  });

  useEffect(() => {
    fetchGallery();
  }, [pagination.currentPage, searchTerm]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await apiService.gallery.getAll(pagination.currentPage, pagination.itemsPerPage);
      setGallery(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      // Set sample data for demo
      setGallery([
        {
          id: 1,
          title: 'Interior Kafe',
          description: 'Suasana nyaman di dalam kafe',
          image: null,
          is_active: true,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Menu Spesial',
          description: 'Menu kopi spesial hari ini',
          image: null,
          is_active: true,
          created_at: '2024-01-14T10:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await apiService.gallery.update(editingItem.id, formData);
      } else {
        await apiService.gallery.create(formData);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        is_active: true
      });
      fetchGallery();
    } catch (error) {
      console.error('Error saving gallery item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image: item.image || '',
      is_active: item.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) {
      try {
        await apiService.gallery.delete(id);
        fetchGallery();
      } catch (error) {
        console.error('Error deleting gallery item:', error);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await apiService.gallery.uploadImage(formData);
        setFormData(prev => ({ ...prev, image: response.filename }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const filteredGallery = gallery.filter(item => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout title="Kelola Galeri">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kelola Galeri</h2>
            <p className="text-gray-600">Tambah, edit, dan hapus foto galeri</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Tambah Foto
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari foto galeri..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="w-full h-44">
                      {item.image ? (
                        <img
                          className="w-full h-full object-cover"
                          src={`https://api-inventory.isavralabel.com/nature-coffee/uploads/${item.image}`}
                          alt={item.title}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredGallery.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Upload size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada foto galeri</h3>
                  <p className="text-gray-500">Mulai dengan menambahkan foto pertama Anda</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} sampai{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} dari{' '}
              {pagination.totalItems} foto
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  setFormData({
                    title: '',
                    description: '',
                    image: '',
                    is_active: true
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Foto
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required={!editingItem}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formData.image && (
                  <p className="text-sm text-green-600 mt-1">Foto berhasil diupload</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Tampilkan di galeri publik
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({
                      title: '',
                      description: '',
                      image: '',
                      is_active: true
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  {editingItem ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGallery;
