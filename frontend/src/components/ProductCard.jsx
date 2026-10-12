import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export const ProductCard = ({ product, onSelectProduct }) => {
  const { handleAddToCart } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');

  const onAddClick = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    await handleAddToCart(product.product_id);
    setTimeout(() => setIsAdding(false), 400);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(product.price);

  return (
    <div 
      className="glass-panel"
      onClick={() => onSelectProduct && onSelectProduct(product)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Product Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '100%', // 1:1 Aspect Ratio
        background: '#0D1322',
        overflow: 'hidden'
      }}>
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        
        {/* Category Pill Badge */}
        <span style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: 'rgba(9, 13, 22, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          padding: '3px 9px',
          borderRadius: 'var(--radius-full)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.04em'
        }}>
          {product.category}
        </span>

        {/* Stock Status Indicator */}
        <span style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          background: product.stock > 10 ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)',
          color: '#FFF',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: 10,
          fontWeight: 700
        }}>
          {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
        </span>
      </div>

      {/* Card Content Area */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 6,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {product.name}
          </h3>

          <p style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span style={{
              fontSize: 18,
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-primary)',
              letterSpacing: '-0.02em'
            }}>
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={onAddClick}
            disabled={isAdding}
            style={{
              background: isAdding ? 'var(--success)' : 'var(--accent-gradient)',
              color: '#090D16',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
              boxShadow: isAdding ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'var(--glow-auric)'
            }}
          >
            <span>{isAdding ? '✓ Added' : '+ Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
