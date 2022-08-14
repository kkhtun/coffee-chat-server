const ChannelModel = require("../models/channels.model");
const makeChannelsService = require("../services/channels.service");
const makeChannelsController = require("../controllers/channels.controller");
const makeChannelsHandlerWithoutSocket = require("../handlers/channels.handler");

// imports from other modules (sad, circular dependency)

// injection
const ChannelsService = makeChannelsService({ ChannelModel });
const ChannelsController = makeChannelsController({
    ChannelsService,
});
const makeChannelsHandler = makeChannelsHandlerWithoutSocket({
    ChannelsController,
});

module.exports = {
    makeChannelsHandler,
    ChannelsService,
};
