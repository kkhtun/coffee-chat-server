const UserModel = require("../models/users.model");
const UserService = require("../services/users.service")({ UserModel });
const FirebaseService = require("../services/firebase.service")({});
const jwt = require("jsonwebtoken");

async function extractTokenUser(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return next();
    }
    const arrToken = bearerToken.split(" ");
    if (arrToken[0] !== "Bearer" || !arrToken[1]) {
        return res.status(401).send({ error: "Invalid Token" });
    }

    try {
        const { email, last_login_at } = await jwt.verify(
            arrToken[1],
            process.env.JWT_SECRET
        );
        req.user = await UserModel.findOne({ email, last_login_at }).exec();
        next();
    } catch (e) {
        return res.status(401).send({ error: "Invalid or Expired Token" });
    }
}

async function isAuthenticated(req, res, next) {
    if (req.user && req.user.email) {
        next();
    } else {
        return res.status(401).send({ error: "Not Authorized" });
    }
}

async function isSocketAuthenticated(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) next(new Error("Invalid Token"));

    try {
        const {
            uid: firebase_id,
            name,
            email,
        } = await FirebaseService.verifyToken(token);

        socket.data.user = await UserService.syncUser(
            { firebase_id },
            { firebase_id, name, email }
        );
        socket.data.token = token;
        return next();
    } catch (e) {
        console.log(e);
        return next(new Error("Invalid Token"));
    }
}

module.exports = { isAuthenticated, extractTokenUser, isSocketAuthenticated };
