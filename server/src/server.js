const fs = require('fs') ;
const https = require('https') ; 
const mongoose = require('mongoose') ; 
const app = require("./app");
require('dotenv').config() ;
const {loadPlanets} = require("./models/planets.model");
const {loadLaunches} = require("./models/launches.model");
const { mongoConnect } = require('./services/mongo') ;
const { start } = require('repl');
const port = process.env.PORT || 8000 ;

const server = https.createServer({
  key: fs.readFileSync('key.pem') ,
  cert: fs.readFileSync('cert.pem') ,
},app) ; 

async function startServer() {
  await mongoConnect() ;
  await loadPlanets() ;
  await loadLaunches() ;
  
server.listen(port , ()=>{
  console.log("Server Running") ;
  console.log(`https://localhost:${port}`) ;
}) ;
}
mongoose.connection.once('open' , ()=>{
  console.log("MongoDB connection ready!") ;
}) ;
mongoose.connection.on('error' , (err)=>{
  console.error(err) ;
});
startServer() ;