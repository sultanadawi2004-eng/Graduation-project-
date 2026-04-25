import React, { useState, useEffect } from 'react';
import { BsEye, BsClockHistory } from 'react-icons/bs';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = {
    bg: 'var(--admin-bg)',
    card: 'var(--admin-card)',
    primary: 'var(--admin-accent)',
    border: 'var(--admin-border)',
    text: 'var(--admin-text)',
    success: '#38ef7d'  
  };

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Orders Fetch Error:", err);
        setLoading(false);
      });
  }, [theme.bg]);

  const viewOrder = (order) => {
    setSelectedOrder(order);
    setOrderItems([]);
    fetch(`http://127.0.0.1:5000/api/order-items/${order.id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setOrderItems(data);
      })
      .catch(err => {
        console.error("Critical Fetch Error:", err);
        alert("Failed to connect to server. Check if backend is running on port 5000.");
      });
  };

  const closeDetails = () => setSelectedOrder(null);

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', padding: '30px' }}>
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, width: '100%', maxWidth: '500px', borderRadius: '24px', border: `1px solid ${theme.border}`, padding: '30px', position: 'relative' }}>
            <button onClick={closeDetails} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            <h3 style={{ color: theme.primary, margin: '0 0 20px 0', fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem' }}>Order Details #FC-{selectedOrder.id}</h3>
            
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '15px' }}>
              <table width="100%" style={{ borderCollapse: 'collapse', color: theme.text }}>
                <thead>
                  <tr style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Item</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.length > 0 ? orderItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '12px 10px', color: '#fff' }}>{item.item_name}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'right', color: theme.primary }}>£{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        {loading ? 'Fetching details...' : 'No items found for this order.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Total Amount:</span>
                <span style={{ color: theme.primary }}>£{parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
              </div>
            </div>
            <button onClick={closeDetails} style={{ width: '100%', marginTop: '30px', padding: '12px', backgroundColor: theme.primary, color: theme.bg, border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Close Details</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '2.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
            <BsClockHistory color={theme.primary} /> Sales Orders
          </h2>
          <p style={{ color: '#888', marginTop: '8px' }}>Faculty Coffee | Real-time Transaction Records</p>
        </div>
        <button style={{ 
          background: 'none', border: `1px solid ${theme.primary}`, color: theme.primary, 
          padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600',
          transition: '0.3s'
        }}>
          Export PDF Report
        </button>
      </div>

      <div style={{ 
        backgroundColor: theme.card, 
        borderRadius: '20px', 
        border: `1px solid ${theme.border}`, 
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center', color: theme.primary }}>
            RETRIEVING TRANSACTIONS...
          </div>
        ) : (
          <table width="100%" style={{ borderCollapse: 'collapse', color: theme.text }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(45, 41, 38, 0.7)', color: theme.primary }}>
                <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', letterSpacing: '1px' }}>ORDER ID</th>
                <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', letterSpacing: '1px' }}>DATE & TIME</th>
                <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', letterSpacing: '1px' }}>TOTAL AMOUNT</th>
                <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', letterSpacing: '1px' }}>STATUS</th>
                <th style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem', letterSpacing: '1px' }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${theme.border}`, transition: '0.2s' }}>
                  <td style={{ padding: '20px', color: '#fff', fontWeight: 'bold' }}>#FC-{order.id}</td>
                  <td style={{ padding: '20px', color: '#888' }}>
                    {order.created_at ? new Date(order.created_at).toLocaleString('en-GB') : 'N/A'}
                  </td>
                  <td style={{ padding: '20px', color: theme.primary, fontWeight: '700' }}>
                    £{parseFloat(order.total_amount || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                      color: (order.status === 'completed' || order.status === 'ready') ? '#28a745' : '#f59e0b', 
                      backgroundColor: (order.status === 'completed' || order.status === 'ready') ? 'rgba(40, 167, 69, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {order.status ? order.status.toUpperCase() : 'PENDING'}
                    </span>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <button onClick={() => viewOrder(order)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <BsEye color={theme.primary} size={20} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '100px', textAlign: 'center', color: '#555', letterSpacing: '1px' }}>
                    NO TRANSACTIONS FOUND IN DATABASE.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;