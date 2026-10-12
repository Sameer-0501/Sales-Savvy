import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { productService, paymentService } from '../services/api.js';

export const AdminDashboard = () => {
  const {
    products,
    loadProducts,
    orders,
    loadOrders,
    showToast,
    setCurrentRoute
  } = useApp();

  const [activeTab, setActiveTab] = useState('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Shirts',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total_amount : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Shirts',
      price: '',
      stock: '',
      description: '',
      imageUrl: ''
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.images?.[0] || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.product_id, {
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock, 10),
          description: productForm.description,
          images: [productForm.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']
        });
        showToast('Product updated successfully', 'success');
      } else {
        await productService.addProduct({
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock, 10),
          description: productForm.description,
          images: [productForm.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']
        });
        showToast('New product added to catalog', 'success');
      }
      setIsProductModalOpen(false);
      await loadProducts();
    } catch (err) {
      showToast('Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        showToast('Product removed', 'info');
        await loadProducts();
      } catch (err) {
        showToast('Could not delete product', 'error');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await paymentService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      await loadOrders();
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 24px 80px' }}>
      
      {/* Admin Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>⚙️</span>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Master Admin Console</h1>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Real-time management for catalog inventory, customer orders, and platform operations.
          </span>
        </div>

        <button 
          onClick={() => setCurrentRoute('home')}
          className="btn-secondary"
          style={{ fontSize: 13 }}
        >
          View Storefront ↗
        </button>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        marginBottom: 36
      }}>
        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Revenue</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-primary)', marginTop: 4, fontFamily: 'var(--font-heading)' }}>
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 4 }}>● Live transactions captured</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid var(--indigo-accent)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Orders</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#818CF8', marginTop: 4, fontFamily: 'var(--font-heading)' }}>
            {totalOrders}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>All customer lifecycles</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Catalog Items</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#34D399', marginTop: 4, fontFamily: 'var(--font-heading)' }}>
            {totalProducts}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Across 5 main categories</div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 24, paddingBottom: 12 }}>
        {[
          { id: 'products', label: '📦 Product Inventory', count: products.length },
          { id: 'orders', label: '📋 Customer Orders', count: orders.length }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: activeTab === t.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
              background: activeTab === t.id ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: activeTab === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Tab 1: Product Inventory */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Manage and update your online store catalog items.
            </span>
            <button onClick={handleOpenAddModal} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
              + Add New Product
            </button>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 11 }}>
                  <th style={{ padding: '16px 20px' }}>Product</th>
                  <th style={{ padding: '16px 20px' }}>Category</th>
                  <th style={{ padding: '16px 20px' }}>Price</th>
                  <th style={{ padding: '16px 20px' }}>Stock</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.product_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img 
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'} 
                        alt={p.name}
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#0D1322' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: #{p.product_id}</div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{p.category}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--accent-primary)' }}>₹{Number(p.price).toFixed(2)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: p.stock > 10 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: p.stock > 10 ? '#34D399' : '#F87171'
                      }}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleOpenEditModal(p)}
                        style={{ background: 'none', border: 'none', color: '#818CF8', cursor: 'pointer', marginRight: 12, fontWeight: 600 }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.product_id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Customer Orders */}
      {activeTab === 'orders' && (
        <div>
          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 11 }}>
                  <th style={{ padding: '16px 20px' }}>Order ID</th>
                  <th style={{ padding: '16px 20px' }}>Customer</th>
                  <th style={{ padding: '16px 20px' }}>Items</th>
                  <th style={{ padding: '16px 20px' }}>Total Amount</th>
                  <th style={{ padding: '16px 20px' }}>Status Lifecycle</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.order_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontWeight: 700, color: '#FFF' }}>
                      {o.order_id}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      👤 {o.username}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      {o.items?.length || 0} product(s)
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      ₹{Number(o.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.order_id, e.target.value)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#FFF',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 6,
                          padding: '6px 10px',
                          fontSize: 12,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="PENDING" style={{ background: '#0B1120' }}>PENDING</option>
                        <option value="APPROVED" style={{ background: '#0B1120' }}>APPROVED</option>
                        <option value="SHIPPED" style={{ background: '#0B1120' }}>SHIPPED</option>
                        <option value="DELIVERED" style={{ background: '#0B1120' }}>DELIVERED</option>
                        <option value="CANCELLED" style={{ background: '#0B1120' }}>CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: 520,
              padding: 32,
              borderRadius: 20,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#0B1120'
            }}
          >
            <h2 style={{ fontSize: 20, marginBottom: 20, color: '#FFF' }}>
              {editingProduct ? 'Edit Catalog Item' : 'Add New Catalog Item'}
            </h2>

            <form onSubmit={handleSaveProduct}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#FFF' }}
                  >
                    {['Shirts', 'Pants', 'Accessories', 'Mobiles', 'Mobile Accessories'].map(c => (
                      <option key={c} value={c} style={{ background: '#0B1120' }}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Stock Units</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Description</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#FFF', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
