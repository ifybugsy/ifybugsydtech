# Getting Started with Ifybugsy Backend

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ifybugsy
JWT_SECRET=your-secret-key-change-this
```

### Step 3: Start Backend
```bash
npm run dev
```

You should see:
```
MongoDB connected successfully
Server running on port 5000
Socket.io ready for real-time connections
```

### Step 4: Test the API
Open `http://localhost:5000/health` in your browser or curl:
```bash
curl http://localhost:5000/health
```

Response:
```json
{"status":"OK","message":"Server is running"}
```

## 📁 Backend Structure

```
backend/
├── src/
│   ├── index.js              # Express server + Socket.io
│   ├── config/
│   │   └── database.js       # MongoDB & Redis config
│   ├── models/               # Database schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Payment.js
│   │   ├── Enrollment.js
│   │   ├── Certificate.js
│   │   ├── CommunityPost.js
│   │   └── BlogPost.js
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── communityController.js
│   │   └── blogController.js
│   ├── routes/               # API endpoints
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── community.js
│   │   ├── blog.js
│   │   └── users.js
│   └── middleware/           # Authentication, validation
│       └── auth.js
├── .env.example              # Environment template
├── .env                       # Your configuration (create from template)
├── package.json              # Dependencies
├── README.md                 # API documentation
└── DEPLOYMENT.md             # Deployment guide
```

## 🔑 Core Features

### 1. Authentication & Users
- User registration and login
- JWT token generation
- Role-based access control (student, admin, instructor)
- User profile management

### 2. Course Management
- Create and manage courses
- Enroll students
- Track progress
- Generate certificates
- Access curriculum and materials

### 3. E-commerce
- Product catalog
- Shopping orders
- Order tracking
- Stock management
- Payment processing

### 4. Community Forum
- Create discussion posts
- Add replies
- Like and engage
- Moderation tools
- Real-time updates

### 5. Blog System
- Write and publish blog posts
- Comments and likes
- Category and tagging
- Search functionality

### 6. Real-time Updates
- Socket.io for live notifications
- Course progress updates
- Community post notifications
- Order and payment alerts

## 📚 API Examples

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "08012345678"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "eyJhbGc..."
}
```

### Get All Courses
```bash
curl http://localhost:5000/api/courses
```

### Create a Course (as instructor)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Advanced React",
    "description": "Learn advanced React patterns",
    "price": 29999,
    "duration": 60,
    "level": "advanced",
    "image": "image_url",
    "instructor": "instructor_id"
  }'
```

### Enroll in a Course
```bash
curl -X POST http://localhost:5000/api/courses/course-id/enroll \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Community Posts
```bash
curl http://localhost:5000/api/community
```

### Create Community Post
```bash
curl -X POST http://localhost:5000/api/community \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "How to learn React faster?",
    "description": "I want to learn React in 30 days...",
    "category": "React"
  }'
```

## 🔗 Frontend Integration

### Step 1: Install Socket.io Client
```bash
npm install socket.io-client
```

### Step 2: Create API Service
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 3: Update Authentication
```typescript
// lib/auth-context.tsx
import api from './api';

const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('auth_token', token);
    setUser(user);
  } catch (error) {
    throw error;
  }
};
```

### Step 4: Use in Components
```typescript
// pages/courses.tsx
import api from '@/lib/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
};
```

## 🗄️ Database Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB Community
# Start MongoDB
mongod

# Backend will automatically connect
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update MONGODB_URI in .env

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ifybugsy
```

## 🧪 Testing Endpoints with Postman

1. Download Postman from https://www.postman.com/download/
2. Import API endpoints
3. Set authorization token after login
4. Test all endpoints

## 🔐 Security Setup

### JWT Secret
Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update .env:
```env
JWT_SECRET=your_generated_secret_here
```

### CORS Configuration
Update CLIENT_URL in .env to match your frontend:
```env
CLIENT_URL=http://localhost:3000
```

## 📊 Real-time Features

### Socket.io Connection
```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('join-community', { userId: user.id });
});

socket.on('community-post-created', (newPost) => {
  console.log('New post:', newPost);
  // Update UI with new post
});
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Check if MongoDB is running:
- Windows: Services app should show MongoDB
- Mac: brew services list | grep mongodb
- Linux: systemctl status mongod
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### CORS Error
```
Check CLIENT_URL in .env matches your frontend domain
CLIENT_URL=http://localhost:3000
```

### JWT Token Error
```
Make sure token is included in Authorization header:
Authorization: Bearer YOUR_TOKEN_HERE

Token should start with 'eyJ...'
```

## 📖 Documentation Links

- **API Docs**: See `backend/README.md`
- **Deployment**: See `backend/DEPLOYMENT.md`
- **Integration**: See `BACKEND_INTEGRATION_GUIDE.md`
- **Complete Summary**: See `BACKEND_SUMMARY.md`

## 🚀 Next Steps

1. ✅ Backend is running on port 5000
2. ⬜ Test all API endpoints (use Postman or curl)
3. ⬜ Update frontend to use API
4. ⬜ Test Socket.io real-time features
5. ⬜ Deploy to production (see DEPLOYMENT.md)

## 💡 Tips

- Keep terminal running while developing backend
- Use Postman to test endpoints before frontend integration
- Check browser console and backend logs for errors
- Use curl or Thunder Client for quick API testing
- Read the BACKEND_SUMMARY.md for complete overview

## 🆘 Need Help?

1. Check error messages in terminal
2. Review backend/README.md
3. Check BACKEND_INTEGRATION_GUIDE.md
4. Review BACKEND_CHECKLIST.md for what's included

---

**Backend is ready! Start integrating with your frontend! 🎉**

For production deployment, see `backend/DEPLOYMENT.md`
