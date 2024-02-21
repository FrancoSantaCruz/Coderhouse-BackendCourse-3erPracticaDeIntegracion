import passport from "passport";
import { findById, findByEmail, updateOne } from "../services/users.service.js";
import { transporter } from "../utils/nodemailer.js";
import UsersDTO from "../DTOs/users.dto.js";
import config from "../config/config.js";
import { ErrorMessages, CustomError } from "../errors/error.js";
import { hashData, compareData } from "../utils/utils.js"

export const userOn = async (req, res, next) => {
    const requser = req.user;
    if (!requser) return await CustomError.createError(ErrorMessages.USER_NOT_LOGGED, ErrorMessages.ISSUE_SESSION);
    const user = await findById(requser._id);
    const userOn = new UsersDTO(user)
    return userOn;

}

export const restoreMail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await findByEmail(email);
        if (!user) return await CustomError.createError(ErrorMessages.USER_NOT_FOUND, ErrorMessages.ISSUE_SESSION);
        transporter.sendMail({
            from: config.gmail_user,
            to: email,
            subject: "Restore your password",
            html: `
        <h2>Hi ${user.first_name} ${user.last_name}:</h2>
        <p>We have received a request to change your password.</p>
        <p>Click on the button to reset your password:</p>
        <a href="http://localhost:8080/resetpassword?uid=${encodeURIComponent(user._id)}">Restore your password</a>
        `,
        });
        res.status(200).json({ message: "Email sent", to: email })
    } catch (error) {
        next(error)
    }
};

export const restorePassword = async (req, res, next) => {
    const { uid } = req.params;
    const { passwordA, passwordB } = req.body;
    try {
        if (!uid || !passwordA || !passwordB) {
            return await CustomError.createError(ErrorMessages.MISSING_DATA, ErrorMessages.ISSUE_SESSION);
        }
        let user = await findById(uid);
        if (!user) return await CustomError.createError(ErrorMessages.USER_NOT_FOUND, ErrorMessages.ISSUE_SESSION);

        if (passwordA !== passwordB) {
            return await CustomError.createError(ErrorMessages.PASSWORDS_UNMATCH, ErrorMessages.ISSUE_SESSION);
        }

        const isValid = await compareData(passwordA, user.password);
        if (isValid) return await CustomError.createError(ErrorMessages.SAME_OLDPASS, ErrorMessages.ISSUE_SESSION);

        const newPassword = await hashData(passwordA);

        const result = await updateOne(user._id, {password: newPassword})
        res.status(200).json({ message: "Password restored.", result })
    } catch (error) {
        next(error)
    }
}

export const signup = passport.authenticate('signup',
    {
        successRedirect: '/',
        failureRedirect: '/error'
    }
)

export const login = passport.authenticate('login',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage: "Invalid credentials"
    }
)

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

export const googleAuth = passport.authenticate('google', { scope: ["profile", "email"] })

export const googleAuthCb = passport.authenticate('google', { failureRedirect: '/login' })
