const express = require('express');
const puppeteer = require('puppeteer');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate Certificate
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { resultId } = req.body;
    const userId = req.user.userId;

    // Get result and user data
    const result = await Result.findById(resultId).populate('userId');
    const quiz = await Quiz.findOne();

    if (!result || result.userId._id.toString() !== userId) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (!result.passed) {
      return res.status(400).json({ message: 'Certificate can only be generated for passed quizzes' });
    }

    // Generate PDF certificate
    const certificateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Certificate</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
          }
          .logo {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
          }
          .title {
            font-size: 36px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 300;
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 40px;
          }
          .name {
            font-size: 32px;
            color: #667eea;
            font-weight: bold;
            margin: 30px 0;
            text-decoration: underline;
          }
          .details {
            font-size: 18px;
            color: #333;
            margin: 20px 0;
          }
          .score {
            font-size: 24px;
            color: #28a745;
            font-weight: bold;
            margin: 20px 0;
          }
          .date {
            font-size: 16px;
            color: #666;
            margin-top: 40px;
          }
          .border {
            border: 4px solid #667eea;
            border-radius: 15px;
            padding: 40px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="border">
            <div class="logo">🏆</div>
            <div class="title">Certificate of Achievement</div>
            <div class="subtitle">This certifies that</div>
            <div class="name">${result.userId.name}</div>
            <div class="details">has successfully completed the quiz</div>
            <div class="details"><strong>${quiz ? quiz.title : 'LMS Certification Quiz'}</strong></div>
            <div class="score">with a score of ${result.score}%</div>
            <div class="date">Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(certificateHtml);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    await browser.close();

    // Update result to mark certificate as generated
    result.certificateGenerated = true;
    await result.save();

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${result.userId.name.replace(/\s+/g, '-')}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate certificate'
    });
  }
});

module.exports = router;
