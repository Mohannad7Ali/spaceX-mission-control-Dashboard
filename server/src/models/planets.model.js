const planets = require('./planetes.mongo') ;

const {parse} = require("csv-parse") ;
const fs = require("fs") ; 
const path = require("path") ;
const result = [] ; // you can modify content but you cannot reassign it

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] == 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
  && planet['koi_prad'] < 1.6;
}

async function loadPlanets(){
  return new Promise(function(resolve, reject){
    fs.createReadStream(path.join(__dirname,".." ,"..","data","kepler_data.csv") )
  .pipe(parse(
    {
      comment:"#" , 
      columns:true ,
    }
  )) // connect between readable stream source and destination stream 
  .on("data" , async function(data){
    if(isHabitablePlanet(data)){
          // result.push(data) ;
          try {
            await planets.updateOne({
              kepler_name : data.kepler_name,
            } , {
              kepler_name : data.kepler_name,
            } , {
              upsert : true , 
            }) 
          } catch (error) {
            console.log(`couldn't insert planets ${error}`)
          }
      

    }
    // console.log(result) ; // it is buffers object that store bytes
  })
  .on("error" , (err)=>{
    console.log(err) ;
    reject(err) ;
  })
  .on("end" , async ()=>{
    const len = (await planets.find({})).length ;
    console.log(`${len} Habitable Planet`)   ;
    resolve() ;
  });
  });
}
async function getAllPlanets(){
  try {
    
    return await planets.find({} ,{
      __v:0 ,
      __id:0,
    }); 
  } catch (error) {
    console.log(`couldn't get planets ${error}`) ;
  }
  
}

  module.exports = {
    loadPlanets: loadPlanets,
    getAllPlanets:getAllPlanets
  } ;