import { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import { shopInfo } from '../data/shopData';
import styles from './Careers.module.css';

const ICON_MAP = {
  'Barista':           'fa-mug-hot',
  'Kitchen Assistant': 'fa-bread-slice',
  'Front of House':    'fa-users',
};

function getIcon(title) {
  return ICON_MAP[title] || 'fa-briefcase';
}

export default function Careers() {
  const [headerRef, headerVis] = useReveal();
  const [bodyRef,   bodyVis]   = useReveal();

  const [roles,   setRoles]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/careers');
        const data = await response.json();
        
        if (data && data.length > 0) {
          setRoles(data);
        }
      } catch (error) {
        console.error('Error fetching careers from backend:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  const handleApply = () => {
    window.location.href = `mailto:${shopInfo.careersEmail}?subject=Application for Faculty Coffee&body=Hi Faculty Coffee team,%0A%0AI'm interested in joining your team.`;
  };

  return (
    <section className={styles.careers} id="careers">
      <div className="section-wrap">
        <div ref={headerRef} className={`${styles.header} reveal ${headerVis ? 'vis' : ''}`}>
          <div className="label">Work With Us</div>
          <div className="divider" />
          <h2 className="h2">Join Our Team</h2>
        </div>

        <div ref={bodyRef} className={`${styles.body} reveal ${bodyVis ? 'vis' : ''}`}>
          <div className={styles.left}>
            <p className={styles.intro}>
              Faculty Coffee is always on the lookout for passionate individuals who share our love for specialty coffee and hospitality.
            </p>
            <div className={styles.applyBox}>
              <span className={styles.applyText}>Send your CV to</span>
              <a href={`mailto:${shopInfo.careersEmail}`} className={styles.applyEmail}>
                <i className="fas fa-envelope" /> {shopInfo.careersEmail}
              </a>
              <button className="btn btn-primary" onClick={handleApply} style={{ marginTop: '.5rem' }}>
                <i className="fas fa-paper-plane" /> Apply Now
              </button>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.rolesLabel}>Current Areas of Interest</div>

            {loading ? (
              <p style={{ opacity: 0.6 }}>Loading available roles...</p>
            ) : roles.length === 0 ? (
               <p style={{ opacity: 0.6 }}>No open positions at the moment.</p>
            ) : roles.map(r => (
              <div key={r.id} className={styles.roleCard}>
                <div className={styles.roleIcon}>
                  <i className={`fas ${r.icon || getIcon(r.title)}`} />
                </div>
                <div>
                  <div className={styles.roleTitle}>{r.title}</div>
                  <div className={styles.roleType}>{r.type}</div>
                </div>
                <button className={styles.roleBtn} onClick={handleApply} aria-label="Apply for this role">
                  <i className="fas fa-arrow-right" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}