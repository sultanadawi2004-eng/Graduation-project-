import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import styles from './Checkout.module.css';

export default function Checkout({ onClose, onBack }) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState('form');
  const [orderId, setOrderId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [form, setForm] = useState({
    name: '', email: '',
    cardNumber: '', expiry: '', cvc: '',
  });
  const [errors, setErrors] = useState({});

  const formatPrice = (n) => `£${n.toFixed(2)}`;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (step === 'success' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(t => t - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeRemaining]);

  function formatCardNumber(v) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }
  function formatExpiry(v) {
    const d = v.replace(/\D/g, '').slice(0, 4);
    if (d.length >= 3) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return d;
  }

  function handleChange(e) {
    let { name, value } = e.target;
    if (name === 'cardNumber') value = formatCardNumber(value);
    if (name === 'expiry')     value = formatExpiry(value);
    if (name === 'cvc')         value = value.replace(/\D/g, '').slice(0, 4);
    setForm(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    const rawCard = form.cardNumber.replace(/\s/g, '');
    if (rawCard.length < 16) e.cardNumber = 'Enter 16 digits';
    if (form.expiry.length < 5) e.expiry = 'MM/YY required';
    if (form.cvc.length < 3) e.cvc = 'CVC required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function saveOrderToBackend() {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name.trim(),
          email: form.email.trim(),
          total_amount: totalPrice,
          cartItems: items.map(item => ({
            id: item.id,
            name: item.name,
            qty: item.qty,
            priceNum: item.priceNum
          }))
        }),
      });

      if (!response.ok) throw new Error('Failed to save order');
      const result = await response.json();
      if (result.success) {
        setOrderId(result.orderId);
        setTimeRemaining(120);
      }
      return result.success;
    } catch (error) {
      console.error('API Error:', error);
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStep('processing');
    
    await new Promise(r => setTimeout(r, 1500)); 
    const success = await saveOrderToBackend();
    
    if (success) {
      clearCart();
      setStep('success');
    } else {
      setStep('error');
    }
  }

  if (step === 'success') {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.successScreen}>
            <div className={styles.successIcon}><i className="fas fa-check" /></div>
            <h2>Order placed!</h2>
            <p>Your order is being prepared. Thank you!</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
              Order #{orderId} will be ready in approximately {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
            <button className="btn btn-olive" onClick={onClose}>Back to menu</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className={styles.overlay}><div className={styles.modal}>
        <div className={styles.processingScreen}>
          <div className={styles.spinner} />
          <p>Processing Payment...</p>
        </div>
      </div></div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <button className={styles.backBtn} onClick={onBack}><i className="fas fa-arrow-left" /> Back</button>
          <h2 className={styles.modalTitle}>Checkout</h2>
          <button className={styles.closeBtn} onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.orderSummary}>
            <div className={styles.summaryLabel}>Order summary</div>
            {items.map(item => (
              <div key={item.id} className={styles.sumItem}>
                <span>{item.name} × {item.qty}</span>
                <span>{formatPrice(item.priceNum * item.qty)}</span>
              </div>
            ))}
            <div className={styles.sumTotal}>
              <span>Total</span>
              <span className={styles.sumTotalAmt}>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formSection}>
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input name="name" value={form.name} onChange={handleChange} className={styles.input} placeholder="John Britain" />
                {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={styles.input} placeholder="john@email.com" />
                {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
              </div>
            </div>

            <div className={styles.formSection}>
              <div className={styles.field}>
                <label className={styles.label}>Card number</label>
                <input name="cardNumber" value={form.cardNumber} onChange={handleChange} className={styles.input} placeholder="1234 5678 9012 3456" />
                {errors.cardNumber && <p className={styles.errorMsg}>{errors.cardNumber}</p>}
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Expiry</label>
                  <input name="expiry" value={form.expiry} onChange={handleChange} className={styles.input} placeholder="MM/YY" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>CVC</label>
                  <input name="cvc" value={form.cvc} onChange={handleChange} className={styles.input} placeholder="123" />
                </div>
              </div>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.payBtn}`}>
              Pay {formatPrice(totalPrice)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}