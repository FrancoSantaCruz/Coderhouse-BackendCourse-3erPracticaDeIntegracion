import { CustomError, ErrorMessages } from "../errors/error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { logger } from "../utils/winston.js";

import {
    findAll as findAllMsg,
    findByField as findByFieldMsg,
    createOne as createMsg
} from "../services/messages.service.js";

import {
    findAll as findAllProd,
    findById as findByIdProd,
} from "../services/products.service.js";



export async function isLogged(req, res) {
    const cookie = req.cookies["token"];
    let myCart = req.cookies["Cart"]
    let user = undefined;
    if (cookie) {
        try {
            user = jwt.verify(cookie, config.jwt_secret);
            if(myCart) user.cart = myCart
        } catch (error) {
            if(error instanceof jwt.TokenExpiredError){
                res.clearCookie('token');
                res.clearCookie('Cart');
            } else {
                logger.error("Error al verificar el token", error.message);
            }
        }
    };
    return user;
}


export const homeView = async (req, res) => {
    try {
        let ctx = {};
        const user = await isLogged(req, res);
        if (user) {
            ctx.user = user;
            ctx.cart = user.cart;
        }
        res.render('home', ctx)
    } catch (error) {
        if (error.status) res.status(error.status).send({ Type: error.name, Error: error.message })
        res.status(500).send({ Type: error.name, Error: error.message });
    }
};


export const loginView = async (req, res) => {
    res.render('login')
};

export const signupView = async (req, res) => {
    res.render("signup");
};

export const resetMessage = async (req, res) => {
    try {
        res.render("restore_message");
    } catch (error) {
        if (error.status) res.status(error.status).send({ Type: error.name, Error: error.message })
        res.status(500).send({ Type: error.name, Error: error.message })
    }
};

export const resetPassword = async (req, res) => {
    try {
        let ctx = { uid: req.query.uid }
        res.render("restore_password", ctx);
    } catch (error) {
        if (error.status) res.status(error.status).send({ Type: error.name, Error: error.message })
        res.status(500).send({ Type: error.name, Error: error.message })
    }
};

// CHATS VIEWS
export const allChatsView = async (req, res) => {
    try {
        const chats = await findAllMsg();
        let ctx = { chats: chats }
        const user = await isLogged(req, res);
        if (user) {
            ctx.user = user;
            ctx.cart = user.cart;
        }
        res.render('allChats', ctx);
    } catch (error) {
        if (error.status) res.status(error.status).send({ Type: error.name, Error: error.message })
        res.status(500).send({ Type: error.name, Error: error.message })
    }
};


export const newChat = async (req, res) => {
    const { chatTitle } = req.body
    try {
        if (!chatTitle) {
            return res.status(400).json({ message: 'Some data is missing.' })
        }
        const chats = await createMsg({ chats: [], title: chatTitle })
        res.redirect('/chats')
    } catch (error) {
        if (error.status) res.status(error.status).send({ Type: error.name, Error: error.message })
        res.status(500).send({ Type: error.name, Error: error.message })
    }
};


export const chatView = async (req, res) => {
    try {
        const { cid } = req.params;
        const chat = await findByFieldMsg({ '_id': cid });
        let ctx = {};
        const user = await isLogged(req, res);
        if (user) {
            ctx.user = user;
            ctx.cart = user.cart;
        }
        ctx.chat = chat._id
        ctx.messages = chat.chats

        res.render("chat", ctx);
    } catch (error) {
        if (error.status) res.status(error.status).send({ Type: error.name, Error: error.message })
        res.status(500).send({ Type: error.name, Error: error.message })
    }
};


// ------PRODUCTS VIEW
// All products
export const allProductsView = async (req, res) => {
    try {
        const products = await findAllProd(req.query)
        products.payload.forEach(e => {
            if (e.sale) {
                e["sale_price"] = e.price - (Math.round(e.price * (e.sale_percent / 100)))
            }
        });

        let ctx = { products: products.payload, info: products }
        const user = await isLogged(req, res);
        if (user) {
            ctx.user = user;
            ctx.cart = user.cart;
        }

        res.render('products_all', ctx)
    } catch (error) {
        if (error.status) res.status(error.status).send({ Type: error.name, Error: error.message })
        res.status(500).send({ Type: error.name, Error: error.message })
    }
};

// Product detail
export const productDetailsView = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await findByIdProd(pid)
        let ctx = { product }

        const user = await isLogged(req, res);
        if (user) {
            ctx.user = user;
            ctx.cart = user.cart;
        }

        res.render('products_detail', ctx)
    } catch (error) {
        if (error.status) res.status(error.status).send({ Type: error.name, Error: error.message })
        res.status(500).send({ Type: error.name, Error: error.message })
    }
};

