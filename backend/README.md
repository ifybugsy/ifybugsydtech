# Ifybugsy Backend API

A comprehensive Node.js/Express backend for the Ifybugsy digital learning platform with real-time features using Socket.io.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Course Management**: Create, read, update, delete courses with enrollment system
- **E-commerce**: Product management, shopping cart, orders, and payments
- **Community Forum**: Real-time community posts, discussions, replies, and moderation
- **Blog System**: Blog post creation, publishing, comments, and likes
- **Payment Processing**: Order and payment tracking with Stripe integration
- **Real-time Updates**: Socket.io for real-time notifications and updates
- **Database**: MongoDB for data persistence
- **Caching**: Redis for performance optimization

## Installation

### Prerequisites
- Node.js 16+
- MongoDB 5+
- Redis 6+ (optional, for caching)

### Setup

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB locally** (if running locally)
```bash
mongod
```

5. **Start the server**
```bash
npm run dev
```

The server will run on `http://localhost:5000` by default.

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08012345678"
}
```

#### Login
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Course Endpoints

#### Get All Courses
```
GET /api/courses
Query: ?level=beginner&search=web
```

#### Get Course by ID
```
GET /api/courses/:id
```

#### Create Course (Instructor/Admin)
```
POST /api/courses
Headers: Authorization: Bearer <token>
{
  "title": "Course Title",
  "description": "Course description",
  "price": 29999,
  "duration": 90,
  "level": "beginner",
  "image": "image_url",
  "curriculum": [...],
  "materials": [...]
}
```

#### Enroll in Course
```
POST /api/courses/:id/enroll
Headers: Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```
GET /api/products
Query: ?category=laptops&search=macbook
```

#### Get Product by ID
```
GET /api/products/:id
```

#### Create Product (Admin)
```
POST /api/products
Headers: Authorization: Bearer <token>
{
  "name": "Product Name",
  "category": "laptops",
  "price": 2499999,
  "brand": "Apple",
  "image": "image_url",
  "description": "Product description",
  "specs": {"processor": "M3", "ram": "16GB"},
  "stock": 50
}
```

### Order Endpoints

#### Create Order
```
POST /api/orders
Headers: Authorization: Bearer <token>
{
  "items": [{"productId": "id", "quantity": 2, "price": 100}],
  "total": 200,
  "shippingAddress": "123 Main St"
}
```

#### Get My Orders
```
GET /api/orders/my-orders
Headers: Authorization: Bearer <token>
```

#### Get Order by ID
```
GET /api/orders/:id
Headers: Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment
```
POST /api/payments
Headers: Authorization: Bearer <token>
{
  "amount": 29999,
  "type": "course",
  "description": "Course purchase",
  "paymentMethod": "card",
  "orderId": "order_id"
}
```

#### Get Payment Stats (Admin)
```
GET /api/payments/stats
Headers: Authorization: Bearer <token>
```

### Community Endpoints

#### Get All Posts
```
GET /api/community
Query: ?category=React&status=unsolved&search=query
```

#### Get Post by ID
```
GET /api/community/:id
```

#### Create Post
```
POST /api/community
Headers: Authorization: Bearer <token>
{
  "title": "Post Title",
  "description": "Post description",
  "category": "React"
}
```

#### Add Reply
```
POST /api/community/:id/reply
Headers: Authorization: Bearer <token>
{
  "content": "Reply content"
}
```

#### Like Post
```
POST /api/community/:id/like
Headers: Authorization: Bearer <token>
```

#### Mark Solved
```
PUT /api/community/:id/mark-solved
Headers: Authorization: Bearer <token>
```

#### Delete Post
```
DELETE /api/community/:id
Headers: Authorization: Bearer <token>
```

### Blog Endpoints

#### Get All Blog Posts
```
GET /api/blog
Query: ?category=news&search=query&published=true
```

#### Get Blog Post
```
GET /api/blog/:id
```

#### Create Blog Post (Admin/Instructor)
```
POST /api/blog
Headers: Authorization: Bearer <token>
{
  "title": "Blog Title",
  "content": "Blog content",
  "excerpt": "Short excerpt",
  "category": "tech",
  "tags": ["tag1", "tag2"],
  "featuredImage": "image_url"
}
```

#### Publish Blog Post
```
POST /api/blog/:id/publish
Headers: Authorization: Bearer <token>
```

#### Add Comment
```
POST /api/blog/:id/comments
Headers: Authorization: Bearer <token>
{
  "content": "Comment content"
}
```

## Real-time Socket.io Events

### Client to Server

- `join-community` - Join community room
- `new-community-post` - Broadcast new post
- `new-community-reply` - Broadcast new reply
- `join-course` - Join course room
- `course-progress` - Update course progress
- `new-blog-post` - Publish new blog
- `new-order` - Create new order
- `payment-completed` - Complete payment
- `join-admin` - Join admin room

### Server to Client

- `user-joined` - User joined community
- `community-post-created` - New post created
- `community-reply-created` - New reply added
- `user-joined-course` - User joined course
- `progress-updated` - Course progress updated
- `blog-post-published` - New blog published
- `order-created` - New order created
- `payment-success` - Payment completed
- `new-order-admin` - Admin notification
- `payment-received-admin` - Admin payment notification
- `user-disconnected` - User disconnected

## Database Models

### User
- Authentication and profile information
- Roles: student, admin, instructor, guest

### Course
- Course details with curriculum and materials
- Enrollment tracking
- Ratings and reviews

### Enrollment
- Student course enrollment tracking
- Progress tracking with daily completion
- Attendance records

### Product
- E-commerce product catalog
- Stock management
- Category filtering

### Order
- Customer orders with items
- Order status tracking
- Shipping information

### Payment
- Payment transaction records
- Payment status tracking
- Type: course, product, subscription

### CommunityPost
- Community discussion posts
- Replies and engagement
- Moderation flags

### BlogPost
- Blog article content
- Publishing status
- Comments and likes

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Starting Production
```bash
npm start
```

## Environment Variables

See `.env.example` for all available configuration options.

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security

- JWT authentication for protected routes
- Password hashing with bcryptjs
- Role-based access control
- Input validation
- CORS enabled
- Rate limiting ready (implement as needed)

## Support

For issues and questions, please contact the development team.
