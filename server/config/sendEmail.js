import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("Please provide GMAIL_USER and GMAIL_PASS in your .env file");
    process.exit(1);
}

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS // This should be an App Password if using 2FA
    },
    tls: {
        rejectUnauthorized: false // Only use in development
    }
});

// Verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log("SMTP server connection error:", error);
    } else {
        console.log("SMTP server connection established");
    }
});

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"FarmCart" <${process.env.GMAIL_USER}>`,
            to: sendTo,
            subject: subject,
            html: html,
            headers: {
                'X-Priority': '1', // High priority
                'Importance': 'high',
                'X-MSMail-Priority': 'High'
            }
        });

        console.log('Email sent to:', sendTo);
        console.log('Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;