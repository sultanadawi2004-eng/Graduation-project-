import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Plus, Trash2, Calendar, Sparkles } from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    espresso: 'var(--admin-bg)',
    bean: 'var(--admin-card)',
    crema: 'var(--admin-accent)',
    latte: 'var(--admin-text)',
    border: 'var(--admin-border)'
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/offers?t=${Date.now()}`);
        setOffers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [colors.espresso]);

  const formatDate = (dateString) => {
    if (!dateString) return "No Expiry";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ backgroundColor: colors.espresso, minHeight: '100vh', padding: '40px', color: colors.latte }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '2.5rem', fontFamily: 'serif' }}>Marketing Offers</h1>
          <p style={{ color: colors.crema, marginTop: '10px' }}>Manage seasonal coffee promotions</p>
        </div>
        <button style={{ backgroundColor: 'transparent', color: colors.crema, border: `1px solid ${colors.crema}`, padding: '12px 25px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Create Promo
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: colors.crema }}>Loading...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '25px',
          alignItems: 'start'
        }}>
          {offers.length > 0 ? offers.map((offer) => (
            <div key={offer.id} style={{ 
              backgroundColor: colors.bean, 
              borderRadius: '20px', 
              border: `1px solid ${colors.border}`,
              padding: '25px',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <Trash2 size={18} style={{ position: 'absolute', top: '20px', right: '20px', color: '#666', cursor: 'pointer' }} />
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(196,164,132,0.1)', padding: '12px', borderRadius: '12px' }}>
                  <Tag color={colors.crema} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>{offer.product_name}</h3>
                  <div style={{ color: colors.crema, fontSize: '0.9rem', fontWeight: 'bold', marginTop: '4px' }}>
                    <Sparkles size={14} style={{ marginRight: '5px' }} /> {offer.discount_percent}% OFF
                  </div>
                </div>
              </div>

              <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '25px', minHeight: '50px' }}>
                {offer.reason}
              </p>

              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#777', fontSize: '0.85rem' }}>
                <Calendar size={14} />
                <span>Expires: <b style={{ color: colors.crema }}>{formatDate(offer.end_date)}</b></span>
              </div>
            </div>
          )) : (
            <div style={{ color: colors.crema }}>No offers found in the database.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Offers;