export const setTokenCookie = (req, res, next) => {
    if (req.user && req.user.token) {
        req.session.user = { id: req.user._id };
        res.cookie('token', req.user.token, { httpOnly: true });
        const response = req.cookies.token;
        res.status(200).send({message: "Login success", Token: response})
    }
    next()
};