import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, cartService, productService, paymentService } from '../services/api.js';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(() => authService.getCurrentSession() || {
    username: 'div',
    role: 'CUSTOMER',
    email: 'div@salessavvy.com'
  });

  // Active View / Routing ('home', 'cart', 'orders', 'login', 'register', 'admin')
  const [currentRoute, setCurrentRoute] = useState('home');

  // Products & Category Filtering
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Cart State
  const [cartData, setCartData] = useState({ products: [], overall_total_price: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load Products
  const loadProducts = async (cat = selectedCategory) => {
    setIsLoadingProducts(true);
    try {
      const data = await productService.getProducts(cat);
      setProducts(data);
    } catch (err) {
      showToast('Failed to load products', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load Cart Data
  const loadCart = async () => {
    if (!user) return;
    try {
      const res = await cartService.getCartItems(user.username);
      setCartData(res.cart);
      const countRes = await cartService.getCartCount(user.username);
      setCartCount(countRes.count);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  // Load Orders
  const loadOrders = async () => {
    if (!user) return;
    try {
      if (user.role === 'ADMIN') {
        const allOrders = await paymentService.getAllOrders();
        setOrders(allOrders);
      } else {
        const userOrders = await paymentService.getUserOrders(user.username);
        setOrders(userOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    loadProducts(selectedCategory);
    loadCart();
    loadOrders();
  }, [selectedCategory, user?.username]);

  // Auth Operations
  const handleLogin = async (username, password) => {
    try {
      const res = await authService.login(username, password);
      const session = authService.getCurrentSession();
      setUser(session);
      showToast(`Welcome back, ${session.username}!`, 'success');
      if (session.role === 'ADMIN') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('home');
      }
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const handleRegister = async (username, email, password, role) => {
    try {
      await authService.register(username, email, password, role);
      showToast('Registration successful! Please login.', 'success');
      setCurrentRoute('login');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCartCount(0);
    setCartData({ products: [], overall_total_price: 0 });
    showToast('Logged out safely', 'info');
    setCurrentRoute('login');
  };

  // Cart Operations
  const handleAddToCart = async (productId) => {
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      setCurrentRoute('login');
      return;
    }
    try {
      await cartService.addToCart(user.username, productId);
      await loadCart();
      showToast('Item added to cart!', 'success');
    } catch (err) {
      showToast('Could not add item to cart', 'error');
    }
  };

  const handleUpdateQuantity = async (productId, qty) => {
    try {
      await cartService.updateQuantity(user.username, productId, qty);
      await loadCart();
    } catch (err) {
      showToast('Could not update quantity', 'error');
    }
  };

  const handleDeleteCartItem = async (productId) => {
    try {
      await cartService.deleteItem(user.username, productId);
      await loadCart();
      showToast('Removed item from cart', 'info');
    } catch (err) {
      showToast('Could not remove item', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentRoute,
        setCurrentRoute,
        products,
        loadProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isLoadingProducts,
        cartData,
        cartCount,
        loadCart,
        isCartOpen,
        setIsCartOpen,
        orders,
        loadOrders,
        toast,
        showToast,
        handleLogin,
        handleRegister,
        handleLogout,
        handleAddToCart,
        handleUpdateQuantity,
        handleDeleteCartItem
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
