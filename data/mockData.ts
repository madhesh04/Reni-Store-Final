import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'renis-boxer-classic-black',
    name: 'Renis Classic Boxer',
    category: 'boxers',
    price: 19.99,
    images: [
      'https://picsum.photos/seed/renis-boxer-classic-black-0/800/800',
      'https://picsum.photos/seed/renis-boxer-classic-black-1/800/800',
      'https://picsum.photos/seed/renis-boxer-classic-black-2/800/800',
      'https://picsum.photos/seed/renis-boxer-classic-black-3/800/800',
    ],
    description: "Experience unparalleled comfort with the Renis Classic Boxer. Made from a premium cotton blend, it's designed for everyday luxury.",
    details: {
      material: '95% Premium Cotton, 5% Elastane',
    },
    variants: [
      {
        color: 'Onyx Black',
        colorHex: '#000000',
        imageIndex: 0,
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 20 },
          { size: 'XL', stock: 5 },
          { size: 'XXL', stock: 2 },
        ],
      },
      {
        color: 'Navy Blue',
        colorHex: '#000080',
        imageIndex: 2,
        sizes: [
          { size: 'S', stock: 8 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 18 },
          { size: 'XL', stock: 7 },
          { size: 'XXL', stock: 0 },
        ],
      },
      {
        color: 'Heather Grey',
        colorHex: '#808080',
        imageIndex: 3,
        sizes: [
          { size: 'S', stock: 5 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 15 },
          { size: 'XL', stock: 10 },
          { size: 'XXL', stock: 3 },
        ],
      },
    ],
  },
  {
    id: 'renis-boxer-comfort-fit',
    name: 'Renis Comfort Fit Boxer',
    category: 'boxers',
    price: 24.99,
    images: [
      'https://picsum.photos/seed/renis-boxer-comfort-fit-0/800/800',
      'https://picsum.photos/seed/renis-boxer-comfort-fit-1/800/800',
      'https://picsum.photos/seed/renis-boxer-comfort-fit-2/800/800',
    ],
    description: "The Comfort Fit boxer is engineered for movement. Its breathable fabric and ergonomic design provide support and freedom all day long.",
    details: {
      material: '92% MicroModal, 8% Spandex',
    },
    variants: [
      {
        color: 'Crimson Red',
        colorHex: '#DC143C',
        imageIndex: 0,
        sizes: [
          { size: 'M', stock: 20 },
          { size: 'L', stock: 25 },
          { size: 'XL', stock: 10 },
        ],
      },
      {
        color: 'Forest Green',
        colorHex: '#228B22',
        imageIndex: 1,
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 10 },
        ],
      },
       {
        color: 'Pure White',
        colorHex: '#FFFFFF',
        imageIndex: 2,
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 8 },
        ],
      },
    ],
  },
  {
    id: 'renis-brief-essential-black',
    name: 'Renis Essential Brief',
    category: 'briefs',
    price: 17.99,
    images: [
      'https://picsum.photos/seed/renis-brief-essential-black-0/800/800',
      'https://picsum.photos/seed/renis-brief-essential-black-1/800/800',
      'https://picsum.photos/seed/renis-brief-essential-black-2/800/800',
    ],
    description: "The classic brief, perfected. Our Essential Brief offers a supportive fit and is crafted from ultra-soft cotton for all-day comfort.",
    details: {
      material: '95% Premium Cotton, 5% Elastane',
    },
    variants: [
      {
        color: 'Onyx Black',
        colorHex: '#000000',
        imageIndex: 0,
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 25 },
          { size: 'XL', stock: 10 },
        ],
      },
      {
        color: 'Pure White',
        colorHex: '#FFFFFF',
        imageIndex: 1,
        sizes: [
          { size: 'M', stock: 18 },
          { size: 'L', stock: 22 },
          { size: 'XL', stock: 5 },
          { size: 'XXL', stock: 0 },
        ],
      },
      {
        color: 'Heather Grey',
        colorHex: '#808080',
        imageIndex: 2,
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 15 },
          { size: 'XXL', stock: 4 },
        ],
      },
    ],
  },
  {
    id: 'renis-brief-sport-performance',
    name: 'Renis Sport Performance Brief',
    category: 'briefs',
    price: 22.99,
    images: [
      'https://picsum.photos/seed/renis-brief-sport-performance-0/800/800',
      'https://picsum.photos/seed/renis-brief-sport-performance-1/800/800',
    ],
    description: "Engineered for the active man. The Sport Performance Brief features moisture-wicking fabric and a secure fit to keep you cool and comfortable during any workout.",
    details: {
      material: '88% Polyester, 12% Spandex',
    },
    variants: [
      {
        color: 'Cobalt Blue',
        colorHex: '#0047AB',
        imageIndex: 0,
        sizes: [
          { size: 'S', stock: 15 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 15 },
          { size: 'XL', stock: 5 },
        ],
      },
      {
        color: 'Racing Red',
        colorHex: '#FF0000',
        imageIndex: 1,
        sizes: [
          { size: 'M', stock: 18 },
          { size: 'L', stock: 22 },
          { size: 'XL', stock: 8 },
        ],
      },
    ],
  },
];

export const MOCK_UPI_DETAILS = {
  qrCodeUrl: 'https://storage.googleapis.com/aai-web-samples/projects/e-commerce/qr-code.png',
  upiId: 'renis-store@upi'
};

export const MOCK_CAROUSEL_IMAGES: string[] = [
  'https://picsum.photos/seed/carousel1/1920/1080',
  'https://picsum.photos/seed/carousel2/1920/1080',
  'https://picsum.photos/seed/carousel3/1920/1080',
  'https://picsum.photos/seed/carousel4/1920/1080',
];