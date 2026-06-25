// User & Authentication Types
export type UserRole = 'student' | 'admin' | 'instructor' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  address?: string;
  bio?: string;
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  enrolledCourses: string[];
  totalSpent: number;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: Instructor;
  price: number;
  duration: number; // in days
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  reviews: number;
  studentsEnrolled: number;
  curriculum: Module[];
  materials: CourseMaterial[];
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  topics: string[];
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'assignment' | 'quiz';
  url?: string;
  content?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  startDate: string;
  endDate: string;
  progressPercentage: number;
  completedDays: number;
  totalClassDays: number;
  attendancePercentage: number;
  status: 'in_progress' | 'completed' | 'suspended';
  dailyProgress: boolean[]; // Day-by-day completion tracker
  certificateId?: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  bio: string;
  image: string;
  specialization: string;
  yearsExperience: number;
}

// Product & Shop Types
export interface Product {
  id: string;
  name: string;
  category: 'laptops' | 'phones' | 'accessories';
  price: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  rating: number;
  reviews: number;
  stock: number;
  inStock: boolean;
  brand: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: string;
  courseName: string;
  studentName: string;
  instructorName: string;
  courseDuration: number;
}

// Payment Types
export interface Payment {
  id: string;
  transactionId: string;
  studentId: string;
  amount: number;
  currency: string;
  type: 'course' | 'product' | 'subscription';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  description: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  studentId: string;
  studentName: string;
  studentImage?: string;
  courseId: string;
  courseName: string;
  rating: number;
  text: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Partner Types
export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  category: string;
  status: 'active' | 'inactive';
}

// Analytics Types
export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  totalProductsSold: number;
  enrollmentTrend: { date: string; count: number }[];
  recentTransactions: Payment[];
}
