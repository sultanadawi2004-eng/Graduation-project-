const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'faculty_coffee',
  port: process.env.DB_PORT || 3307
});

db.connect(err => {
  if (err) {
    console.error('MySQL Connection Error:', err.message);
    return;
  }
  console.log(`Database connected successfully on port ${db.config.port}`);
});

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const promiseDb = db.promise();
    const [[products]] = await promiseDb.query("SELECT COUNT(*) as count FROM menu_items");
    const [[orders]] = await promiseDb.query("SELECT COUNT(*) as count FROM orders");
    const [[sales]] = await promiseDb.query("SELECT SUM(total_amount) as total FROM orders");
    const [[inventory]] = await promiseDb.query("SELECT COUNT(*) as count FROM inventory WHERE quantity <= min_threshold");
    res.status(200).json({
      data: {
        totalProducts: products.count,
        totalOrders: orders.count,
        totalSales: sales.total || 0,
        lowStock: inventory.count
      }
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/offers', (req, res) => {
  const query = "SELECT * FROM offers";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Offers Fetch Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(results);
  });
});

app.get('/api/orders', (req, res) => {
  const query = "SELECT * FROM orders";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Orders Fetch Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(results);
  });
});

app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM orders WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Order Fetch Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(results[0]);
  });
});

app.get('/api/products', async (req, res) => {
  try {
    const promiseDb = db.promise();
    const [results] = await promiseDb.query(`
      SELECT 
        m.*, 
        CASE 
          WHEN m.available = 0 THEN 1 
          WHEN EXISTS (
            SELECT 1 FROM recipes r 
            JOIN inventory i ON r.inventory_id = i.id 
            WHERE r.menu_item_id = m.id AND i.quantity < r.quantity_required
          ) THEN 1 
          ELSE 0 
        END as isOutOfStock 
      FROM menu_items m
    `);
    results.forEach(p => p.isOutOfStock = !!p.isOutOfStock);
    res.status(200).json(results);
  } catch (err) {
    console.error('Products Fetch Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/inventory', (req, res) => {
  const query = "SELECT * FROM inventory";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Inventory Fetch Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(results);
  });
});

app.get('/api/careers', (req, res) => {
  res.status(200).json([
    { id: 1, title: 'Senior Barista', type: 'Full-time', location: 'Birmingham', description: 'Seeking an experienced barista...' },
    { id: 2, title: 'Store Manager', type: 'Full-time', location: 'Birmingham', description: 'Lead our new flagship store...' }
  ]);
});

app.post('/api/ai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });
    const answer = response.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error('[AI API] Error:', err);
    res.status(500).json({ error: 'AI service failure' });
  }
});

app.post('/api/messages', (req, res) => {
  const { user_msg, ai_msg } = req.body;
  const query = "INSERT INTO chat_messages (user_msg, ai_msg) VALUES (?, ?)";
  db.query(query, [user_msg, ai_msg], (err, result) => {
    if (err) {
      console.error('Save Message Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Message saved' });
  });
});

app.post('/api/orders', async (req, res) => {
  const { customer_name, email, total_amount, cartItems } = req.body;
  if (!customer_name || !email || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  const totalAmount = parseFloat(total_amount);
  if (Number.isNaN(totalAmount) || totalAmount < 0) {
    return res.status(400).json({ error: 'Invalid total amount' });
  }
  const promiseDb = db.promise();
  try {
    await promiseDb.beginTransaction();
    for (const item of cartItems) {
      const productId = parseInt(item.id, 10);
      const quantity = parseInt(item.qty, 10);
      if (Number.isNaN(productId) || productId <= 0) {
        throw new Error('Invalid product id in order item');
      }
      const [ingredients] = await promiseDb.query(`
        SELECT i.item_name, i.quantity as stock_qty, r.quantity_required
        FROM recipes r
        JOIN inventory i ON r.inventory_id = i.id
        WHERE r.menu_item_id = ?
      `, [productId]);
      for (const recipe of ingredients) {
        const requiredTotal = parseFloat(recipe.quantity_required) * quantity;
        if (recipe.stock_qty < requiredTotal) {
          throw new Error(`Insufficient stock for: ${recipe.item_name}`);
        }
      }
    }
    const [[{ nextOrderId }]] = await promiseDb.query("SELECT IFNULL(MAX(id), 0) + 1 AS nextOrderId FROM orders");
    const orderId = nextOrderId;
    await promiseDb.query(
      "INSERT INTO orders (id, customer_name, email, total_amount, status, created_at) VALUES (?, ?, ?, ?, 'preparing', NOW())",
      [orderId, customer_name, email, totalAmount]
    );
    const insertOrderItem = "INSERT INTO order_items (id, order_id, product_id, item_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)";
    const updateInventoryById = "UPDATE inventory SET quantity = GREATEST(quantity - ?, 0) WHERE id = ?";
    const [[{ nextOrderItemId }]] = await promiseDb.query("SELECT IFNULL(MAX(id), 0) + 1 AS nextOrderItemId FROM order_items");
    let orderItemId = nextOrderItemId;
    for (const item of cartItems) {
      const productId = parseInt(item.id, 10);
      const quantity = parseFloat(item.qty);
      const price = parseFloat(item.priceNum);
      if (Number.isNaN(productId) || productId <= 0 || !quantity || quantity <= 0 || Number.isNaN(price)) continue;
      await promiseDb.query(insertOrderItem, [orderItemId, orderId, productId, item.name, quantity, price]);
      const [recipeSteps] = await promiseDb.query("SELECT inventory_id, quantity_required FROM recipes WHERE menu_item_id = ?", [productId]);
      for (const ingredient of recipeSteps) {
        const deductAmount = parseFloat(ingredient.quantity_required) * quantity;
        await promiseDb.query(updateInventoryById, [deductAmount, ingredient.inventory_id]);
      }
      orderItemId += 1;
    }
    await promiseDb.commit();
    res.status(201).json({ success: true, orderId });
    setTimeout(async () => {
      try {
        const updateDb = mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASS || '',
          database: process.env.DB_NAME || 'graduation_project',
          port: process.env.DB_PORT || 3307
        });
        updateDb.connect(err => {
          if (err) {
            console.error('Auto-update DB Connection Error:', err.message);
            return;
          }
          updateDb.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['ready', orderId],
            err => {
              if (err) {
                console.error(`[Auto-Update] Error updating order ${orderId}:`, err.message);
              } else {
                console.log(`[Auto-Update] Order #${orderId} marked as ready`);
              }
              updateDb.end();
            }
          );
        });
      } catch (error) {
        console.error('[Auto-Update] Error:', error.message);
      }
    }, 120000);
  } catch (err) {
    console.error('[Server] Order Error:', err.message);
    try {
      await promiseDb.rollback();
    } catch (rollbackErr) {
      console.error('[Server] Rollback Error:', rollbackErr);
    }
    if (err.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/messages', (req, res) => {
  const query = "SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 50";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Fetch Messages Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json(results);
  });
});

const convertNumerals = str => {
  if (typeof str !== 'string') return str;
  return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[0-9]/g, d => d);
};

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  let { name, price_num, description, available } = req.body;
  const cleanPrice = convertNumerals(price_num.toString()).replace(/[^0-9.]/g, '');
  const query = "UPDATE menu_items SET name = ?, price_num = ?, description = ?, available = ? WHERE id = ?";
  db.query(query, [name, cleanPrice, description, available, id], (err, result) => {
    if (err) {
      console.error('[Server] Update Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product updated successfully' });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM menu_items WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted successfully' });
  });
});

app.get('/api/order-items/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId], (err, results) => {
    if (err) {
      console.error('[Server] Database Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});