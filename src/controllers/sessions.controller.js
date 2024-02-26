import { findById, findByEmail, updateOne } from "../services/users.service.js";
import { transporter } from "../utils/nodemailer.js";
import { ErrorMessages, CustomError } from "../errors/error.js";
import { hashData, compareData } from "../utils/utils.js";
import passport from "passport";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

function temporalTokenGenerator(email) {
    let random_code = "";
    let random = 0;
    for (let i = 0; i < 10; i++) {
        random = Math.floor(Math.random() * email.length);
        random_code = random_code.concat(random);
    };
    return random_code;
}

export const current = async (req, res) => {
    try {
        const cookie = req.cookies['token']
        const user = jwt.verify(cookie, config.jwt_secret);
        if (user)
            return res.status(200).send({ message: "success", user });
    } catch (error) {
        res.status(500).send({ Type: error.name, Error: error.message })
    }
}

export const restoreMail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await findByEmail(email);
        if (!user) throw CustomError.createError(ErrorMessages.USER_NOT_FOUND, ErrorMessages.ISSUE_SESSION, 404);

        const token = temporalTokenGenerator(email);

        transporter.sendMail({
            from: config.gmail_user,
            to: email,
            subject: "Restore your password",
            html: `
        <h2>Hi ${user.first_name} ${user.last_name}:</h2>
        <p>We have received a request to change your password.</p>
        <p>Click on the button to reset your password:</p>
        <a href="http://localhost:8080/resetpassword?uid=${encodeURIComponent(user._id)}&token=${encodeURIComponent(token)}">Restore your password</a>
        `,
        });
        await updateOne(user._id, {restore_password: token});
        res.status(200).json({ message: "Email sent", to: email })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};

export const restorePassword = async (req, res, next) => {
    const { uid } = req.params;
    const { passwordA, passwordB } = req.body;
    try {
        if (!uid || !passwordA || !passwordB) {
            throw CustomError.createError(ErrorMessages.MISSING_DATA, ErrorMessages.ISSUE_SESSION, 400);
        }
        let user = await findById(uid);
        if (!user) throw CustomError.createError(ErrorMessages.USER_NOT_FOUND, ErrorMessages.ISSUE_SESSION, 404);

        if (passwordA !== passwordB) {
            throw CustomError.createError(ErrorMessages.PASSWORDS_UNMATCH, ErrorMessages.ISSUE_SESSION, 400);
        }

        const isValid = await compareData(passwordA, user.password);
        if (isValid) throw CustomError.createError(ErrorMessages.SAME_OLDPASS, ErrorMessages.ISSUE_SESSION, 400);

        const newPassword = await hashData(passwordA);

        const result = await updateOne(user._id, { password: newPassword, restore_password: "false" })
        
        res.status(200).json({ message: "Password restored.", result })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
}

export const signup = passport.authenticate('signup',
    {
        successRedirect: '/',
        failureMessage: true
    }
)

export const login = passport.authenticate('login')

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('token');
        res.clearCookie('Cart');
        res.redirect('/')
    })
}

export const googleAuth = passport.authenticate('google', { scope: ["profile", "email"] })

export const googleAuthCb = passport.authenticate('google', { failureRedirect: '/login' })
