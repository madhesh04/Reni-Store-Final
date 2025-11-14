
export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ProductCategory = 'boxers' | 'briefs';

export interface ProductVariantSize {
  size: ProductSize;
  stock: number;
}

export interface ProductVariant {
  color: string;
  colorHex: string;
  imageIndex: number;
  sizes: ProductVariantSize[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  images: string[];
  description: string;
  details: {
    material: string;
  };
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: ProductSize;
  color: string;
  quantity: number;
  stock: number;
}

export interface ShippingAddress {
  customerName: string;
  phoneNumber: string;
  address: string;
}

export type OrderStatus = 'Processing' | 'Packed' | 'Out for Delivery' | 'Delivered';
export type PaymentStatus = 'Awaiting Confirmation' | 'Paid' | 'Failed';

export interface Order {
  id: string;
  customer: ShippingAddress;
  items: CartItem[];
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}
