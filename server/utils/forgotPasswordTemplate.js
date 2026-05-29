const forgotPasswordTemplate = ({ name, otp }) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#4CAF50" style="padding: 30px;">
              <h1 style="color: white; margin: 0;">Password Reset</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.5;">Dear <span style="font-weight: bold;">${name}</span>,</p>
              <p style="margin: 15px 0; font-size: 16px; line-height: 1.5;">You've requested a password reset. Please use the following OTP code to reset your password:</p>
              
              <div style="background-color: #f9f5e3; border-left: 4px solid #ffc107; margin: 25px 0; padding: 15px; text-align: center;">
                <h2 style="font-family: monospace; letter-spacing: 8px; font-size: 32px; color: #333333; margin: 10px 0;">${otp}</h2>
              </div>
              
              <p style="margin: 15px 0; font-size: 14px; line-height: 1.5; color: #666666;">This OTP is valid for <span style="font-weight: bold; color: #e74c3c;">10 minutes only</span>. Enter this OTP on the FarmCart website to proceed with resetting your password.</p>
              
              <p style="margin: 15px 0; font-size: 14px; line-height: 1.5; color: #666666;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td bgcolor="#f2f2f2" style="padding: 20px 30px;">
              <p style="margin: 0; text-align: center; font-size: 14px; color: #666666;">
                Thanks,<br>
                <span style="color: #4CAF50; font-weight: bold; font-size: 16px;">FarmCart Team</span>
              </p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#4CAF50" style="padding: 15px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: white;">© ${new Date().getFullYear()} FarmCart. All rights reserved.</p>
            </td>
          </tr>
        </table>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
              This is an automated message, please do not reply to this email.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };
  
  export default forgotPasswordTemplate;