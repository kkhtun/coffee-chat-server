const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const moment = require("moment");
const jwt = require("jsonwebtoken");

module.exports = ({ UsersController }) => ({
    googleAuth: async (req, res, next) => {
        // move this to service functions later
        try {
            const { token } = req.body;
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const { name, email, picture } = ticket.getPayload();
            // Upsert the user to database
            const last_login_at = moment().utc().toISOString();
            const user = await UsersController.syncUser({
                name,
                email,
                picture,
                last_login_at,
            });

            let jwtToken = jwt.sign(
                { email, last_login_at },
                process.env.JWT_SECRET
            );
            return res.status(201).json({
                email,
                userId: user._id,
                token: jwtToken,
                message:
                    "Please send the token in Authorization header with the value Bearer {token}",
            });
        } catch (e) {
            return res.status(400).send({ error: e.message });
        }
    },

    // optional route, not necessary
    logoutUser: async (req, res, next) => {
        try {
            const { email } = req.user;
            const loggedOutUser = await UsersController.logoutUser({ email });
            return res.status(200).send({
                user: loggedOutUser,
                status: true,
                message: "User Logged Out",
            });
        } catch (e) {
            return res.status(401).send({ error: e.message });
        }
    },
    // temporary route cause google OAuth sucks
    loginWithEmailManually: async (req, res, next) => {
        const { email } = req.body;
        const last_login_at = moment().utc().toISOString();
        try {
            if (!email) throw new Error("No Email");

            const user = await UsersController.loginWithEmailManually({
                email,
                last_login_at,
            });
            let jwtToken = jwt.sign(
                { email, last_login_at },
                process.env.JWT_SECRET
            );
            return res.status(201).json({
                email,
                userId: user._id,
                token: jwtToken,
                message:
                    "Please send the token in Authorization header with the value Bearer {token}",
            });
        } catch (e) {
            return res.status(401).send({ error: e.message });
        }
    },
});
