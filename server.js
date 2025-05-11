const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the 'public' folder

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Handle form submission
app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    // Filter out bad words from the message
    const filteredMessage = message.replace(/swearword1|swearword2/gi, '[censored]');  // Example of censoring words

    // HTML email content
    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: `New message from ${name}`,
        html: `
            <h2 style="color:#4CAF50;">New Message from ${name}</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background-color:#f9f9f9;padding:10px;border-left:5px solid #4CAF50;">
                ${filteredMessage}
            </blockquote>
            <p style="color: #888;">This message was sent using your contact form on your website.</p>
        `
    };

    // Send the email using Nodemailer
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('SendMail error:', err);
            return res.status(500).json({ message: 'Failed to send message.', error: err.toString() });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
