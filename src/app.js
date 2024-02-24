import express from "express";
import handlebars from "express-handlebars";

// Libraries
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { Server } from 'socket.io' // WebSocket

//Config
import "./config/db.config.js";
import config from "./config/config.js";

//Utils
import "./utils/passport.js";
import { logger } from "./utils/winston.js";
import { __dirname } from "./utils/utils.js";

// Middlewares
import cors from 'cors'
import { cartInformation } from "./middlewares/cart.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { swaggerSetup } from "./utils/swaggerSpecs.js";
import swaggerUi from "swagger-ui-express";


// Routes
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import ticketsRouter from "./routes/tickets.router.js";
import testRouter from "./routes/test.router.js";

// Services
import { findByEmail } from "./services/users.service.js";
import { findById, updateOne, findByField } from "./services/messages.service.js";


const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        store: new MongoStore({
            mongoUrl: config.mongo_uri,
        }),
        secret: config.session_secret,
        cookie: { maxAge: 60000*5 },
    })
);

app.use(cors())

// passport
app.use(passport.initialize());
app.use(passport.session());

// handlebars
app.engine("handlebars", handlebars.engine({
    // handlebars helpers
    helpers: {
        ifEquals: function(arg1, arg2) {
            return (arg1 == arg2) ? true : false
        }
    }
}));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middlewares Globales
// app.use(cartInformation())

// routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/test", testRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));

// app.use(errorMiddleware)

const httpServer = app.listen(8080, () => {
    logger.info("Server is running on port 8080. -> http://localhost:8080/");
});




const socketServer = new Server(httpServer);

// ----------------------------- WebSocket ------------------------------------
socketServer.on('connection', (socket) => {
    let userFound;
    socket.on('userJoin', async (user) => {
        userFound = await findByEmail(user.email);
        socket.emit('newUserBroadcast', userFound);
    });
    socket.on('message', async (msg) => {
        let chat = {
            chats: [
                {
                    autor: userFound._id,
                    content: msg.message,
                    date: new Date()
                }
            ]
        }; 
        let chatFound = await findById(msg.cid);
        chatFound.chats = [...chatFound.chats, ...chat.chats];
        await updateOne(msg.cid, chatFound);

        let messages = await findByField({ '_id': msg.cid });
        socketServer.emit('chat', messages.chats);
    });
});