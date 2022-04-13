const UserModel = require("../models/users.model");
const makeUsersService = require("../services/users.service");
const makeUsersController = require("../controllers/users.controller");
const makeUsersHandler = require("../handlers/users.handler");

const UsersService = makeUsersService({ UserModel });
const UsersController = makeUsersController({
    UsersService,
});
const UsersHandler = makeUsersHandler({
    UsersController,
});

module.exports = {
    UsersHandler,
    UsersService,
};
