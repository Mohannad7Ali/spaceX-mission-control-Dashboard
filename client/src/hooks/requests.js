const url = "https://localhost:8000/v1"
async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  try {
    const response = await fetch(`${url}/planets`) ;
    return await response.json() ;
  }catch (e) {
        console.log(e) ;
  }
  
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${url}/launches`) ;
    const launches =  await response.json() ;
    return launches.sort((a, b) => {
      return a.fligthNumber - b.fligthNumber ;
    })
}

async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.
try {
    return await fetch(`${url}/launches` , {
    method : "POST" ,
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify(launch)
  }) ;
}catch{
  return {
    ok : false,
  }
}
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    return await fetch(`${url}/launches/${id}` , {
    method : "DELETE" ,
  }) ;
  }catch(err){
    return {
      ok : false,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};