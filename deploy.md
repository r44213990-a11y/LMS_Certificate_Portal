# Quick Deployment Steps

## 🚀 Deploy to Vercel in 5 Steps:

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Go to Vercel
- Visit: https://vercel.com
- Sign up with GitHub
- Click "New Project"

### 3. Import Repository
- Select your `lms-certification-portal` repository
- Click "Import"

### 4. Add Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://Siva123:Siva@cluster0.s5gtmxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### 5. Deploy
- Click "Deploy"
- Wait for completion
- Get your live URL!

## 📝 After Deployment:

1. **Update CORS**: Replace `https://your-app.vercel.app` in `server/index.js` with your actual Vercel URL
2. **Test Everything**: Registration, login, quiz, results, certificates
3. **Update README**: Add your live demo link

## 🔗 Your Links Will Be:
- **Live App**: `https://lms-certification-portal-xxx.vercel.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/lms-certification-portal`

## ✅ Ready for Assessment Submission!
