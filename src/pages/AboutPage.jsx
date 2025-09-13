import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Award, Heart, Clock } from 'lucide-react';
import AboutUs from '../assets/AboutUs.jpeg'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-44 pb-12 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang Nature Coffee</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Cerita perjalanan kami dalam menghadirkan kopi berkualitas premium 
              dengan suasana yang alami dan nyaman untuk semua pecinta kopi
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tentang Kami
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Nature Coffee lahir dari kecintaan terhadap kopi Indonesia dan keinginan 
                  untuk menciptakan ruang yang nyaman bagi para pecinta kopi. Berlokasi di 
                  jantung kota Samarinda, kami hadir dengan konsep yang menggabungkan 
                  kualitas premium dengan suasana alami.
                </p>
                <p>
                  Sejak didirikan, kami berkomitmen untuk menyajikan kopi terbaik dari 
                  petani lokal pilihan. Setiap cangkir kopi yang kami sajikan adalah hasil 
                  dari proses seleksi ketat dan pengolahan yang penuh perhatian.
                </p>
                <p>
                  Lebih dari sekadar tempat minum kopi, Nature Coffee adalah tempat 
                  berkumpul, bekerja, dan menciptakan momen berharga bersama orang-orang 
                  tercinta. Suasana hijau dan alami di cafe kami dirancang untuk memberikan 
                  ketenangan di tengah hiruk pikuk kota.
                </p>
              </div>
            </div>
            
            <div 
              className="rounded-2xl w-full h-96 bg-cover bg-no-repeat bg-center shadow-lg"
              style={{
                backgroundImage: `url(${AboutUs})`
              }}
              data-aos="fade-left"
            ></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prinsip dan nilai yang menjadi fondasi dalam setiap pelayanan dan produk yang kami tawarkan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Kualitas Premium</h3>
              <p className="text-gray-600">
                Kami tidak pernah berkompromi dengan kualitas. Setiap biji kopi dipilih 
                dengan standar tertinggi untuk memberikan rasa yang sempurna.
              </p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Pelayanan Tulus</h3>
              <p className="text-gray-600">
                Setiap pelanggan adalah keluarga bagi kami. Pelayanan ramah dan tulus 
                adalah prioritas utama dalam setiap interaksi.
              </p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Komunitas</h3>
              <p className="text-gray-600">
                Membangun komunitas pecinta kopi yang solid dan saling mendukung 
                dalam mengapresiasi budaya kopi Indonesia.
              </p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="400">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Konsistensi</h3>
              <p className="text-gray-600">
                Rasa yang konsisten setiap hari, pelayanan yang dapat diandalkan, 
                dan komitmen terhadap kepuasan pelanggan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tim Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berkenalan dengan tim profesional yang berdedikasi memberikan pengalaman kopi terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ahmad Rizki",
                role: "Head Barista",
                image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg"
              },
              {
                name: "Sarah Putri",
                role: "Manager",
                image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg"
              },
              {
                name: "Budi Santoso",
                role: "Coffee Roaster",
                image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg"
              }
            ].map((member, index) => (
              <div 
                key={index}
                className="text-center group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div 
                  className="w-48 h-48 mx-auto rounded-full bg-cover bg-center mb-4 group-hover:scale-105 transition-transform duration-200"
                  style={{ backgroundImage: `url(${member.image})` }}
                ></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

export default AboutPage;