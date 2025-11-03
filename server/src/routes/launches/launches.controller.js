const {getAllLaunches , scheduleNewLaunch, existLaunch , deleteLaunch} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req ,res ){

  const {skip , limit} = getPagination(req.query) ;
  const launches= await getAllLaunches(skip , limit) ;
  return res.status(200).json(launches);


}
async function httpAddNewLaunches(req ,res ){
  if(!req.body.mission || !req.body.rocket || !req.body.target || !req.body.launchDate){
    return res.status(400).json({
      error : "missing required launch property"
    });
  }
  if(isNaN(new Date(req.body.launchDate).valueOf())){
    return res.status(400).json({error : "Invalid Date"});
  }
  //another way to check date
  // if(req.body.launchDate.toString() === "Invalid Date"){
  //   return res.status(400).json({error : "Invalid Date"});
  // }
  launch = {
    ...req.body,
    launchDate : new Date(req.body.launchDate)
  }
  const resp = await scheduleNewLaunch(launch);
    console.log(launch); 
  return res.status(201).json({
    message :"launch is added successfuly" ,
    data : resp
  });


}
async function httpDeleteLaunch(req ,res ){
  const launchId  = Number(req.params.id); 
  const exist = await existLaunch(launchId) ; 
  if(!exist){
    return res.status(404).json({
      error: "there no flight with this id "
    })
  }else{
    const resp =  await deleteLaunch(launchId) ;
    return res.status(200).json({
      message : "launch is deleted successfuly" ,
      data : resp
    })
  }
   
}



module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunches,
  httpDeleteLaunch
}