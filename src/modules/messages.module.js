const MessageModel = require("../models/messages.model");
const makeMessagesService = require("../services/messages.service");
const makeMessagesController = require("../controllers/messages.controller");
const makeMessagesHandlerWithoutSocket = require("../handlers/messages.handler");

// Other Modules
const { ChannelsService } = require("./channels.module");
const { UsersService } = require("../modules/users.module");

const MessagesService = makeMessagesService({ MessageModel });
const MessagesController = makeMessagesController({
    MessagesService,
    ChannelsService,
    UsersService,
});
const makeMessagesHandler = makeMessagesHandlerWithoutSocket({
    MessagesController,
});

module.exports = {
    makeMessagesHandler,
};
