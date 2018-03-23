const API_URI = 'http://public-api.adsbexchange.com/VirtualRadar/AircraftList.json';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
var QUERY = null;
var all_aircraft_data = null;
const lng = null;
const lat = null;
var plane_array = [];
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
          QUERY = `?lat=${lat}&lng=${lng}&fDstL=0&fDstU=120`;
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

  //function puts individual plane information in an object and pushes it onto the array of all planes that are found
  function individual_plane_Data(plane){
    
    var individual_plane_info = {
      direction: 'placeholder',
      model:     'placeholder',
      altitude:  'placeholder',
      id:        'placeholder' 
    };
    if(plane.Trak > 180){
        individual_plane_info.direction = "images/east.svg";
      } else {
        individual_plane_info.direction = "images/west.svg";
      }
      individual_plane_info.model    = plane.Mdl;
      individual_plane_info.altitude = plane.Alt;
      individual_plane_info.id       = plane.Icao;
      individual_plane_info;
      plane_array.push(individual_plane_info);
  }

  //clears th eplane_array on every JSON update
  function clear_plane_array(){
    plane_array = [];
  }

  //reloading the aircraftFeed every minute and updating the aircraft list
  setInterval(availableAircraftData,10000);
  setInterval(clear_plane_array, 10000);
  setInterval(extract_all_planes_data,10000);
  setInterval(plane_list_template, 10000);

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
  function plane_list_template(){
    var templateScript = document.getElementById("plane-list-template").innerHTML;
    var theTemplate = Handlebars.compile(templateScript);
    var context = {
      plane_array
    };

    // Pass our data to the template
  var theCompiledHtml = theTemplate(context);
  var plane_listing = document.getElementById("plane-list");
  plane_listing.innerHTML = theCompiledHtml;

  }

  function btnOnClick(){
    availableAircraftData();
    clear_plane_array();
    extract_all_planes_data();
    plane_list_template();
  }
  
