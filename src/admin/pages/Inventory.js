import React, { useState, useEffect } from 'react';
import { BsBoxSeam, BsPlusLg } from 'react-icons/bs';
import { Coffee, AlertCircle, CheckCircle2 } from 'lucide-react';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    espresso: 'var(--admin-bg)',
    bean: 'var(--admin-card)',
    crema: 'var(--admin-accent)',
    latte: 'var(--admin-text)',
    border: 'var(--admin-border)'
  };

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/inventory')
      .then(res => res.json())
      .then(data => {
        setInventory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Inventory Fetch Error:", err);
        setLoading(false);
      });
  }, [colors.espresso]);

  return (
    <div className="dashboard-fade-in" style={{ color: colors.latte, backgroundColor: colors.espresso, minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', margin: 0, fontSize: '2rem' }}>
            <BsBoxSeam size={30} color={colors.crema} /> 
            Inventory Management
          </h2>
          <p style={{ color: '#888', marginTop: '8px' }}>Track stock levels and raw material resources.</p>
        </div>
        <button style={{ 
          backgroundColor: colors.crema, 
          border: 'none', 
          color: colors.espresso, 
          padding: '12px 25px', 
          borderRadius: '12px', 
          fontWeight: 'bold', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          boxShadow: '0 4px 15px rgba(196, 164, 132, 0.2)',
          transition: '0.3s'
        }}>
          <BsPlusLg /> Add Stock Item
        </button>
      </div>

      <div style={{ 
        backgroundColor: colors.bean, 
        borderRadius: '20px', 
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: colors.crema }}>
            <Coffee className="animate-spin" size={30} style={{ marginBottom: '15px' }} />
            <p style={{ letterSpacing: '1.5px' }}>CHECKING PANTRY...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(45, 41, 38, 0.7)', color: colors.crema }}>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Material Name</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quantity</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Unit</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Threshold</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length > 0 ? inventory.map((item) => {
                  const isLow = item.quantity <= item.min_threshold;
                  return (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}`, transition: '0.3s' }}>
                      <td style={{ padding: '20px' }}>
                        <strong style={{ color: '#fff', fontSize: '1rem' }}>{item.item_name}</strong>
                      </td>
                      <td style={{ padding: '20px', color: isLow ? '#e74a3b' : colors.latte, fontWeight: 'bold' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '20px', color: '#888' }}>{item.unit || 'units'}</td>
                      <td style={{ padding: '20px', color: '#888' }}>{item.min_threshold}</td>
                      <td style={{ padding: '20px' }}>
                        {item.quantity <= 0 ? (
                          <div style={{ 
                            color: '#e74a3b', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            backgroundColor: 'rgba(231, 74, 59, 0.1)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            width: 'fit-content',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            border: '1px solid rgba(231, 74, 59, 0.2)'
                          }}>
                            <AlertCircle size={14} /> OUT OF STOCK
                          </div>
                        ) : item.quantity <= item.min_threshold ? (
                          <div style={{ 
                            color: '#f59e0b', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            width: 'fit-content',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                          }}>
                            <AlertCircle size={14} /> ALMOST OUT
                          </div>
                        ) : (
                          <div style={{ 
                            color: '#28a745', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            backgroundColor: 'rgba(40, 167, 69, 0.1)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            width: 'fit-content',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            border: '1px solid rgba(40, 167, 69, 0.2)'
                          }}>
                            <CheckCircle2 size={14} /> AVAILABLE
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#555', letterSpacing: '1px' }}>
                      NO INVENTORY DATA AVAILABLE.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;