import { useState, useEffect } from 'react';
import { menuCategories, featuredItems } from '../data/shopData';
import { useReveal } from '../hooks/useReveal';
import { useCart } from '../context/CartContext';
import styles from './Menu.module.css';

function Tags({ tags = [] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={styles.tags}>
      {tags.includes('vegan')      && <span className="tag-vegan"><i className="fas fa-leaf" /> Vegan</span>}
      {tags.includes('vegetarian') && <span className="tag-veg"><i className="fas fa-seedling" /> Veggie</span>}
      {tags.includes('seasonal')   && <span className={styles.tagSeasonal}><i className="fas fa-star" /> Seasonal</span>}
    </div>
  );
}

function parsePrice(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0;
}

export default function Menu() {
  const [headerRef, headerVis] = useReveal();
  const [featRef,   featVis]   = useReveal();
  const [fullRef,   fullVis]   = useReveal();
  const [activeTab, setActiveTab] = useState(menuCategories[0].id);
  const { addItem } = useCart();

  const [dbItems, setDbItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/products');
        const data = await response.json();
        if (Array.isArray(data)) {
          setDbItems(data);
        } else {
          console.error('API returned non-array data:', data);
          setDbItems([]);
        }
      } catch (error) {
        console.error('Menu fetch error:', error);
        setDbItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const activeCatItems = dbItems
    .filter(item => item.category === activeTab || item.category_id === activeTab)
    .map(item => ({
      ...item,
      displayPrice: `£${parsePrice(item.price_num || item.price).toFixed(2)}`,
      tags: item.tags ? (typeof item.tags === 'string' ? item.tags.split(',') : item.tags) : [],
    }));

  const activeCat = menuCategories.find(c => c.id === activeTab);
  const itemsToShow = activeCatItems.length > 0 ? activeCatItems : (activeCat?.items || []);

  function handleAddItem(item) {
    addItem({
      id: item.id,
      name: item.name,
      price: item.displayPrice || item.price_num || item.price,
      priceNum: parsePrice(item.price_num || item.price),
    });
  }

  return (
    <section className={styles.menu} id="menu">
      <div ref={headerRef} className={`section-wrap ${styles.header} reveal ${headerVis ? 'vis' : ''}`}>
        <div className="label">What We Serve</div>
        <div className="divider" />
        <h2 className="h2" style={{ color: 'var(--espresso)' }}>Our Menu</h2>
      </div>

      <div ref={featRef} className={`section-wrap ${styles.featuredGrid} reveal ${featVis ? 'vis' : ''}`}>
        {featuredItems.map((item) => (
          <FeaturedCard key={item.id} item={item} onAdd={() => handleAddItem(item)} />
        ))}
      </div>

      <div ref={fullRef} className={`section-wrap ${styles.fullMenu} reveal ${fullVis ? 'vis' : ''}`}>
        <div className={styles.tabBar}>
          {menuCategories.map(cat => {
            const isActive = activeTab === cat.id;
            return (
              <button 
                key={cat.id} 
                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`} 
                onClick={() => setActiveTab(cat.id)}
                style={isActive ? { background: cat.color, color: '#fff', borderColor: cat.color } : { borderColor: cat.color }}
              >
                <i className={`fas ${cat.icon}`} /> {cat.label}
              </button>
            );
          })}
        </div>

        <div className={styles.itemList}>
          {loading ? (
            <div className={styles.loader}>Loading our finest beans...</div>
          ) : itemsToShow.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemLeft}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemDesc}>{item.desc || item.description}</div>
                <Tags tags={item.tags} />
              </div>
              <div className={styles.itemRight}>
                <div className={styles.itemPrice}>{item.displayPrice || item.price}</div>
                <button className={styles.addBtnSmall} onClick={() => handleAddItem(item)}>
                  <i className="fas fa-plus" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ item, onAdd }) {
  return (
    <div className={styles.featCard} onClick={onAdd}>
      <div className={styles.featImg}>
        <img src={item.image} alt={item.name} />
        {item.tag && <span className={styles.featBadge}>{item.tag}</span>}
      </div>
      <div className={styles.featBody}>
        <h3 className={styles.featName}>{item.name}</h3>
        <div className={styles.featFooter}>
          <span className={styles.featPrice}>{item.price}</span>
          <button className={styles.featAddBtn}>Add</button>
        </div>
      </div>
    </div>
  );
}