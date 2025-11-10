import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import apiService from '../utils/api';

const CoffeeBeansPage = () => {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [settings, setSettings] = useState({ phone: '' });
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch coffee beans and settings in parallel
        const [coffeeBeansResponse, settingsResponse] = await Promise.all([
          apiService.coffeeBeans.getAllPublic(200),
          apiService.settings.get()
        ]);
        
        setCoffeeBeans(coffeeBeansResponse.data || []);
        setSettings(settingsResponse.data || { phone: '' });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set sample data for demo
        setCoffeeBeans([
          { 
            id: 1, 
            name: 'Arabica Premium', 
            price: 120000, 
            image: null, 
            description: 'Biji kopi arabica premium dengan rasa yang halus dan aroma yang khas. Cocok untuk semua jenis seduhan.',
            origin: 'Aceh Gayo',
            roast_level: 'Medium',
            weight: '1 kg'
          },
          { 
            id: 2, 
            name: 'Robusta Gold', 
            price: 95000, 
            image: null, 
            description: 'Biji kopi robusta dengan kualitas terbaik. Memberikan rasa yang kuat dan kafein yang tinggi.',
            origin: 'Lampung',
            roast_level: 'Dark',
            weight: '1 kg'
          },
          { 
            id: 3, 
            name: 'Kintamani Bali', 
            price: 110000, 
            image: null, 
            description: 'Kopi khas Bali dengan citarasa unik dan aroma floral yang menyegarkan.',
            origin: 'Kintamani, Bali',
            roast_level: 'Light',
            weight: '1 kg'
          },
          { 
            id: 4, 
            name: 'Toraja Sulawesi', 
            price: 130000, 
            image: null, 
            description: 'Kopi legendaris dari tanah Toraja dengan rasa yang kompleks dan berkarakter.',
            origin: 'Toraja, Sulawesi',
            roast_level: 'Medium Dark',
            weight: '1 kg'
          },
          { 
            id: 5, 
            name: 'Java Preanger', 
            price: 105000, 
            image: null, 
            description: 'Kopi dari dataran tinggi Jawa Barat dengan cita rasa yang seimbang.',
            origin: 'Preanger, Jawa Barat',
            roast_level: 'Medium',
            weight: '1 kg'
          },
          { 
            id: 6, 
            name: 'Sumatra Mandheling', 
            price: 115000, 
            image: null, 
            description: 'Kopi sumatra dengan body yang penuh dan after taste yang panjang.',
            origin: 'Mandailing, Sumatra',
            roast_level: 'Medium Dark',
            weight: '1 kg'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sampleImages = [
    'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
    'https://images.pexels.com/photos/977876/pexels-photo-977876.jpeg',
    'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg',
    'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg',
    'https://images.pexels.com/photos/2711959/pexels-photo-2711959.jpeg',
  ];

  // Function to clean phone number and create WhatsApp URL
  const createWhatsAppUrl = (phoneNumber) => {
    if (!phoneNumber) return '#';
    
    // Remove spaces, dashes, and other non-numeric characters except +
    const cleanPhone = phoneNumber.replace(/[\s\-()]/g, '');
    
    // Create WhatsApp URL
    return `https://wa.me/${cleanPhone}`;
  };

  // Function to handle order button click
  const handleOrder = (bean) => {
    const message = `Halo, saya tertarik untuk memesan ${bean.name} dengan harga Rp ${Math.floor(bean.price).toLocaleString('id-ID').replace(/,/g, '.')}. Apakah masih tersedia?`;
    const whatsappUrl = createWhatsAppUrl(settings.phone);
    
    if (whatsappUrl !== '#') {
      const encodedMessage = encodeURIComponent(message);
      window.open(`${whatsappUrl}?text=${encodedMessage}`, '_blank');
    } else {
      alert('Nomor WhatsApp belum dikonfigurasi. Silakan hubungi admin.');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(coffeeBeans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoffeeBeans = coffeeBeans.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Memuat produk biji kopi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-44 pb-12 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Biji Kopi Premium</h1>
            <p className="text-base sm:text-lg text-green-100 max-w-3xl mx-auto">
              Koleksi biji kopi berkualitas tinggi dari berbagai daerah di Indonesia. 
              Pilih yang terbaik untuk dinikmati di rumah
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCoffeeBeans.map((bean, index) => (
              <div 
                key={bean.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div 
                  className="h-64 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${bean.image 
                      ? `https://api-inventory.isavralabel.com/nature-coffee/uploads/${bean.image}`
                      : sampleImages[index % sampleImages.length]
                    })`
                  }}
                ></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{bean.name}</h3>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="ml-1 text-sm text-gray-600">5.0</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {bean.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    {bean.origin && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Asal:</span>
                        <span className="font-medium">{bean.origin}</span>
                      </div>
                    )}
                    {bean.roast_level && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tingkat Roast:</span>
                        <span className="font-medium">{bean.roast_level}</span>
                      </div>
                    )}
                    {bean.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Berat:</span>
                        <span className="font-medium">{bean.weight}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        Rp {bean.price ? Math.floor(bean.price).toLocaleString('id-ID').replace(/,/g, '.') : '0'}
                      </span>
                      {/* <span className="text-sm text-gray-500 ml-1">/ kg</span> */}
                    </div>
                    <button 
                      onClick={() => handleOrder(bean)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Pesan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2" data-aos="fade-up">
              {/* Previous Button */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-primary hover:text-white shadow-md hover:shadow-lg'
                }`}
              >
                <ChevronLeft size={20} className="mr-1" />
                Sebelumnya
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current page
                  const shouldShow = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!shouldShow) {
                    // Show ellipsis for gaps
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-3 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-primary hover:text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-primary hover:text-white shadow-md hover:shadow-lg'
                }`}
              >
                Selanjutnya
                <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          )}

          {/* Pagination Info */}
          {coffeeBeans.length > 0 && (
            <div className="text-center mt-6" data-aos="fade-up">
              <p className="text-gray-600">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, coffeeBeans.length)} dari {coffeeBeans.length} produk
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/5 rounded-2xl p-8" data-aos="fade-up">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cara Memesan Biji Kopi
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Untuk pemesanan biji kopi dalam jumlah besar atau informasi lebih detail, 
                silakan hubungi kami langsung atau datang ke toko kami
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={createWhatsAppUrl(settings.phone)}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  Hubungi WhatsApp
                </a>
                <a 
                  href="https://maps.app.goo.gl/4Yy2bHsHYt3aS9C26?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  Kunjungi Toko
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoffeeBeansPage;