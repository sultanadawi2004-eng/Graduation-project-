import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './styles/global.css';

import { CartProvider }   from './context/CartContext';
import Navbar             from './components/Navbar';
import Hero               from './components/Hero';
import Menu               from './components/Menu';
import Gallery            from './components/Gallery';
import About              from './components/About';
import Careers            from './components/Careers';
import Contact            from './components/Contact';
import Footer             from './components/Footer';
import Chatbot            from './components/Chatbot';
import Cart               from './components/Cart';
import Checkout           from './components/Checkout';
import LoadingScreen      from './components/LoadingScreen';

import { AdminProvider }  from './admin/AdminContext';
import AdminRoute         from './admin/AdminRoute';
import AdminLogin         from './admin/AdminLogin';
import AdminLayout        from './admin/AdminLayout';
import Dashboard          from './admin/pages/Dashboard';
import Orders             from './admin/pages/Orders';
import Products           from './admin/pages/Products';
import Analytics          from './admin/pages/Analytics';
import Inventory          from './admin/pages/Inventory';
import Offers             from './admin/pages/Offers';
import AIAssistant        from './admin/pages/AIAssistant';

let LenisClass = null;
try { LenisClass = require('@studio-freight/lenis').default; } catch (_) {}

function PublicSite() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!LenisClass) return;
    const lenis = new LenisClass({ 
      duration: 1.25, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true, 
      wheelMultiplier: 0.9 
    });
    
    function raf(time) { 
      lenis.raf(time); 
      requestAnimationFrame(raf); 
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="public-site-wrapper" style={{ minHeight: '100vh' }}>
      <LoadingScreen onComplete={() => setLoaded(true)} />
      
      <div id="scroll-progress" />
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
      
      <Navbar onCartOpen={() => { setCartOpen(true); setCheckoutOpen(false); }} />
      
      <main>
        <Hero />
        <Menu />
        <Gallery />
        <About />
        <Careers />
        <Contact />
      </main>

      <Footer />
      <Chatbot />

      {cartOpen && (
        <Cart 
          onClose={() => setCartOpen(false)} 
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} 
        />
      )}
      {checkoutOpen && (
        <Checkout 
          onClose={() => { setCartOpen(false); setCheckoutOpen(false); }} 
          onBack={() => { setCheckoutOpen(false); setCartOpen(true); }} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<PublicSite />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"    element={<Dashboard />} />
              <Route path="orders"       element={<Orders />} />
              <Route path="products"     element={<Products />} />
              <Route path="analytics"    element={<Analytics />} />
              <Route path="inventory"    element={<Inventory />} />
              <Route path="offers"       element={<Offers />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}