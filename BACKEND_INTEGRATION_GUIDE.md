# Backend Integration Guide for Ifybugsy Frontend

This guide explains how to connect the Ifybugsy frontend to the new Node.js/Express backend.

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure MongoDB connection in .env
MONGODB_URI=mongodb://localhost:27017/ifybugsy
JWT_SECRET=your-secret-key

# Start the backend
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Configuration

Update the frontend to use the API:

#### Create API service file (`lib/api.ts`)
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Update Authentication Context

Replace mock authentication with real API calls:

```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setUser(user);
  } catch (error) {
    throw error;
  }
};
```

### 3. Real-time Socket.io Integration

Install Socket.io client:
```bash
npm install socket.io-client
```

Create a Socket context (`lib/socket-context.tsx`):
```typescript
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return socket;
};
```

### 4. API Integration Examples

#### Courses Page
```typescript
import api from '@/lib/api';

const fetchCourses = async () => {
  try {
    const response = await api.get('/courses');
    setCourses(response.data);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
};
```

#### Community Page (with real-time updates)
```typescript
import { useSocket } from '@/lib/socket-context';
import api from '@/lib/api';

const CommunityPage = () => {
  const socket = useSocket();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
    
    if (socket) {
      socket.emit('join-community', { userId: user?.id });
      socket.on('community-post-created', (newPost) => {
        setPosts(prev => [newPost, ...prev]);
      });
    }
  }, [socket]);

  const fetchPosts = async () => {
    const response = await api.get('/community');
    setPosts(response.data);
  };

  const createPost = async (title: string, description: string, category: string) => {
    const response = await api.post('/community', {
      title,
      description,
      category,
    });
    
    socket?.emit('new-community-post', response.data);
  };
};
```

#### Orders Page
```typescript
const fetchOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    setOrders(response.data);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

const createOrder = async (items: any[], total: number, address: string) => {
  try {
    const response = await api.post('/orders', {
      items,
      total,
      shippingAddress: address,
    });
    
    socket?.emit('new-order', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create order:', error);
  }
};
```

### 5. Environment Variables

Create `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 6. Database Seeding

To populate initial data:

```bash
# Create a seed file (backend/src/seed.js)
node backend/src/seed.js
```

### 7. Data Migration from Mock Data

The backend can be initialized with the mock data from the frontend:

```javascript
// backend/src/seed.js
const { connectDB } = require('./config/database');
const Course = require('./models/Course');
const Product = require('./models/Product');
const { COURSES, PRODUCTS } = require('./mockData');

const seedDatabase = async () => {
  try {
    await connectDB();
    
    await Course.deleteMany({});
    await Course.insertMany(COURSES);
    
    await Product.deleteMany({});
    await Product.insertMany(PRODUCTS);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
```

## API Endpoints Summary

| Feature | Method | Endpoint | Auth |
|---------|--------|----------|------|
| Register | POST | `/auth/register` | No |
| Login | POST | `/auth/login` | No |
| Get Courses | GET | `/courses` | No |
| Create Course | POST | `/courses` | Yes |
| Enroll Course | POST | `/courses/:id/enroll` | Yes |
| Get Products | GET | `/products` | No |
| Create Order | POST | `/orders` | Yes |
| Get Orders | GET | `/orders/my-orders` | Yes |
| Create Payment | POST | `/payments` | Yes |
| Get Community Posts | GET | `/community` | No |
| Create Post | POST | `/community` | Yes |
| Get Blog Posts | GET | `/blog` | No |
| Create Blog | POST | `/blog` | Yes |

## Real-time Features

### Community Posts
- New posts appear in real-time
- Replies update instantly
- Likes synchronize across users

### Orders & Payments
- Order confirmation in real-time
- Admin notifications for new orders
- Payment status updates

### Course Progress
- Live progress tracking
- Attendance updates
- Completion notifications

## Troubleshooting

### Connection Issues
- Ensure backend is running: `http://localhost:5000/health`
- Check CORS configuration in backend
- Verify API URL in frontend environment

### Authentication Issues
- Token stored in localStorage
- Check JWT secret matches between frontend and backend
- Verify token expiration time

### Real-time Not Working
- Ensure Socket.io client matches server version
- Check browser console for connection errors
- Verify socket events are properly emitted

## Performance Optimization

### Caching
Enable Redis caching in backend `.env`:
```
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Database Indexing
Indexes are automatically created for:
- `Course.title` (text search)
- `Product.name` (text search)
- `Enrollment.student, course` (compound)
- `CommunityPost.title` (text search)

### API Response Caching
Implement caching headers:
```
Cache-Control: public, max-age=3600
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use different secrets for development/production

2. **CORS Configuration**
   - Set `CLIENT_URL` to your frontend domain

3. **JWT Secret**
   - Use strong, random JWT secret
   - Rotate periodically

4. **Rate Limiting** (implement if needed)
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   
   app.use('/api/auth/login', limiter);
   ```

## Next Steps

1. Test all endpoints using Postman/Thunder Client
2. Verify real-time Socket.io events
3. Implement error handling in frontend
4. Add loading states and spinners
5. Deploy backend to production (Heroku, AWS, DigitalOcean)
6. Update frontend environment variables for production
7. Enable HTTPS/WSS for production

## Support

For issues:
- Check browser console for errors
- Check backend logs for server errors
- Review this guide for configuration issues
- Contact the development team

---

**Backend is now ready for integration with the frontend!**
