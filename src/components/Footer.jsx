import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Instagram, MapPin, Phone } from 'lucide-react';
import apiService from '../utils/api';

const TikTokIcon = ({ size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M21 8.5c-2.13 0-4.06-.75-5.6-1.99v7.46c0 4.08-3.31 7.4-7.4 7.4S.6 18.05.6 13.97c0-3.7 2.62-6.8 6.09-7.33v3.12a3.71 3.71 0 0 0-2.62 3.54c0 2.05 1.67 3.72 3.72 3.72s3.72-1.67 3.72-3.72V2h3.48c.34 3.02 2.77 5.4 5.9 5.62v2.88h.11Z" />
  </svg>
);

TikTokIcon.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiService.settings.get();
        if (mounted) setSettings(res.data);
      } catch {
        if (mounted) setSettings(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Nature Coffee</h3>
            <p className="text-green-100 mb-6">
              Nikmati kopi berkualitas premium di suasana yang nyaman dan alami.
            </p>
            <div className="flex space-x-4">
              {settings?.instagram && (
                <a 
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                >
                  <Instagram size={20} className="text-green-700" />
                </a>
              )}
              {settings?.tiktok && (
                <a 
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                >
                  <TikTokIcon size={20} className="text-green-700" />
                </a>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
            <div className="space-y-3 text-green-100">
              <div className="flex items-start">
                <MapPin size={20} className="mt-1 mr-3 flex-shrink-0" />
                <p>Jl. Pemuda 2 No.84, Temindung Permai, Kec. Sungai Pinang, Kota Samarinda, Kalimantan Timur 75119</p>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="mr-3" />
                <span>+62 XXX-XXXX-XXXX</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Jam Operasional</h4>
            <div className="space-y-2 text-green-100">
              <div className="flex justify-between">
                <span>Senin</span>
                <span>Tutup</span>
              </div>
              <div className="flex justify-between">
                <span>Selasa - Jumat</span>
                <span>10:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu - Minggu</span>
                <span>10:00 - 00:00</span>
              </div>
            </div>
            <div className="mt-4">
              <a 
                href={settings?.maps_url || 'https://maps.app.goo.gl/4Yy2bHsHYt3aS9C26?g_st=aw'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-primary px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                <MapPin size={16} className="mr-2" />
                Lihat di Maps
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-100">
          <p>&copy; 2024 Nature Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;