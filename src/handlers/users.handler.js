const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const moment = require("moment");
const jwt = require("jsonwebtoken");

module.exports = ({ UsersController }) => ({});
