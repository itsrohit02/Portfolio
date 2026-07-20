require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Using /api/admin to point to the new admin logic (Login, Forgot/Reset Password, Change Password)
app.use('/api/admin', require('./routes/admin')); 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/events', require('./routes/events'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/messages', require('./routes/messages'));

// Nodemailer Transporter Setup (For the Contact Form)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// The Contact API Route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'rohitkr.kumar69@gmail.com',
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `${name} just reached out from your website.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

// Send email in the background (Notice we removed the word 'await'!)
    transporter.sendMail(mailOptions).catch(err => console.error('Background email error:', err));
    
    // Respond to the client instantly after saving to the database!
    res.status(200).json({ success: true, message: 'Message saved and email sending in background!' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
