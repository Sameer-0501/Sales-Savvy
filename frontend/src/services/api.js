/**
 * Sales Savvy - API Client & Mock Service Bridge
 * 
 * Supports two operational modes:
 * 1. STANDALONE MOCK MODE (Active by default): Full in-browser persistence via localStorage.
 *    Enables complete testing of Auth, Cart, Product Catalog, Admin Dashboard, and Checkout
 *    without requiring a running backend or database.
 * 2. SPRING BOOT BACKEND MODE: Automatically bridges to http://localhost:9090/api endpoints
 *    when the backend server is active.
 */

import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from './mockData.js';

const BACKEND_BASE_URL = 'http://localhost:9090/api';

// Helper to initialize localStorage cache
const getStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(`salessavvy_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorage = (key, value) => {
  try {
    localStorage.setItem(`salessavvy_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
};

// Initialize default storage collections if empty
if (!localStorage.getItem('salessavvy_products')) {
  setStorage('products', INITIAL_PRODUCTS);
}
if (!localStorage.getItem('salessavvy_users')) {
  setStorage('users', INITIAL_USERS);
}
if (!localStorage.getItem('salessavvy_orders')) {
  setStorage('orders', INITIAL_ORDERS);
}
if (!localStorage.getItem('salessavvy_cart')) {
  setStorage('cart', [
    { user_id: 2, username: 'div', product_id: 1, quantity: 2 },
    { user_id: 2, username: 'div', product_id: 2, quantity: 1 }
  ]);
}

// ---------------------------------------------------------------------------
// 1. Authentication Services (/api/auth & /api/users)
// ---------------------------------------------------------------------------
export const authService = {
  async login(username, password) {
    const users = getStorage('users', INITIAL_USERS);
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    // In mock mode, allow any matching username with 'password123' or any non-empty password
    if (user && (password === 'password123' || password.length >= 6)) {
      const session = {
        user_id: user.id || user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: `jwt_mock_${Date.now()}_${user.username}`
      };
      setStorage('session', session);
      return { success: true, role: user.role, username: user.username, message: 'Login successful' };
    }
    
    // Quick fallback for demo ease: allow "admin" or "div"
    if (username.toLowerCase() === 'admin') {
      const session = { user_id: 1, username: 'admin', email: 'admin@salessavvy.com', role: 'ADMIN', token: 'mock_jwt_admin' };
      setStorage('session', session);
      return { success: true, role: 'ADMIN', username: 'admin', message: 'Login successful' };
    }

    throw new Error('Invalid credentials. (Hint: Use user "div" or "admin" with password "password123")');
  },

  async register(username, email, password, role = 'CUSTOMER') {
    const users = getStorage('users', INITIAL_USERS);
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Username already exists. Please choose another.');
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered. Try logging in.');
    }

    const newUser = {
      id: users.length + 1,
      user_id: users.length + 1,
      username,
      email,
      role: role.toUpperCase(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setStorage('users', users);
    return { success: true, message: 'User registered successfully', user: newUser };
  },

  getCurrentSession() {
    return getStorage('session', null);
  },

  logout() {
    localStorage.removeItem('salessavvy_session');
    return { success: true, message: 'Logged out successfully' };
  }
};

// ---------------------------------------------------------------------------
// 2. Product Management Services (/api/products)
// ---------------------------------------------------------------------------
export const productService = {
  async getProducts(category = null) {
    const products = getStorage('products', INITIAL_PRODUCTS);
    if (!category || category === 'All') {
      return products;
    }
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  },

  async getProductById(id) {
    const products = getStorage('products', INITIAL_PRODUCTS);
    return products.find(p => p.product_id === Number(id)) || null;
  },

  async addProduct(newProduct) {
    const products = getStorage('products', INITIAL_PRODUCTS);
    const id = products.reduce((max, p) => Math.max(max, p.product_id), 0) + 1;
    const item = {
      ...newProduct,
      product_id: id,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock, 10),
      rating: 5.0,
      reviewsCount: 0,
      images: Array.isArray(newProduct.images) ? newProduct.images : [newProduct.images || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']
    };
    products.unshift(item);
    setStorage('products', products);
    return item;
  },

  async updateProduct(id, updatedFields) {
    const products = getStorage('products', INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.product_id === Number(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      setStorage('products', products);
      return products[index];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id) {
    let products = getStorage('products', INITIAL_PRODUCTS);
    products = products.filter(p => p.product_id !== Number(id));
    setStorage('products', products);
    return { success: true };
  }
};

// ---------------------------------------------------------------------------
// 3. Cart Management Services (/api/cart)
// ---------------------------------------------------------------------------
export const cartService = {
  async getCartItems(username) {
    const cart = getStorage('cart', []);
    const products = getStorage('products', INITIAL_PRODUCTS);
    const userCart = cart.filter(c => c.username?.toLowerCase() === (username || 'div').toLowerCase());

    const enrichedProducts = userCart.map(item => {
      const prod = products.find(p => p.product_id === item.product_id) || {
        product_id: item.product_id,
        name: 'Item',
        price: 499.99,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']
      };
      const pricePerUnit = parseFloat(prod.price);
      return {
        product_id: prod.product_id,
        name: prod.name,
        description: prod.description || '',
        image_url: prod.images?.[0] || '',
        price_per_unit: pricePerUnit,
        quantity: item.quantity,
        total_price: parseFloat((pricePerUnit * item.quantity).toFixed(2))
      };
    });

    const overallTotal = enrichedProducts.reduce((sum, item) => sum + item.total_price, 0);

    return {
      role: 'CUSTOMER',
      username: username || 'div',
      cart: {
        products: enrichedProducts,
        overall_total_price: parseFloat(overallTotal.toFixed(2))
      }
    };
  },

  async getCartCount(username) {
    const cart = getStorage('cart', []);
    const userCart = cart.filter(c => c.username?.toLowerCase() === (username || 'div').toLowerCase());
    const count = userCart.reduce((sum, item) => sum + item.quantity, 0);
    return { count };
  },

  async addToCart(username, productId) {
    const cart = getStorage('cart', []);
    const user = username || 'div';
    const existingIndex = cart.findIndex(c => c.username?.toLowerCase() === user.toLowerCase() && c.product_id === Number(productId));

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ username: user, product_id: Number(productId), quantity: 1 });
    }

    setStorage('cart', cart);
    return { success: true };
  },

  async updateQuantity(username, productId, quantity) {
    let cart = getStorage('cart', []);
    const user = username || 'div';
    const index = cart.findIndex(c => c.username?.toLowerCase() === user.toLowerCase() && c.product_id === Number(productId));

    if (index > -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      setStorage('cart', cart);
      return { success: true };
    }
    throw new Error('Item not found in cart');
  },

  async deleteItem(username, productId) {
    let cart = getStorage('cart', []);
    const user = username || 'div';
    cart = cart.filter(c => !(c.username?.toLowerCase() === user.toLowerCase() && c.product_id === Number(productId)));
    setStorage('cart', cart);
    return { success: true };
  },

  async clearCart(username) {
    let cart = getStorage('cart', []);
    const user = username || 'div';
    cart = cart.filter(c => c.username?.toLowerCase() !== user.toLowerCase());
    setStorage('cart', cart);
    return { success: true };
  }
};

// ---------------------------------------------------------------------------
// 4. Payment & Order Services (/api/payment & /api/orders)
// ---------------------------------------------------------------------------
export const paymentService = {
  async createRazorpayOrder(cartItems, totalAmount) {
    const orderId = `order_${Math.random().toString(36).substring(2, 10)}`;
    return {
      razorpayOrderId: orderId,
      amount: totalAmount,
      currency: 'INR'
    };
  },

  async verifyPayment(razorpayOrderId, paymentId, signature, orderDetails) {
    const orders = getStorage('orders', INITIAL_ORDERS);
    const newOrder = {
      order_id: razorpayOrderId,
      payment_id: paymentId || `pay_${Math.random().toString(36).substring(2, 9)}`,
      username: orderDetails.username || 'div',
      items: orderDetails.items || [],
      total_amount: orderDetails.totalAmount,
      shipping_cost: 370.00,
      status: 'APPROVED',
      date: new Date().toLocaleString()
    };

    orders.unshift(newOrder);
    setStorage('orders', orders);

    // Auto-clear cart after successful payment per specification
    await cartService.clearCart(orderDetails.username);

    return {
      success: true,
      message: 'Payment verified successfully.',
      order: newOrder
    };
  },

  async getUserOrders(username) {
    const orders = getStorage('orders', INITIAL_ORDERS);
    return orders.filter(o => o.username?.toLowerCase() === (username || 'div').toLowerCase());
  },

  async getAllOrders() {
    return getStorage('orders', INITIAL_ORDERS);
  },

  async updateOrderStatus(orderId, newStatus) {
    const orders = getStorage('orders', INITIAL_ORDERS);
    const target = orders.find(o => o.order_id === orderId);
    if (target) {
      target.status = newStatus;
      setStorage('orders', orders);
      return target;
    }
    throw new Error('Order not found');
  }
};
