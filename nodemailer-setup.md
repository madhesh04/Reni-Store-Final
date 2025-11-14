# Nodemailer Setup Instructions

## 1. Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App passwords
4. Generate an app password for "Mail"
5. Copy the 16-character password

## 2. Update Environment Variables
Edit `.env` file and replace `your_app_password_here` with your Gmail app password:
```
EMAIL_USER=xxxxx
EMAIL_PASS=xxxxx
```

## 3. Run the Application
1. Start the backend server:
   ```
   npm run server
   ```

2. In a new terminal, start the frontend:
   ```
   npm start
   ```
