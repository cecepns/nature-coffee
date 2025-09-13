import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Leaf, Users, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiService from '../utils/api';

const LandingPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        const [menuData, coffeeData] = await Promise.all([
          apiService.menu.getAllPublic(6),
          apiService.coffeeBeans.getAllPublic(6)
        ]);
        setMenuItems(menuData.data || []);
        setCoffeeBeans(coffeeData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set sample data for demo
        setMenuItems([
          { id: 1, name: 'Espresso', price: 25000, image: null, description: 'Classic espresso shot' },
          { id: 2, name: 'Cappuccino', price: 35000, image: null, description: 'Creamy cappuccino' },
          { id: 3, name: 'Latte', price: 40000, image: null, description: 'Smooth coffee latte' },
          { id: 4, name: 'Americano', price: 30000, image: null, description: 'Black coffee americano' },
          { id: 5, name: 'Mocha', price: 45000, image: null, description: 'Chocolate coffee mocha' },
          { id: 6, name: 'Macchiato', price: 38000, image: null, description: 'Caramel macchiato' },
        ]);
        setCoffeeBeans([
          { id: 1, name: 'Arabica Premium', price: 120000, image: null, description: 'Premium arabica beans' },
          { id: 2, name: 'Robusta Gold', price: 95000, image: null, description: 'Golden robusta beans' },
          { id: 3, name: 'Kintamani', price: 110000, image: null, description: 'Bali kintamani beans' },
          { id: 4, name: 'Toraja', price: 130000, image: null, description: 'Sulawesi toraja beans' },
          { id: 5, name: 'Java', price: 105000, image: null, description: 'Java premium beans' },
          { id: 6, name: 'Sumatra', price: 115000, image: null, description: 'Sumatra blend beans' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg)'
          }}
        ></div>
        
        <div className="relative md:pt-24 z-10 max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Nature Coffee
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Rasakan Kopi Premium di Suasana yang Alami dan Nyaman
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/menu"
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-200"
            >
              Lihat Menu
            </Link>
            <Link 
              to="/reservasi"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
            >
              Reservasi Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Nature Coffee?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman kopi terbaik dengan bahan premium dan suasana yang nyaman
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kopi Premium</h3>
              <p className="text-gray-600">Biji kopi pilihan dari petani lokal terbaik dengan kualitas premium</p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suasana Alami</h3>
              <p className="text-gray-600">Nikmati kopi di tengah suasana hijau dan alami yang menenangkan</p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pelayanan Ramah</h3>
              <p className="text-gray-600">Tim barista profesional siap melayani dengan ramah dan berpengalaman</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12" data-aos="fade-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Menu Favorit</h2>
              <p className="text-lg text-gray-600">Cicipi menu andalan kami yang selalu menjadi favorit</p>
            </div>
            <Link 
              to="/menu"
              className="flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-200"
            >
              Lihat Semua
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <div 
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div 
                  className="h-64 bg-gray-200 bg-cover bg-center"
                  style={{
                    backgroundImage: item.image 
                      ? `url(https://api-inventory.isavralabel.com/nature-coffee/uploads/${item.image})`
                      : 'url(https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg)'
                  }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      Rp {item.price?.toLocaleString('id-ID') || '0'}
                    </span>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="ml-1 text-sm text-gray-600">5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee Beans Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12" data-aos="fade-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Biji Kopi Premium</h2>
              <p className="text-lg text-gray-600">Bawa pulang biji kopi berkualitas tinggi untuk dinikmati di rumah</p>
            </div>
            <Link 
              to="/biji-kopi"
              className="flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-200"
            >
              Lihat Semua
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coffeeBeans.map((bean, index) => (
              <div 
                key={bean.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div 
                  className="h-48 bg-gray-200 bg-cover bg-center"
                  style={{
                    backgroundImage: bean.image 
                      ? `url(https://api-inventory.isavralabel.com/nature-coffee/uploads/${bean.image})`
                      : 'url(https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg)'
                  }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{bean.name}</h3>
                  <p className="text-gray-600 mb-4">{bean.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      Rp {bean.price?.toLocaleString('id-ID') || '0'}
                    </span>
                    <span className="text-sm text-gray-500">per kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;