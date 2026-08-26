export enum OrderStatus {
  Paid = 'paid',
  Pending = 'pending',
  Cancelled = 'cancelled',
}

export enum ProductCategory {
  Drink = 'drink',
  Food = 'food',
  Other = 'other',
}

export enum PaymentMethod {
  Cash = 'cash',
  QR = 'qr',
}

// Chuẩn hóa response API và phân trang, dùng chung cho tất cả entity
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HasId {
  id: string;
}

// Entity
export interface Customer extends HasId {
  name: string;
  phone: string;
  email?: string;
  points: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product extends HasId {
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Snapshot giữ lại thông tin sản phẩm tại thời điểm đặt hàng
export interface ProductSnapshot {
  productId: string;
  name: string;
  price: number;
}

export interface OrderItem extends HasId {
  productId: string;
  snapshot: ProductSnapshot;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Order
export interface Order extends HasId {
  customerId: string;
  orderDate: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  total: number;
  earnedPoints: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTO (dùng utility types)
// Customer
export type CreateCustomerDto = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'points' | 'totalSpent'>;
export type UpdateCustomerDto = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;

// Product
export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDto = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;

// Order
export type CreateOrderItemDto = {
  productId: string;
  quantity: number;
};

export type CreateOrderDto = {
  customerId?: string;  // ← optional để hỗ trợ đơn vãng lai
  paymentMethod: PaymentMethod;
  items: CreateOrderItemDto[];
  notes?: string;
};

// Khi cập nhật chỉ cho phép thay đổi status và notes
export type UpdateOrderDto = Partial<{
  status: OrderStatus;
  notes: string;
}>;

// Xóa theo ID
export type DeleteDto = Pick<HasId, 'id'>;

// Filter và search
export interface OrderFilterDto {
  status?: OrderStatus;
  fromDate?: Date;
  toDate?: Date;
  customerId?: string;
}

export interface SearchDto {
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Preview – dùng cho danh sách hiển thị nhanh
export type OrderPreview = Pick<Order, 'id' | 'orderDate' | 'status' | 'total' | 'customerId' | 'paymentMethod'>;
export type CustomerPreview = Pick<Customer, 'id' | 'name' | 'phone' | 'points'>;
export type ProductPreview = Pick<Product, 'id' | 'name' | 'price' | 'stock'>;
