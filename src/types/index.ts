// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
}

// Item types
export type Category = 'Books' | 'Electronics' | 'Furniture' | 'Clothing' | 'Others';
export type Condition = 'New' | 'Like New' | 'Used' | 'Poor';

export interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  images: string[];
  seller: {
    _id: string;
    name: string;
    college: string;
    avatar?: string;
  };
  location?: string;
  tags?: string[];
  isSold: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemResponse {
  item: Item;
}

export interface ItemsListResponse {
  items: Item[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  college: string;
}

export interface CreateItemFormData {
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  images: File[];
  location?: string;
  tags?: string[];
}

export interface UpdateItemFormData {
  title?: string;
  description?: string;
  price?: number;
  category?: Category;
  condition?: Condition;
  images?: string[];
  location?: string;
  tags?: string[];
}

// Query parameters
export interface ItemsQueryParams {
  search?: string;
  category?: Category;
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: 'createdAt' | 'price' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
}
