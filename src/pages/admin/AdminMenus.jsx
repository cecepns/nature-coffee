import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload,
  Search,
  Filter,
  X
} from 'lucide-react';
import apiService from '../../utils/api';

const AdminMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    image: '',
    is_available: true
  });

  const categories = ['coffee', 'food', 'dessert', 'beverage'];

  useEffect(() => {
    fetchMenus();
  }, [pagination.currentPage, searchTerm, filterCategory]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await apiService.menu.getAll(pagination.currentPage, pagination.itemsPerPage);
      setMenus(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching menus:', error);
      // Set sample data for demo
      setMenus([
        {
          id: 1,
          name: 'Espresso',
          description: 'Kopi espresso berkualitas tinggi',
          price: 15000,
          category: 'coffee',
          image: null,
          is_available: true,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Cappuccino',
          description: 'Cappuccino dengan foam yang sempurna',
          price: 20000,
          category: 'coffee',
          image: null,
          is_available: true,
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
      if (editingMenu) {
        await apiService.menu.update(editingMenu.id, formData);
      } else {
        await apiService.menu.create(formData);
      }
      setShowModal(false);
      setEditingMenu(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'coffee',
        image: '',
        is_available: true
      });
      fetchMenus();
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category,
      image: menu.image || '',
      is_available: menu.is_available
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        await apiService.menu.delete(id);
        fetchMenus();
      } catch (error) {
        console.error('Error deleting menu:', error);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await apiService.menu.uploadImage(formData);
        setFormData(prev => ({ ...prev, image: response.filename }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || menu.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout title="Kelola Menu">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kelola Menu</h2>
            <p className="text-gray-600">Tambah, edit, dan hapus menu kafe</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Tambah Menu
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Menu List */}
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
                      Menu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
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
                  {filteredMenus.map((menu) => (
                    <tr key={menu.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {menu.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={`https://api-inventory.isavralabel.com/nature-coffee/uploads/${menu.image}`}
                                alt={menu.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {menu.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {menu.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp {menu.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          menu.is_available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {menu.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(menu)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(menu.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
              {pagination.totalItems} menu
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
                {editingMenu ? 'Edit Menu' : 'Tambah Menu'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingMenu(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'coffee',
                    image: '',
                    is_available: true
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
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  Harga
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formData.image && (
                  <p className="text-sm text-green-600 mt-1">Gambar berhasil diupload</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
                  Tersedia
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingMenu(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: 'coffee',
                      image: '',
                      is_available: true
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
                  {editingMenu ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMenus;
