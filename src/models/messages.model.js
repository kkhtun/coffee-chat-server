const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
        },
        channel_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Channel",
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema, "messages");
