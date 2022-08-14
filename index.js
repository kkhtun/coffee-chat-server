require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

// Custom Modules and Files
const connectToDb = require("./src/mongoose.loader");
const { makeMessagesHandler } = require("./src/modules/messages.module");
const { makeChannelsHandler } = require("./src/modules/channels.module");
const { router } = require("./src/routes");
const {
    isSocketAuthenticated,
} = require("./src/middlewares/is-authenticated.middleware");

// Socket IO Handlers
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.use(isSocketAuthenticated).on("connection", async (socket) => {
    socket.emit("connection", "Socket connected");

    // Channels as room
    const channelsHandler = makeChannelsHandler({ io, socket });
    socket.on("get:channels", channelsHandler.getChannels);
    socket.on("join:room", ({ channelId }) => {
        socket.leaveAll();
        socket.join(channelId);
    });
    socket.on("create:channel", channelsHandler.createChannel);
    socket.on("delete:channel", channelsHandler.deleteChannel);

    // message related
    const messageHandler = makeMessagesHandler({ io, socket });
    socket.on("get:messages", messageHandler.getMessages);
    socket.on("send:message", messageHandler.createMessage);
    socket.on("delete:message", messageHandler.deleteMessage);
    socket.on("get:more-messages", messageHandler.getMoreMessages);
});

// Express Routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
    return res.status(200).send("Hello there!");
});

app.use("/", router);

app.use((err, req, res, next) => {
    console.log(err.message);
    return res.status(500).send({ error: err.message });
});

app.use((req, res, next) => {
    return res.status(404).send({ error: "Resource Not Found" });
});

// Main
(async function main() {
    await connectToDb(process.env.MONGO_URL);
    server.listen(process.env.PORT, () =>
        console.log("Server listening at port " + process.env.PORT)
    );
})();
