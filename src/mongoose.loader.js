var mongoose = require("mongoose");

module.exports = function connect(url) {
    mongoose.connection.once("open", () => {
        const dbUrl = new URL(url);
        console.log(`Connected to database @ ${dbUrl.host}`);
    });

    mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error", err);
    });

    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    });
};
