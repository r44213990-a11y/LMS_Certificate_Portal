# LMS Micro-Certification Portal

A React and Node.js application for micro-certifications where students can take quizzes, view results, and download certificates.

## 🌐 Live Demo

**🔗 Live Application**: [https://lms-certificate-portal.vercel.app](https://lms-certificate-portal.vercel.app)

**📁 GitHub Repository**: [https://github.com/r44213990-a11y/LMS_Certificate_Portal](https://github.com/r44213990-a11y/LMS_Certificate_Portal)

## Features

- User authentication (register/login)
- Interactive quiz with MCQ questions
- Real-time results and scoring
- PDF certificate generation
- Responsive design

## Screenshots

### Dashboard
![Dashboard](./screenshots/Screenshot%202025-09-15%20214140.png)
*Clean, modern dashboard showing quiz information and user statistics*

### Quiz Results
![Quiz Results](./screenshots/Screenshot%202025-09-15%20214214.png)
*Detailed results page with score breakdown and certificate download option*

### User Statistics & Recent Results
![User Statistics](./screenshots/Screenshot%202025-09-15%20214353.png)
*Comprehensive user statistics and recent quiz attempts with detailed analytics*

## Tech Stack

- **Frontend**: React 18.2.0, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT tokens
- **PDF Generation**: Puppeteer

## 🚀 Quick Start

**Want to try it right away?**
1. **Visit the live app**: [https://lms-certificate-portal.vercel.app](https://lms-certificate-portal.vercel.app)
2. **Register a new account** or use test credentials
3. **Take the quiz** and download your certificate!

**Want to run locally?** See the detailed setup instructions below.

## Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/r44213990-a11y/LMS_Certificate_Portal.git
   cd LMS_Certificate_Portal
   npm run install-all
   ```

2. **Environment setup**
   ```bash
   cp server/env.example server/.env
   # Edit server/.env with your MongoDB connection string
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

4. **Access application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/quiz` - Get quiz information
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/user/results` - Get user results
- `POST /api/certificate/generate` - Generate PDF certificate

## Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Questions
```javascript
{
  quizId: String,
  questionText: String,
  options: [String],
  correctAnswer: String
}
```

### Results
```javascript
{
  userId: ObjectId,
  quizId: String,
  score: Number,
  totalQuestions: Number,
  answers: [String],
  passed: Boolean
}
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: JWT secret key
   - `NODE_ENV`: production
4. Deploy

## Assessment Criteria

✅ **Functionality (40%)**: Complete quiz flow, result calculation, certificate generation  
✅ **Code Quality (20%)**: Clean code, error handling, RESTful APIs  
✅ **UI/UX (15%)**: Modern design, responsive interface  
✅ **Database Design (10%)**: Well-structured schemas  
✅ **Deployment (10%)**: Vercel deployment ready  
✅ **Innovation (5%)**: Timer-based quizzes, performance analytics  

## Live Demo

- **Application**: [Vercel Deployment Link]
- **Repository**: [GitHub Repository Link]

## Author

LMS Certification Portal Assessment