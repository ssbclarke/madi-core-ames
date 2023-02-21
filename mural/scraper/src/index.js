const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const authRoutes = require("./auth/auth.routes")
const converterRoutes = require("./converter/converter.routes")

app.use(express.json());
app.use(express.urlencoded());
// app.use(express.multipart());

app.use(cookieParser());

app.use(authRoutes)
app.use(converterRoutes)

module.exports = app;
