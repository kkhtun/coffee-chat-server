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
} = require("./src/middlewares/socket-auth.middleware");

// Socket IO Handlers
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.use(isSocketAuthenticated).on("connection", async (socket) => {
    socket.emit("connection", null);
    const channelsHandler = makeChannelsHandler({ io, socket });
    socket.on("get:channels", channelsHandler.getChannels);

    // Channels as room
    socket.on("join:room", ({ channelId }) => {
        socket.leaveAll();
        socket.join(channelId);
    });

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

app.use("/", router);

app.use((err, req, res, next) => {
    if (err) {
        return res.status(500).send({ error: err.message });
    }
    return res.status(404).send({ error: "Resource Not Found" });
});
(async function main() {
    await connectToDb(process.env.MONGO_URL);
    const PORT = 8080;
    server.listen(PORT, () => console.log("Server listening at port " + PORT));
})();
