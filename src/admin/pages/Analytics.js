import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, ShoppingBag, DollarSign, ArrowUpRight, BarChart3 } from 'lucide-react';
import styles from './Dashboard.module.css';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);

  const theme = {
    crema: 'var(--admin-accent)',
    espresso: 'var(--admin-bg)',
    card: 'var(--admin-card)',
    text: 'var(--admin-text)',
    border: 'var(--admin-border)'
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/dashboard-stats');
        setStats(res.data.data);
      } catch (err) {
        console.error("Analytics Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Revenue', value: `£${parseFloat(stats.totalSales).toLocaleString()}`, icon: DollarSign, color: '#38ef7d', desc: '+12% from last month' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: theme.crema, desc: 'Across all categories' },
    { title: 'Avg Order Value', value: `£${(stats.totalSales / (stats.totalOrders || 1)).toFixed(2)}`, icon: TrendingUp, color: '#4facfe', desc: 'Per transaction' },
    { title: 'Active Products', value: stats.totalProducts, icon: BarChart3, color: '#f093fb', desc: 'In current menu' },
  ];

  if (loading) return <div style={{ color: theme.crema, padding: '40px' }}>Loading Analytics...</div>;

  return (
    <div className={styles.page} style={{ backgroundColor: theme.espresso, minHeight: '80vh' }}>
      <div className={styles.header} style={{ marginBottom: '40px' }}>
        <h2 className={styles.title} style={{ color: '#fff', fontSize: '2rem', fontWeight: '800' }}>
          Business Analytics
        </h2>
        <p style={{ color: theme.crema, opacity: 0.8 }}>Deep dive into Faculty Coffee performance metrics</p>
      </div>

      <div className={styles.statsRow} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {cards.map((c, i) => (
          <div key={i} style={{ 
            backgroundColor: theme.card, 
            padding: '25px', 
            borderRadius: '20px', 
            border: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: `${c.color}15`, color: c.color, padding: '12px', borderRadius: '12px' }}>
                <c.icon size={24} />
              </div>
              <span style={{ color: '#38ef7d', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                {c.desc} <ArrowUpRight size={14} />
              </span>
            </div>
            <div>
              <p style={{ color: theme.text, opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{c.title}</p>
              <h3 style={{ color: '#fff', fontSize: '1.8rem', margin: '5px 0 0', fontWeight: '800' }}>{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}`, minHeight: '300px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Performance Overview</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '15px', paddingBottom: '20px' }}>
             {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: i === 6 ? theme.crema : `${theme.crema}33`, height: `${h}%`, borderRadius: '8px', transition: '0.3s' }}></div>
             ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.text, opacity: 0.5, fontSize: '0.7rem' }}>
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </div>

        <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}` }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Efficiency</h3>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `8px solid ${theme.crema}`, borderTopColor: 'transparent', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>94%</span>
            </div>
            <p style={{ color: theme.text, fontSize: '0.9rem' }}>Service Optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
