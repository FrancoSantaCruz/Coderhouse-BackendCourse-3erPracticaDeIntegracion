import { Router } from "express";
import { current, signup, login, logout, googleAuth, googleAuthCb, restoreMail, restorePassword } from "../controllers/sessions.controller.js";
import { setTokenCookie } from "../middlewares/tokenCookie.middleware.js";

const router = Router();

router.get('/current', current);

router.post('/signup', signup);

router.post('/login', login, setTokenCookie);

router.get('/logout', logout);

router.post('/restore', restoreMail);

router.post('/restore/:uid', restorePassword);

router.get('/auth/google', googleAuth);

router.get('/auth/google/callback', googleAuthCb, function (req, res) {
    res.redirect('/');
});




export default router;