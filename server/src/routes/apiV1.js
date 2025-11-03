const express = require('express') ;

const launchesRouter = require('./launches/launches.router');
const planetsRouter = require('./planets/planets.router');

const apiV1 = express.Router();

apiV1.use('/launches' , launchesRouter) ;
apiV1.use('/planets' , planetsRouter) ;

module.exports = apiV1 ;