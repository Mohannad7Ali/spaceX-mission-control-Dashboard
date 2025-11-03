const Launch = require("./launches.mongo");
const planet = require("./planetes.mongo");
const axios = require('axios')
const SPACE_X_API_URL = 'https://api.spacexdata.com/v5/launches/query' ;
const launches = new Map() ; 
let lastFlightNumber = 100 ;
const launch  ={
  flightNumber : 100 ,
  mission : "any" ,
  rocket : "any" ,
  launchDate : new Date("December 27, 2025") ,
  target : "any" ,
  customers : ["a" , "b"] ,
  upcoming :true,
  success :true,
}

async function findLaunch(filter){
  return await Launch.findOne(filter) ;
}
async function populateLaunches(){
  const response = await axios.post(SPACE_X_API_URL , {
  query: {},
  options: {
    pagination:false,
    populate:[
        {
            path:"rocket",
            select:{
                name:1
            }
        },
        {
            path:"payloads",
            select:{
                "customers":1
            }
        }
    ]
  }
});
if(response.status !=200){
  console.log(`failed to load launches`);
  throw new error('failed to load launches')
}
const launchDocs = response.data.docs ;
for(const launchDoc of launchDocs){
  const payloads = launchDoc['payloads'] ;
  const customers = payloads.flatMap((payload) => {
    return payload['customers'] ;
  }) ;
  const launch = {
    flightNumber : launchDoc['flight_number'] ,
    mission : launchDoc['name'] ,
    rocket : launchDoc['rocket']['name'] ,
    launchDate : launchDoc['date_local'] ,
    upcoming : launchDoc['upcoming'] ,
    success : launchDoc['success'] ,
    customers : customers ,
  } ;
  console.log(`${launch.flightNumber} ${launch.mission}`) ;
  saveLaunch(launch) ;
}

}




async function loadLaunches(){
  const firstLaunch = await Launch.findOne({
    mission:"FalconSat" ,
    flightNumber:1 ,
  })
  if(firstLaunch){
    console.log(`launches is already downloaded`)
  }else{
      console.log("loading launches ...") ;
      await populateLaunches() ;
  }

  
}

launches.set(launch.flightNumber , launch);



async  function getAllLaunches(skip , limit){
  const launches = await Launch
  .find({} , {"_id" : 0 , "__v" : 0}) 
  .sort({flightNumber:1})
  .skip(skip)
  .limit(limit)
  ;
  return launches ;
  // return Array.from(launches.values() );
}



function addNewLaunch(launch){
  // const launch = {
  //   ...launch,
  //   flightNumber : lastFlightNumber ,
  //   upcoming:true,
  //   success :true,
  //    customers : ["a" , "b"]
  // };
  lastFlightNumber ++;
  Object.assign(launch, {
    flightNumber: lastFlightNumber,
    upcoming:true,
    success :true,
    customers : ["a" , "b"]
  })
  launches.set(lastFlightNumber, launch);
  return launch;
}
async function existLaunch(id){
  const launch = await findLaunch({flightNumber:id}) ;
  return launch != null ;
}
async function deleteLaunch(id){
  //updateOne
  const aborted = await Launch.findOneAndUpdate({
    flightNumber : id,
  },{
    upcoming : false ,
    success : false ,
  })
  return aborted;
  // const launch = launches.get(id) ;
  // // launches.delete(id) ;
  // launch.upcoming = false ;
  // launch.success = false ;
  // return launch ;
}
async function saveLaunch(launch){
  
  try {
    await Launch.findOneAndUpdate({
      flightNumber : launch.flightNumber
    } , launch , {upsert : true}) ;
    } catch (error) {
      console.error("could not save launch" , error) ;
  }
}
async function getLatestFlightNumber(){
  const launch = await Launch.findOne().sort('-flightNumber');
  if(!launch){
    return 100 ;
  }else{
    return launch.flightNumber ;
  }
}
async function scheduleNewLaunch(launch){
  const l = planet.findOne({kepler_name : launch.kepler_name}) ;

  if(!l){
    throw new Error("no matching planet found") ;
  }
  const newflightNumber = await getLatestFlightNumber() + 1 ;
  const newLaunch = Object.assign(launch , {
    flightNumber : newflightNumber ,
    upcoming : true ,
    success : true ,
    customers : ["ZTM" , "NASA"] ,
  });
  await saveLaunch(newLaunch );
  return newLaunch ;
}


module.exports = {
  loadLaunches ,
  getAllLaunches ,
  scheduleNewLaunch ,
  existLaunch ,
  deleteLaunch ,
} ;