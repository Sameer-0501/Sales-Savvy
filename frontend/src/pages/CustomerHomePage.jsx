import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ProductCard } from '../components/ProductCard.jsx';

export const CustomerHomePage = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    isLoadingProducts,
    handleAddToCart,
    setCurrentRoute
  } = useApp();

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter products by search query
  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q);
  });

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 24px 60px' }}>
      
      {/* Luxury Hero Banner */}
      {!searchQuery && selectedCategory === 'All' && (
        <div 
          className="glass-panel"
          style={{
            marginBottom: 36,
            padding: '48px 40px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(22, 32, 54, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 30
          }}
        >
          {/* Background Ambient Glow */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 320,
            height: 320,
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: 620, zIndex: 1 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-primary)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16
            }}>
              ✨ Curated Autumn / Winter 2026 Collection
            </span>

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.15, marginBottom: 16, color: '#FFF' }}>
              Distinctive Style &amp; <span style={{ color: 'var(--accent-primary)' }}>Cutting-Edge Tech.</span>
            </h1>

            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              Experience hand-crafted bespoke apparel and high-performance hardware, engineered with uncompromised craftsmanship.
            </p>

            <div style={{ display: 'flex', gap: 14 }}>
              <button 
                onClick={() => setSelectedCategory('Shirts')}
                className="btn-primary"
              >
                Browse Shirts →
              </button>
              <button 
                onClick={() => setSelectedCategory('Mobiles')}
                className="btn-secondary"
              >
                Explore Tech
              </button>
            </div>
          </div>

          {/* Hero Visual Pill Card */}
          <div style={{
            display: 'none',
            minWidth: 260,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 20,
            zIndex: 1,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#FFF' }}>Instant Dispatch</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Zero-friction delivery with live status tracking.
            </div>
          </div>
        </div>
      )}

      {/* Catalog Header & Count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Collection`}
          </h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing {filteredProducts.length} premium products
          </span>
        </div>

        {searchQuery && (
          <button 
            onClick={() => useApp().setSearchQuery('')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            Clear Search ✕
          </button>
        )}
      </div>

      {/* Product Grid */}
      {isLoadingProducts ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
          Loading curated inventory...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div 
          className="glass-panel" 
          style={{ textAlign: 'center', padding: '60px 20px', margin: '20px 0' }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>No products found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
            We could not find items matching your search in {selectedCategory}.
          </p>
          <button 
            onClick={() => { setSelectedCategory('All'); useApp().setSearchQuery(''); }}
            className="btn-primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 24
        }}>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.product_id}
              product={product}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Product Quick-View Modal */}
      {selectedProduct && (
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
              maxWidth: 720,
              background: '#0B1120',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 20,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFF',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              ✕
            </button>

            {/* Modal Image */}
            <div style={{ width: '45%', background: '#090D16', position: 'relative' }}>
              <img 
                src={selectedProduct.images?.[0]} 
                alt={selectedProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Modal Details */}
            <div style={{ width: '55%', padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.08em' }}>
                  {selectedProduct.category}
                </span>
                <h2 style={{ fontSize: 22, marginTop: 4, marginBottom: 12 }}>{selectedProduct.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  {selectedProduct.description}
                </p>

                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 8 }}>
                  ₹{Number(selectedProduct.price).toFixed(2)}
                </div>

                <div style={{ fontSize: 12, color: selectedProduct.stock > 10 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                  ● {selectedProduct.stock > 0 ? `${selectedProduct.stock} units currently available` : 'Out of Stock'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  onClick={async () => {
                    await handleAddToCart(selectedProduct.product_id);
                    setSelectedProduct(null);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct.product_id);
                    setSelectedProduct(null);
                    setCurrentRoute('cart');
                  }}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
