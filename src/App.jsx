import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Landing Page Components
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import CoffeeBeansPage from './pages/CoffeeBeansPage';
import MenuPage from './pages/MenuPage';
import ReservationPage from './pages/ReservationPage';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenus from './pages/admin/AdminMenus';
import AdminCoffeeBeans from './pages/admin/AdminCoffeeBeans';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSettings from './pages/admin/AdminSettings';

import './App.css';
import ScrollToTop from './components/ScrollToTop';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 100,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Routes>
          {/* Landing Page Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/galeri" element={<GalleryPage />} />
          <Route path="/biji-kopi" element={<CoffeeBeansPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservasi" element={<ReservationPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<AdminMenus />} />
          <Route path="/admin/biji-kopi" element={<AdminCoffeeBeans />} />
          <Route path="/admin/galeri" element={<AdminGallery />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;