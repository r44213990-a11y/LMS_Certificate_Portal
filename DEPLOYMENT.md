# Vercel Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Push to GitHub

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LMS Certification Portal"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name: `lms-certification-portal`
   - Make it public
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/lms-certification-portal.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select `lms-certification-portal`

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add these variables:

   ```
   MONGODB_URI=mongodb+srv://Siva123:Siva@cluster0.s5gtmxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your live URL

### 3. Update CORS Settings

After deployment, update the CORS origin in `server/index.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-app-name.vercel.app'] // Replace with your actual Vercel URL
    : ['http://localhost:3000'],
  credentials: true
}));
```

### 4. Test Deployment

1. Visit your Vercel URL
2. Test all features:
   - User registration/login
   - Quiz taking
   - Results viewing
   - Certificate generation

### 5. Update README

Add your live demo link to README.md:

```markdown
## Live Demo

- **Application**: https://your-app-name.vercel.app
- **Repository**: https://github.com/YOUR_USERNAME/lms-certification-portal
```

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are in package.json
   - Ensure server and client folders have separate package.json files

2. **API Routes Not Working**
   - Verify vercel.json configuration
   - Check environment variables are set

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas

4. **Certificate Generation Fails**
   - This is expected in serverless environment
   - Users can still download HTML certificates

## Production Checklist

- ✅ Environment variables configured
- ✅ MongoDB Atlas accessible
- ✅ CORS settings updated
- ✅ All features tested
- ✅ README updated with live links
- ✅ Screenshots working
