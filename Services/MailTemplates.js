const dotenv = require('dotenv');
dotenv.config();

exports.resetPasswordMail = (receiverEmail,userName, resetLink) => {
  return ({
    from: process.env.MAILER_EMAIL, // sender address
    to: receiverEmail, // list of receivers
    subject: "Hello " + userName + ", To reset your password, click the link below. Note: it expires in 1 hour for security.", // plain text body
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            width: 100%;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .header img {
            max-width: 70px;
            margin-bottom: 10px;
        }
        .header .app-name {
            font-size: 24px;
            color: #540640;
            font-weight: bold;
            margin: 0;
            text-shadow: 1px 1px 2px #e99f27;
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            color: #333333;
            font-size: 22px;
            margin-bottom: 20px;
        }
        .content p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            background-color: #540640;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            color: #999999;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .content {
                padding: 10px;
            }
            .button {
                font-size: 14px;
                padding: 10px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://drive.google.com/uc?export=download&id=1FnPiepkRXcKlQtQhbTZyXwpQrJR5dqXa" alt="MapMyPlace Logo">
            <div class="app-name">MapMyPlace</div>
        </div>
        <div class="content">
            <p>Hello <b>${userName}</b>,</p>
            <p>You requested a password reset for your account at MapMyPlace. Please click the button below to reset your password:</p>
            <a href="${resetLink}" style="color:white" class="button">Reset Password</a>
            <p>If you did not request this, please ignore this email. Your password will not change.</p>
            <p>Thank you,</p>
            <p>The MapMyPlace Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 MapMyPlace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

`
  })
}