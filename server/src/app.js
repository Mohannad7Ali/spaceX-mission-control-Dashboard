const express = require("express") ; 
const path = require("path") ; 
const cors = require("cors");
const morgan = require("morgan");
const apiV1 = require("./routes/apiV1");

const app = express() ;

app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(morgan(':method   :url   :status  :res[content-length] -   :response-time ms'))
// app.use(morgan('combined'))
app.use(express.json()) ;
app.use(express.static(path.join(__dirname, ".." , "public"))) ;

app.use('/v1',apiV1);

app.get(/.*/, function(req, res){    // * to make routes in react work 
  res.sendFile(path.join(__dirname, "..","public" , "index.html"))
})
module.exports = app ;