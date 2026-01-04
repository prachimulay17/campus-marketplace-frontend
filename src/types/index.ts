export type Category = 'books' | 'electronics' | 'furniture' | 'clothing' | 'other';

export type Condition = 'new' | 'good' | 'fair' | 'used';

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerCollege: string;
  sellerAvatar?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  avatar?: string;
  joinedAt: string;
}
