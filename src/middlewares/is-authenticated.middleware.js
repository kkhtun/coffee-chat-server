const UserModel = require("../models/users.model");
const jwt = require("jsonwebtoken");

async function extractTokenUser(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).send({ error: "Unauthorized" });
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

module.exports = { isAuthenticated, extractTokenUser };
