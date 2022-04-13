const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Channel", ChannelSchema, "channels");
