const express = require('express');
const app = express();

require('dotenv').config();
require('./db/db.js');

const bodyparser = require('body-parser')
app.use(bodyparser.json());

const authRouter = require('./routes/authRouter.js');

app.use('/auth', authRouter);

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port: ${process.env.PORT}`);
})