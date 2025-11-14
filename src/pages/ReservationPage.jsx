import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Clock, Users, Phone, Mail, User } from 'lucide-react';
import apiService from '../utils/api';

const getTodayDate = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset();
  today.setMinutes(today.getMinutes() - timezoneOffset);
  return today.toISOString().split('T')[0];
};

const ReservationPage = () => {
  const [formData, setFormData] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    date: getTodayDate(),
    time: '',
    guests: '',
    notes: ''
  }));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    phone: '+62 XXX-XXXX-XXXX',
    email: 'naturecoffeeroastery@gmail.com'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiService.settings.get();
      setSettings({
        phone: response.data.phone || '+62 XXX-XXXX-XXXX',
        email: response.data.email || 'naturecoffeeroastery@gmail.com'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Keep default values if API fails
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to clean phone number and create WhatsApp URL
  const createWhatsAppUrl = (phoneNumber) => {
    if (!phoneNumber) return '#';
    
    // Remove spaces, dashes, and other non-numeric characters except +
    const cleanPhone = phoneNumber.replace(/[\s\-()]/g, '');
    
    // Create WhatsApp URL
    return `https://wa.me/${cleanPhone}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Format reservation message
      const reservationMessage = `Halo, saya ingin membuat reservasi dengan detail sebagai berikut:

 Nama: ${formData.name}
 Email: ${formData.email}
 Telepon: ${formData.phone}
 Tanggal: ${formData.date}
 Waktu: ${formData.time}
 Jumlah Tamu: ${formData.guests} orang
 Catatan: ${formData.notes || 'Tidak ada'}

Mohon konfirmasi ketersediaan meja. Terima kasih!`;

      const whatsappUrl = createWhatsAppUrl(settings.phone);
      
      if (whatsappUrl !== '#') {
        const encodedMessage = encodeURIComponent(reservationMessage);
        window.open(`${whatsappUrl}?text=${encodedMessage}`, '_blank');
        
        setMessage({ 
          type: 'success', 
          text: 'Membuka WhatsApp untuk mengirim reservasi...' 
        });
        
        // Reset form after successful redirect
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: getTodayDate(),
          time: '',
          guests: '',
          notes: ''
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Nomor WhatsApp belum dikonfigurasi. Silakan hubungi admin.' 
        });
      }
    } catch {
      setMessage({ 
        type: 'error', 
        text: 'Terjadi kesalahan. Silakan coba lagi.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-44 pb-12 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Reservasi Meja</h1>
            <p className="text-base sm:text-lg text-green-100 max-w-3xl mx-auto">
              Pastikan meja Anda tersedia dengan melakukan reservasi terlebih dahulu. 
              Nikmati kopi premium dalam suasana yang nyaman
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Reservation Form */}
            <div className="bg-white rounded-xl shadow-lg p-8" data-aos="fade-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Reservasi</h2>
              
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="mr-2" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="mr-2" />
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="08XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="mr-2" />
                      Tanggal
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={getTodayDate()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="mr-2" />
                      Waktu
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Pilih waktu</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Users size={16} className="mr-2" />
                    Jumlah Tamu
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Pilih jumlah tamu</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'orang' : 'orang'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Catatan Khusus (Opsional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Permintaan khusus, alergi makanan, dll."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Membuka WhatsApp...' : 'Kirim via WhatsApp'}
                </button>
              </form>
            </div>

            {/* Information */}
            <div className="space-y-6" data-aos="fade-left">
              {/* Operating Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Jam Operasional</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Senin</span>
                    <span className="text-red-600 font-medium">Tutup</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selasa - Jumat</span>
                    <span className="font-medium">10:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sabtu - Minggu</span>
                    <span className="font-medium">10:00 - 00:00</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Informasi Kontak</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start">
                    <Phone size={18} className="mt-1 mr-3 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p>{settings.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail size={18} className="mt-1 mr-3 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      {settings.email ? (
                        <a 
                          href={`mailto:${settings.email}`}
                          className="text-primary hover:underline"
                        >
                          {settings.email}
                        </a>
                      ) : (
                        <span>naturecoffeeroastery@gmail.com</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Catatan Penting</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Reservasi dapat dibuat minimal 1 hari sebelumnya</li>
                  <li>• Meja akan ditahan selama 30 menit dengan DP 30%</li>
                  <li>• Untuk grup lebih dari 10 orang, silakan hubungi langsung</li>
                  <li>• Reservasi akan dikirim langsung ke WhatsApp admin</li>
                  <li>• Konfirmasi akan diberikan melalui WhatsApp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReservationPage;