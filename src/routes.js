const router = require("express").Router();
const { UsersHandler } = require("./modules/users.module");

// User Routes
// router.post("/auth/google", UsersHandler.googleAuth);

// router.post("/login", UsersHandler.loginWithEmailManually);

// router.get("/logout", UsersHandler.logoutUser);

module.exports = { router };
