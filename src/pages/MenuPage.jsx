import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star } from 'lucide-react';
import apiService from '../utils/api';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await apiService.menu.getAllPublic();
        setMenuItems(response.data || []);
      } catch (error) {
        console.error('Error fetching menu:', error);
        // Set sample data for demo
        setMenuItems([
          { id: 1, name: 'Espresso', price: 25000, image: null, description: 'Single shot espresso dengan crema yang sempurna', category: 'coffee' },
          { id: 2, name: 'Cappuccino', price: 35000, image: null, description: 'Espresso dengan steamed milk dan milk foam', category: 'coffee' },
          { id: 3, name: 'Latte', price: 40000, image: null, description: 'Espresso dengan steamed milk yang lembut', category: 'coffee' },
          { id: 4, name: 'Americano', price: 30000, image: null, description: 'Espresso dengan air panas, rasa kopi murni', category: 'coffee' },
          { id: 5, name: 'Mocha', price: 45000, image: null, description: 'Perpaduan espresso, chocolate, dan steamed milk', category: 'coffee' },
          { id: 6, name: 'Macchiato', price: 38000, image: null, description: 'Espresso dengan sedikit steamed milk', category: 'coffee' },
          { id: 7, name: 'Croissant', price: 25000, image: null, description: 'Croissant butter yang renyah dan lembut', category: 'food' },
          { id: 8, name: 'Sandwich Club', price: 45000, image: null, description: 'Sandwich dengan chicken, lettuce, tomato, dan mayo', category: 'food' },
          { id: 9, name: 'Pasta Carbonara', price: 55000, image: null, description: 'Pasta dengan creamy carbonara sauce', category: 'food' },
          { id: 10, name: 'Chocolate Cake', price: 35000, image: null, description: 'Kue coklat lembut dengan frosting krim', category: 'dessert' },
          { id: 11, name: 'Ice Matcha Latte', price: 42000, image: null, description: 'Matcha latte dingin dengan es batu', category: 'non-coffee' },
          { id: 12, name: 'Fresh Orange Juice', price: 25000, image: null, description: 'Jus jeruk segar tanpa gula tambahan', category: 'non-coffee' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = [
    { id: 'all', name: 'Semua Menu' },
    { id: 'coffee', name: 'Kopi' },
    { id: 'non-coffee', name: 'Non-Kopi' },
    { id: 'food', name: 'Makanan' },
    { id: 'dessert', name: 'Dessert' },
  ];

  const filteredMenu = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const sampleImages = [
    'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
    'https://images.pexels.com/photos/977876/pexels-photo-977876.jpeg',
    'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg',
    'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Memuat menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-44 pb-12 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Menu Nature Coffee</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Jelajahi berbagai pilihan kopi premium, makanan lezat, dan minuman segar 
              yang tersedia di Nature Coffee
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center" data-aos="fade-up">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((item, index) => (
              <div 
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${item.image 
                      ? `https://api-inventory.isavralabel.com/nature-coffee/uploads/${item.image}`
                      : sampleImages[index % sampleImages.length]
                    })`
                  }}
                ></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="ml-1 text-sm text-gray-600">5.0</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-primary">
                      Rp {item.price?.toLocaleString('id-ID') || '0'}
                    </span>
                    {/* <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200">
                      Pesan
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMenu.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Tidak ada menu dalam kategori ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* Order Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/5 rounded-2xl p-8" data-aos="fade-up">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cara Memesan
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Kunjungi langsung toko kami atau hubungi untuk pemesanan takeaway. 
                Nikmati cita rasa kopi premium Nature Coffee
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://wa.me/62XXXXXXXXX"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  Pesan via WhatsApp
                </a>
                <a 
                  href="/reservasi"
                  className="border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  Reservasi Meja
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

export default MenuPage;