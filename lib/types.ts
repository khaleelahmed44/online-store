export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_percentage: number;
  image_url: string | null;
  category: string | null;
  stock_quantity: number;
  color: string | null;
  tags: string[] | null;
  rating: number | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  shipping_address: string | null;
  phone_number: string | null;
  is_admin: boolean;
};

export type Order = {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string | null;
  tracking_number: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: Product;
};

export type OrderWithItems = Order & {
  order_items: (OrderItem & { products?: Product })[];
};

export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
};
