# Smart Job Portal

A full-stack web application that connects job seekers with employers through an intelligent job matching platform. The portal includes job listings, applications, real-time messaging, blog functionality, and AI-powered resume enhancement.

##  Features

### For Job Seekers
- **User Registration & Authentication** - Secure account creation and login with JWT
- **Job Search & Filtering** - Browse available job listings with detailed information
- **Job Applications** - Apply to jobs with custom DYNAMIC fields
- **Application Tracking** - Monitor the STATUS of submitted applications
- **Profile Management** - Create and update professional profiles with profile visibility
- **Resume Enhancement** - AI-powered resume improvement using Hugging Face models
- **Real-time Messaging** - Direct messaging with recruiters or peers via Socket.io
- **Blog Access** - Read industry insights and career tips
- **User Discovery** - Search for other professionals and view public profiles

### For Recruiters/Employers
- **Job Posting** - Create and manage job listings with custom application fields
- **Dynamic Form Fields** - Define custom fields (text, email, select, textarea) for job applications
- **Application Management** - Review and manage job applications
- **Candidate Messaging** - Direct communication with interested candidates
- **Blog Publishing** - Share company news and career advice
- **User Search** - Find candidates by profile information

### General Features
- **Real-time Chat System** - Instant messaging with Socket.io
- **Blog Platform** - Create, read, and share blog posts
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Secure Authentication** - JWT-based authentication with password encryption
- **File Uploads** - Resume and profile image uploads to Cloudinary
- **Error Handling** - Comprehensive error management and validation

##  Technology Stack

### Frontend
- **React 18.2** - User interface library
- **React Router 7.8** - Client-side routing
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time messaging
- **React Icons** - Icon library
- **React Scripts** - Build tooling

### Backend
- **Node.js & Express 5.1** - Server framework
- **MongoDB & Mongoose 8.18** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time bidirectional communication
- **Multer** - File upload middleware
- **Cloudinary** - Cloud storage for images and documents
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management
- **Hugging Face Inference** - AI models for resume enhancement

##  Project Structure

```
smartjobportal/
├── myclient/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ChatBox.js
│   │   │   ├── JobList.js
│   │   │   ├── JobApplyForm.js
│   │   │   └── ...                # And more 
│   │   ├── pages/
│   │   │   ├── JobsPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── BlogPage.js
│   │   │   ├── AddJobPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── resumeEnhancer.jsx
│   │   │   └── ...                # And more
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── myserver/                    # Express backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── JobApplication.js
│   │   ├── Message.js
│   │   ├── BlogPost.js
│   │   └── ...                    # And more 
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── job.js
│   │   ├── application.js
│   │   ├── messageRoutes.js
│   │   ├── blog.js
│   │   ├── resumeRoutes.js
│   │   └── ...                  # And more 
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── ...                     # And more 
│   ├── middlewares/ 
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── server.js
│   ├── uploads/
│   └── package.json
│
└── README.md
```

##  Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for file uploads)
- Hugging Face API token (for resume enhancement)

### Environment Setup

1. **Configure Backend Environment**

   Create a `.env` file in the `myserver/` directory:

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

2. **Configure Frontend**

   The frontend is already configured with:
   - Proxy: `http://localhost:5000` (in `myclient/package.json`)
   - Socket.io connection: `http://localhost:5000` (in `App.js`)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd smartjobportal
```

#### 2. Install Backend Dependencies
```bash
cd myserver
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../myclient
npm install
```

### Running the Application

#### Start the Backend Server
```bash
cd myserver
npm start
# Server runs on http://localhost:5000
```

#### Start the Frontend Development Server
```bash
cd myclient
npm start
# Application opens at http://localhost:3000
```

Both services must be running for the application to work properly.

##  Available Scripts

### Backend (myserver/)
- `npm start` - Start the server with Node.js
- `npm run dev` - Start with nodemon (auto-reload on file changes) - requires nodemon installation

### Frontend (myclient/)
- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires token)

### Users
- `GET /api/users/<userId>` - Get user profile
- `PUT /api/users/<userId>` - Update user profile
- `GET /api/users/search` - Search users

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/<jobId>` - Get job details
- `POST /api/jobs` - Create a new job (recruiter only)
- `PUT /api/jobs/<jobId>` - Update job (recruiter only)
- `DELETE /api/jobs/<jobId>` - Delete job (recruiter only)

### Job Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Submit job application
- `GET /api/applications/<applicationId>` - Get application details
- `PUT /api/applications/<applicationId>` - Update application status

### Messages
- `GET /api/chats` - Get all messages
- `POST /api/chats` - Send a message
- `DELETE /api/chats/<messageId>` - Delete message

### Blogs
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/<blogId>` - Get single blog post
- `POST /api/blogs` - Create blog post
- `PUT /api/blogs/<blogId>` - Update blog post
- `DELETE /api/blogs/<blogId>` - Delete blog post

### Resume Enhancement
- `POST /api/resume/enhance` - Enhance resume using AI

##  Real-time Events (Socket.io)

### Socket Events
- `join` - User joins their messaging room
- `send` - Send a message
  ```javascript
  socket.emit('send', { from: userId, to: recipientId, body: message })
  ```
- `receive` - Receive a new message
- `deleteChat` - Delete conversation between users

##  Database Models

### User
- `_id` - MongoDB ObjectId
- `name` - User's full name
- `email` - Email address
- `password` - Hashed password
- `role` - "jobseeker" or "recruiter"
- `profile` - User profile information
- `createdAt` - Account creation date

### Job
- `_id` - MongoDB ObjectId
- `title` - Job title
- `description` - Job description
- `recruiter` - Reference to User (recruiter)
- `dynamicFields` - Custom application fields
- `createdAt` - Job posting date

### JobApplication
- `_id` - MongoDB ObjectId
- `job` - Reference to Job
- `applicant` - Reference to User
- `responses` - Answers to dynamic fields
- `status` - "pending", "reviewed", "accepted", "rejected"
- `createdAt` - Application submission date

### Message
- `_id` - MongoDB ObjectId
- `from` - Sender user ID
- `to` - Recipient user ID
- `body` - Message content
- `timestamp` - Message creation time

### BlogPost
- `_id` - MongoDB ObjectId
- `title` - Blog title
- `content` - Blog content
- `author` - Reference to User
- `createdAt` - Publication date

##  Key Features Explained

### Dynamic Job Application Fields
Recruiters can define custom fields for each job, allowing them to collect specific information from applicants. Supported field types:
- `text` - Text input
- `number` - Numeric input
- `email` - Email validation
- `select` - Dropdown selection
- `textarea` - Long text input

### Real-time Chat
Uses Socket.io to enable instant messaging between recruiters and job seekers without page refresh.

### Resume Enhancement
Integrates with Hugging Face's inference API to provide AI-powered resume suggestions and improvements.

### File Upload
Uses Cloudinary for secure cloud storage of profile images and resumes.

##  Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

##  License

This project is licensed under the ISC License - see the LICENSE file for details.

##  Author

**Anoop Tripathi**
- GitHub: [@anooptripathi](https://github.com/anooptripathi0077)

##  Future Enhancements

-  Video interview integration
-  Advanced job matching algorithm
-  Email notifications
-  Analytics dashboard for recruiters
-  Mobile app (React Native)
-  Payment integration for premium features
-  Advanced search with filters
-  Job recommendations based on profile
-  AI-powered cover letter generation

##  Troubleshooting

### MongoDB Connection Error
- Ensure your MongoDB connection string in `.env` is correct
- Check firewall settings allow MongoDB connection
- Verify database exists in MongoDB Atlas

### Socket.io Connection Issues
- Ensure backend server is running on port 5000
- Check CORS settings match frontend URL
- Verify frontend and backend are on the same network

### File Upload Issues
- Verify Cloudinary credentials in `.env`
- Ensure file size is within limits
- Check file type is supported

### Resume Enhancement Not Working
- Verify Hugging Face API key is valid
- Check API request limits haven't been exceeded
- Ensure resume format is supported (PDF, TXT, DOC)

---

**Happy Job Hunting! **
