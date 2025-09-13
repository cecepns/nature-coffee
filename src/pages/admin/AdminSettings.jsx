import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Save,
  MapPin,
  Phone,
  Globe,
  FileText,
  CheckCircle,
} from 'lucide-react';
import apiService from '../../utils/api';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    about_us: '',
    address: '',
    phone: '',
    instagram: '',
    tiktok: '',
    maps_url: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.settings.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default values
      setSettings({
        about_us: '',
        address: '',
        phone: '',
        instagram: '',
        tiktok: '',
        maps_url: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiService.settings.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Pengaturan">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pengaturan Website</h2>
            <p className="text-gray-600">Kelola informasi dan kontak kafe</p>
          </div>
          {saved && (
            <div className="flex items-center text-green-600">
              <CheckCircle size={20} className="mr-2" />
              <span className="text-sm font-medium">Berhasil disimpan!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* About Us Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FileText className="text-primary mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Tentang Kami</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Kafe
              </label>
              <textarea
                value={settings.about_us}
                onChange={(e) => handleChange('about_us', e.target.value)}
                rows={6}
                placeholder="Ceritakan tentang kafe Anda, sejarah, dan apa yang membuatnya istimewa..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Deskripsi ini akan ditampilkan di halaman &quot;Tentang Kami&quot; website.
              </p>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Phone className="text-primary mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Informasi Kontak</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Alamat
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                  placeholder="Masukkan alamat lengkap kafe..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Contoh: +62 812-3456-7890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Media Sosial & Link</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/naturecoffee"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {/* <Tiktok size={16} className="inline mr-1" /> */}
                  TikTok
                </label>
                <input
                  type="url"
                  value={settings.tiktok}
                  onChange={(e) => handleChange('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@naturecoffee"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe size={16} className="inline mr-1" />
                  Google Maps
                </label>
                <input
                  type="url"
                  value={settings.maps_url}
                  onChange={(e) => handleChange('maps_url', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Link Google Maps untuk menampilkan lokasi kafe.
                </p>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Informasi</h3>
            <div className="space-y-3">
              {settings.about_us && (
                <div>
                  <h4 className="font-medium text-gray-700">Tentang Kami:</h4>
                  <p className="text-gray-600 text-sm">{settings.about_us}</p>
                </div>
              )}
              
              {settings.address && (
                <div>
                  <h4 className="font-medium text-gray-700">Alamat:</h4>
                  <p className="text-gray-600 text-sm">{settings.address}</p>
                </div>
              )}
              
              {settings.phone && (
                <div>
                  <h4 className="font-medium text-gray-700">Telepon:</h4>
                  <p className="text-gray-600 text-sm">{settings.phone}</p>
                </div>
              )}
              
              {settings.instagram && (
                <div>
                  <h4 className="font-medium text-gray-700">Instagram:</h4>
                  <a 
                    href={settings.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {settings.instagram}
                  </a>
                </div>
              )}

              {settings.tiktok && (
                <div>
                  <h4 className="font-medium text-gray-700">TikTok:</h4>
                  <a 
                    href={settings.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {settings.tiktok}
                  </a>
                </div>
              )}
              
              {settings.maps_url && (
                <div>
                  <h4 className="font-medium text-gray-700">Google Maps:</h4>
                  <a 
                    href={settings.maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Lihat di Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save size={20} className="mr-2" />
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
