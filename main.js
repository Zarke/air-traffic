const API_URI = 'http://public-api.adsbexchange.com/VirtualRadar/AircraftList.json';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
var QUERY = null;
var all_aircraft_data = null;
const lng = null;
const lat = null;
//runs the geoFindMe function on load
(() => {
  geoFindMe();
})();


function geoFindMe() {
        if (!navigator.geolocation){
            output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
            return;
        }
        //if user's position has been determined it is entered into the QUERY variable 
        function success(position) {
          let lng = position.coords.longitude;
          let lat = position.coords.latitude;
          QUERY = `?lat=${lat}&lng=${lng}&fDstL=0&fDstU=200`;
          console.warn("User successfuly located");
        }
  
        function error() {
          console.warn("User location is required in order to use this app");
        }

       navigator.geolocation.getCurrentPosition(success, error);
  
  }

    //extracts the JSON file into a variable
  function availableAircraftData(){
    const FULL_URL = `${CORS_PROXY}${API_URI}${QUERY}`;
    fetch(FULL_URL)
    .then(
      function(response) {
        if(response.status !== 200){
          console.log("Shit went south..." + response.status);
          return;
        }

        //store data from response into a global variable
        response.json().then(function(data){
          all_aircraft_data = data;
        });
      }
    )
  }

  //function for listing all data for a specific aircraft
  function individual_plane_Data(plane){
      if(plane.Trak > 180){
        console.log("It's west bound");
      } else {
        console.log("It's east bound");
      }
      console.log(plane.Mdl);
      console.log(plane.Alt);
      console.log(plane.Icao);
  }
  //reloading the aircraftFeed every minute
  setInterval(availableAircraftData,60000);
  setInterval(extract_all_planes_data,60000);

  //function that checks if there are planes in the users area
  function get_aircraft_list(){
    if(all_aircraft_data && all_aircraft_data.hasOwnProperty('acList')) {
      return all_aircraft_data.acList;
    }
    return null;
  }

  //function that parses data on a plane per plane basis to individual_plane_Data() function
  function extract_all_planes_data (){
    var airCraftList = get_aircraft_list();
    airCraftList.map((plane) => {
      individual_plane_Data(plane);
    })
  }
  

  function btnOnClick(){
    availableAircraftData();
    extract_all_planes_data();
  }
  
