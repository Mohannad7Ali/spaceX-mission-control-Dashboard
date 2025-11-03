const express = require("express");
const {httpGetAllLaunches , httpAddNewLaunches , httpDeleteLaunch} = require("./launches.controller");
const launchesRouter = express.Router(); 

launchesRouter.get("/", httpGetAllLaunches) ; 
launchesRouter.post("/", httpAddNewLaunches)
launchesRouter.delete("/:id", httpDeleteLaunch)

module.exports = launchesRouter;   