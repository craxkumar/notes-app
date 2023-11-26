require('dotenv').config();

module.exports = {
    PORT: process.env.SERVER_PORT,
    DB: process.env.DB_URI,
    MONGODB_DATABASE: process.env.MONGODB_DATABASE,
};
