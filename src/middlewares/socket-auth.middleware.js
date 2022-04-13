const UserModel = require("../models/users.model");
const jwt = require("jsonwebtoken");

async function isSocketAuthenticated(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) next(new Error("Not Authorized"));
    try {
        const { email, last_login_at } = await jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await UserModel.findOne({ email, last_login_at }).exec();
        if (!user) throw new Error("Not Authorized");
        next();
    } catch (e) {
        next(new Error(e.message));
    }
}

module.exports = { isSocketAuthenticated };
