import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, ShoppingCart } from 'lucide-react';
import apiService from '../utils/api';

const CoffeeBeansPage = () => {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoffeeBeans = async () => {
      try {
        const response = await apiService.coffeeBeans.getAllPublic();
        setCoffeeBeans(response.data || []);
      } catch (error) {
        console.error('Error fetching coffee beans:', error);
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

    fetchCoffeeBeans();
  }, []);

  const sampleImages = [
    'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
    'https://images.pexels.com/photos/977876/pexels-photo-977876.jpeg',
    'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg',
    'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg',
    'https://images.pexels.com/photos/2711959/pexels-photo-2711959.jpeg',
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Biji Kopi Premium</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
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
            {coffeeBeans.map((bean, index) => (
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
                        Rp {bean.price?.toLocaleString('id-ID') || '0'}
                      </span>
                      {/* <span className="text-sm text-gray-500 ml-1">/ kg</span> */}
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center">
                      <ShoppingCart size={16} className="mr-2" />
                      Pesan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  href="https://wa.me/62XXXXXXXXX"
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