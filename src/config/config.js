import dotenv from "dotenv";

dotenv.config()

export default {
    environment: process.env.ENVIRONMENT,
    mongo_uri: process.env.MONGO_URI,
    google_client_id: process.env.GOOGLE_CLIENT_ID ,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.GOOGLE_callbackURL,
    session_secret: process.env.SESSION_SECRET,
    nodemailer_gmail_user: process.env.NODEMAILER_GMAIL_USER,
    nodemailer_gmail_password: process.env.NODEMAILER_GMAIL_PASSWORD,
    jwt_secret: process.env.JWT_SECRET,
}