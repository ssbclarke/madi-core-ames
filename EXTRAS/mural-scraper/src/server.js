const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const config = require('./config')
const authRoutes = require("./auth/auth.routes")
const converterRoutes = require("./converter/converter.routes")

app.use(express.json());
app.use(cookieParser());

//Routes
app.use(authRoutes)
app.use(converterRoutes)

app.listen(config.serverPort, ()=>{
    console.log(`Example app listening at http://localhost:${config.serverPort}`);
    console.log('Go here: http://localhost:5000/converter?actId=mtcleverest3967&muralId=1660683804692');
});
module.exports = app