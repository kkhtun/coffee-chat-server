const router = require("express").Router();
const { UsersHandler } = require("./modules/users.module");
const {
    isAuthenticated,
    extractTokenUser,
} = require("../src/middlewares/is-authenticated.middleware");

// User Routes
router.post("/auth/google", UsersHandler.googleAuth);

router.post("/login", UsersHandler.loginWithEmailManually);

router.get(
    "/logout",
    extractTokenUser,
    isAuthenticated,
    UsersHandler.logoutUser
);

module.exports = { router };
