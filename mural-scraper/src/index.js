const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const authRoutes = require("./auth/auth.routes")
const converterRoutes = require("./converter/converter.routes")

app.use(express.json());
app.use(cookieParser());


app.use(authRoutes)
app.use(converterRoutes)


// app.get('/api', (req, res) => {
//     const path = `/api/item`
//     res.setHeader('Content-Type', 'text/html');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
// });

module.exports = app;

// export default function handler(req,res) {
//     // api/[name].ts -> /api/lee
//     // req.query.name -> "lee"
//     // const { name } = request.query;
//     // return response.end(`Hello ${name}!`);

  

//     res.setHeader('Content-Type', 'text/html');
//     res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    
//     // app.use(express.json());
//     // app.use(cookieParser());

//     //Routes
//     // app.use(authRoutes)
//     // app.use(converterRoutes)
    


//   }