const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('DB connected successfully');
})

db.on('disconnected', () => {
    console.log('DB disconnected');
})

db.on('error', (err) => {
    console.log(err);
})

module.exports = db;