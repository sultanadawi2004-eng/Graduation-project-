import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Coffee } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    espresso: 'var(--admin-bg)',
    bean: 'var(--admin-card)',
    crema: 'var(--admin-accent)',
    latte: 'var(--admin-text)',
    border: 'var(--admin-border)'
  };

  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', price_num: '', description: '', available: 1 });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      price_num: product.price_num,
      description: product.description,
      available: product.available ?? 1
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/products/${editingProduct.id}`, editFormData);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Error updating product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Error deleting product");
      }
    }
  };

  return (
    <div className="dashboard-fade-in" style={{ backgroundColor: colors.espresso, minHeight: '100vh', padding: '30px' }}>
      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: colors.bean, width: '100%', maxWidth: '500px', borderRadius: '24px', border: `1px solid ${colors.border}`, padding: '30px' }}>
            <h3 style={{ color: colors.crema, margin: '0 0 20px 0' }}>Edit Product</h3>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" value={editFormData.name} 
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                placeholder="Product Name"
                style={{ padding: '12px', borderRadius: '10px', backgroundColor: colors.espresso, border: `1px solid ${colors.border}`, color: '#fff' }}
              />
              <input 
                type="number" step="0.01" value={editFormData.price_num} 
                onChange={(e) => setEditFormData({...editFormData, price_num: e.target.value})}
                placeholder="Price (£)"
                style={{ padding: '12px', borderRadius: '10px', backgroundColor: colors.espresso, border: `1px solid ${colors.border}`, color: '#fff' }}
              />
              <textarea 
                value={editFormData.description} 
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                placeholder="Description"
                style={{ padding: '12px', borderRadius: '10px', backgroundColor: colors.espresso, border: `1px solid ${colors.border}`, color: '#fff', minHeight: '80px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                <input 
                  type="checkbox" checked={editFormData.available === 1}
                  onChange={(e) => setEditFormData({...editFormData, available: e.target.checked ? 1 : 0})}
                  id="avail_check"
                />
                <label htmlFor="avail_check">Available in Menu</label>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: colors.crema, color: colors.espresso, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Update Product</button>
                <button type="button" onClick={() => setEditingProduct(null)} style={{ flex: 1, padding: '12px', backgroundColor: colors.border, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.8rem' }}>Product Inventory</h2>
          <p style={{ color: colors.crema, fontSize: '0.9rem', marginTop: '5px' }}>Manage Faculty Coffee menu items</p>
        </div>
        <button style={{ 
          backgroundColor: colors.crema, color: colors.espresso, border: 'none', 
          padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', 
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          transition: '0.3s'
        }}>
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div style={{ backgroundColor: colors.bean, borderRadius: '20px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: colors.crema, letterSpacing: '1px' }}>
            LOADING INVENTORY...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: colors.latte, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(45, 41, 38, 0.5)' }}>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Product Name</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                  <th style={{ padding: '20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}`, transition: '0.2s' }}>
                    <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Coffee size={20} color={colors.crema} />
                      <div>
                        <div style={{ fontWeight: '600', color: '#fff' }}>{item.name || 'Unnamed Product'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#666' }}>{item.description?.substring(0, 40)}...</div>
                      </div>
                    </td>
                    <td style={{ padding: '20px', color: '#888' }}>
                      <span style={{ backgroundColor: colors.border, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                        {item.category_id}
                      </span>
                    </td>
                    <td style={{ padding: '20px', fontWeight: 'bold', color: colors.crema }}>
                      £{item.price_num || '0.00'}
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ 
                        backgroundColor: item.available === 0 ? 'rgba(231, 74, 59, 0.1)' : 'rgba(40, 167, 69, 0.1)', 
                        color: item.available === 0 ? '#e74a3b' : '#28a745',
                        padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold'
                      }}>
                        {item.available === 0 ? 'OUT OF STOCK' : 'AVAILABLE'}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <Edit onClick={() => handleEditClick(item)} size={18} style={{ cursor: 'pointer', color: '#888' }} title="Edit" />
                        <Trash2 onClick={() => handleDelete(item.id)} size={18} style={{ cursor: 'pointer', color: '#e74a3b' }} title="Delete" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;