import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { X } from 'lucide-react';
import apiService from '../utils/api';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await apiService.gallery.getAllPublic();
        setGalleryItems(response.data || []);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        // Set sample data for demo
        setGalleryItems([
          { id: 1, title: 'Interior Cozy', image: null, description: 'Suasana interior yang nyaman' },
          { id: 2, title: 'Latte Art', image: null, description: 'Karya seni dalam secangkir kopi' },
          { id: 3, title: 'Coffee Beans', image: null, description: 'Biji kopi premium pilihan' },
          { id: 4, title: 'Outdoor Seating', image: null, description: 'Tempat duduk outdoor yang asri' },
          { id: 5, title: 'Barista Action', image: null, description: 'Barista sedang beraksi' },
          { id: 6, title: 'Morning Light', image: null, description: 'Suasana pagi yang hangat' },
          { id: 7, title: 'Coffee Culture', image: null, description: 'Budaya kopi Indonesia' },
          { id: 8, title: 'Friends Gathering', image: null, description: 'Berkumpul bersama teman' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const sampleImages = [
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
    'https://images.pexels.com/photos/977876/pexels-photo-977876.jpeg',
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
  ];

  const openLightbox = (item, index) => {
    setSelectedImage({
      ...item,
      image: item.image ? `https://api-inventory.isavralabel.com/nature-coffee/uploads/${item.image}` : sampleImages[index % sampleImages.length]
    });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Memuat galeri...</p>
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Galeri Nature Coffee</h1>
            <p className="text-base sm:text-lg text-green-100 max-w-3xl mx-auto">
              Jelajahi momen-momen indah dan suasana nyaman di Nature Coffee 
              melalui koleksi foto kami
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map((item, index) => (
              <div 
                key={item.id}
                className="group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 50}
                onClick={() => openLightbox(item, index)}
              >
                <div className="relative">
                  <div 
                    className="h-64 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundImage: `url(${item.image 
                        ? `https://api-inventory.isavralabel.com/nature-coffee/uploads/${item.image}`
                        : sampleImages[index % sampleImages.length]
                      })`
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-200">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button 
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-200">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;