const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        picture: {
            type: String,
        },
        last_login_at: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema, "users");
