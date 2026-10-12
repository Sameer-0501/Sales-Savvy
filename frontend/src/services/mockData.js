/**
 * Sales Savvy - Seed Mock Dataset
 * Contains products matching KodNest course requirements & realistic catalog items
 */

export const INITIAL_CATEGORIES = [
  'All',
  'Shirts',
  'Pants',
  'Accessories',
  'Mobiles',
  'Mobile Accessories'
];

export const INITIAL_PRODUCTS = [
  {
    product_id: 1,
    name: 'Classic Oxford Slim Shirt',
    description: 'Tailored breathable cotton shirt in crisp white with button-down collar.',
    price: 499.99,
    stock: 100,
    category: 'Shirts',
    rating: 4.8,
    reviewsCount: 142,
    images: [
      'https://kodnest-docs.b-cdn.net/salessavvy/COSTOMER%20IMAGES/shirt1.png',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    product_id: 2,
    name: 'Urban Chambray Navy Shirt',
    description: 'Vintage-washed lightweight chambray weave, tailored slim fit.',
    price: 599.99,
    stock: 85,
    category: 'Shirts',
    rating: 4.7,
    reviewsCount: 98,
    images: [
      'https://kodnest-docs.b-cdn.net/salessavvy/COSTOMER%20IMAGES/shirt2.png',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    product_id: 3,
    name: 'Bespoke Sand Linen Shirt',
    description: '100% European flax linen shirt featuring pearl buttons and relaxed elegance.',
    price: 699.99,
    stock: 60,
    category: 'Shirts',
    rating: 4.9,
    reviewsCount: 76,
    images: [
      'https://kodnest-docs.b-cdn.net/salessavvy/COSTOMER%20IMAGES/shirt3.png'
    ]
  },
  {
    product_id: 4,
    name: 'Denim Azure Overshirt',
    description: 'Rugged structured denim shirt with dual chest pockets and gunmetal buttons.',
    price: 799.99,
    stock: 50,
    category: 'Shirts',
    rating: 4.6,
    reviewsCount: 64,
    images: [
      'https://kodnest-docs.b-cdn.net/salessavvy/COSTOMER%20IMAGES/shirt4.png'
    ]
  },
  {
    product_id: 5,
    name: 'Olive Field Military Shirt',
    description: 'Durable cotton ripstop weave with tailored darting and utility pockets.',
    price: 899.99,
    stock: 70,
    category: 'Shirts',
    rating: 4.9,
    reviewsCount: 112,
    images: [
      'https://kodnest-docs.b-cdn.net/salessavvy/COSTOMER%20IMAGES/shirt5.png'
    ]
  },
  {
    product_id: 6,
    name: 'Tailored Stretch Chinos',
    description: 'Modern slim chinos with 4-way micro stretch and wrinkle-resistant finish.',
    price: 899.99,
    stock: 75,
    category: 'Pants',
    rating: 4.8,
    reviewsCount: 154,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    product_id: 7,
    name: 'Raw Indigo Selvedge Denim',
    description: '14oz shuttle-loomed Japanese denim with genuine copper rivets.',
    price: 1299.99,
    stock: 45,
    category: 'Pants',
    rating: 4.9,
    reviewsCount: 88,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    product_id: 8,
    name: 'Chronograph Minimalist Watch',
    description: 'Brushed matte black 316L stainless steel watch with domed sapphire crystal.',
    price: 2499.99,
    stock: 30,
    category: 'Accessories',
    rating: 4.9,
    reviewsCount: 210,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    product_id: 9,
    name: 'Full-Grain Italian Leather Belt',
    description: 'Hand-burnished cognac leather belt featuring custom brushed steel buckle.',
    price: 649.99,
    stock: 90,
    category: 'Accessories',
    rating: 4.7,
    reviewsCount: 89,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    product_id: 10,
    name: 'Zenith Pro 5G Flagship',
    description: '6.7-inch 120Hz LTPO AMOLED, Snapdragon Gen 3, 50MP Sony sensor, 5000mAh.',
    price: 42999.00,
    stock: 25,
    category: 'Mobiles',
    rating: 4.9,
    reviewsCount: 340,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    product_id: 11,
    name: 'Aero Buds ANC Pro',
    description: 'Active Noise Cancelling earbuds with spatial audio and wireless fast charging.',
    price: 3499.00,
    stock: 120,
    category: 'Mobile Accessories',
    rating: 4.8,
    reviewsCount: 425,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    product_id: 12,
    name: 'MagShield Kevlar Armor Case',
    description: 'Real aramid fiber phone case with integrated MagSafe magnetic alignment ring.',
    price: 799.00,
    stock: 150,
    category: 'Mobile Accessories',
    rating: 4.7,
    reviewsCount: 195,
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

export const INITIAL_USERS = [
  { id: 1, username: 'admin', email: 'admin@salessavvy.com', role: 'ADMIN', name: 'Master Administrator' },
  { id: 2, username: 'div', email: 'div@salessavvy.com', role: 'CUSTOMER', name: 'Divyan Customer' },
  { id: 3, username: 'customer1', email: 'customer1@salessavvy.com', role: 'CUSTOMER', name: 'Samee Shopper' }
];

export const INITIAL_ORDERS = [
  {
    order_id: 'order_ssv_948192',
    user_id: 2,
    username: 'div',
    items: [
      { product_id: 1, name: 'Classic Oxford Slim Shirt', quantity: 2, price_per_unit: 499.99, total_price: 999.98 },
      { product_id: 8, name: 'Chronograph Minimalist Watch', quantity: 1, price_per_unit: 2499.99, total_price: 2499.99 }
    ],
    total_amount: 3869.97, // including 370 shipping
    shipping_cost: 370.00,
    status: 'SHIPPED',
    date: '2026-10-10 14:32:00'
  }
];
