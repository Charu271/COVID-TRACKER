
function searchData()
{ 
    async function getCovidSearch(){
    const response= await fetch('https://corona-api.com/countries')
    const da= await response.json();
    var value= document.getElementById("search").value
    console.log(value);
    var arr_length=da.data.length;
    console.log(arr_length);
   
    for(var i=0;i<arr_length;i++)
    {
        if(da.data[i].name.toLowerCase()===value.toLowerCase())
        {
            
            document.getElementById("confirmed").innerHTML=da.data[i].latest_data.confirmed;
            document.getElementById("recovered").innerHTML=da.data[i].latest_data.recovered;
            document.getElementById("death").innerHTML=da.data[i].latest_data.deaths;
           
            break;
        }
    }
    if(i===arr_length)
    {
      document.getElementById("confirmed").innerHTML="---";
            document.getElementById("recovered").innerHTML="---";
            document.getElementById("death").innerHTML="---";
    }
     else
     document.getElementById("country").innerHTML=da.data[i].name;


    
    }
    getCovidSearch();
}
async function getCovidData()
{
    const response= await fetch('https://api.thevirustracker.com/free-api?global=stats')
    const data=await response.json();
    document.getElementById("confirmed").innerHTML=data.results[0].total_cases;
    document.getElementById("recovered").innerHTML=data.results[0].total_recovered;
    document.getElementById("death").innerHTML=data.results[0].total_deaths;
   
}
getCovidData()
.then(response=>{
    //console.log(data);
})
.catch(error=>{
    console.log("error");
})
async function getDeathStats()
{
    xlabel=[];
    ylabel=[];
    const response=await fetch('https://covid.ourworldindata.org/data/ecdc/total_deaths.csv');
    const data=await response.text();
    const table=data.split('\n').splice(80);
    table.forEach(row=>{
        const column=row.split(',');
        if(column[0]===undefined || column[0]===NaN)
        column[0]=0;
        const x=column[0];
        if(column[1]===undefined|| column[1]==NaN)
        column[1]=0;
        const y=column[1];
        xlabel.push(x);
        ylabel.push(y);
       // console.log(x);
        //console.log(y);
    })
    return {xlabel,ylabel};
}

async function chartItdeath()
{
    const data=await  getDeathStats();
    var ctx = document.getElementById('deathChart').getContext('2d');
var myChart = new Chart(ctx, {
type: 'line',
data: {
labels: data.xlabel,
datasets: [{
    label: 'Death cases',
    data:data.ylabel,
    
    backgroundColor: [
        'rgba(184, 165, 163, 0.5)'
    ],
    borderColor: [
        'rgba(89, 82, 81, 1)',

    ],
    borderWidth: 1,
}]
},
});
}
chartItdeath();

async function getConfirmedStats()
{
    xlabel=[];
    ylabel=[];
    const response=await fetch('https://covid.ourworldindata.org/data/ecdc/total_cases.csv');
    const data=await response.text();
    const table=data.split('\n').splice(80);
    table.forEach(row=>{
        const column=row.split(',');
        if(column[0]===undefined || column[0]===NaN)
        column[0]=0;
        const x=column[0];
        if(column[1]===undefined|| column[1]==NaN)
        column[1]=0;
        const y=column[1];
        xlabel.push(x);
        ylabel.push(y);
        //console.log(x);
        //console.log(y);
    })
    return {xlabel,ylabel};
}

async function chartItconfirmed()
{
    const data=await  getConfirmedStats();
    var ctx = document.getElementById('confirmedChart').getContext('2d');
var myChart = new Chart(ctx, {
type: 'line',
data: {
labels: data.xlabel,
datasets: [{
    label: 'Confirmed cases',
    data:data.ylabel,
    
    backgroundColor: [
        'rgba(232, 148, 142,0.5)'
    ],
    borderColor: [
        'rgba(219, 33, 20, 1)',

    ],
    borderWidth: 0
}]
},
});
}
chartItconfirmed(); 
function updateMap()
{
  
    fetch('https://corona-api.com/countries')
    .then(response=> response.json())
    .then(da=>{
      let temp='';
      var d=da.data;
        d.forEach(element=>{
            temp+="<tr>";
            temp+="<td>"+element.name+"</td>";
            temp+="<td>"+element.population+"</td>";
            temp+="<td>"+element.latest_data.confirmed+"</td>";
            temp+="<td>"+element.latest_data.recovered+"</td>";
            temp+="<td>"+element.latest_data.deaths+"</td>";
            temp+="<td>"+element.latest_data.critical+"</td>";
            temp+="<td>"+element.latest_data.calculated.death_rate+"</td>";
            temp+="<td>"+element.latest_data.calculated.recovery_rate+"</td></tr>";
          
                
        });
        document.getElementById("data").innerHTML=temp;
 }
);

    }

updateMap();

async function extra()
{
    const response=await fetch('https://corona-api.com/countries');
    const json=await response.json();
    console.log(json);
    var geojson = {
        type: "FeatureCollection",
        features: [],
      };
      
      for (var i = 0; i < json.data.length; i++) {
        
        geojson.features.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [json.data[i].coordinates.longitude, json.data[i].coordinates.latitude]
          },
          "properties": {
              "name":json.data[i].name,
              "code":json.data[i].code,
              "population":json.data[i].population,
              "updated_at":json.data[i].updated_at,
             "deaths":json.data[i].today.deaths,
                "confirmed":json.data[i].today.confirmed,
                "latest_death":json.data[i].latest_data.deaths,
                "latest_confirmed":json.data[i].latest_data.confirmed,
                "latest_recovered":json.data[i].latest_data.recovered,
                "critical":json.data[i].latest_data.critical,
                "death_rate":json.data[i].latest_data.calculated.death_rate,
                "recovery_rate":json.data[i].latest_data.calculated.recovery_rate,
                "recovered_vs_death_ratio":json.data[i].latest_data.calculated.recovered_vs_death_ratio,
                "cases_per_million_population":json.data[i].latest_data.calculated.cases_per_million_population
          }
        });
      }
      
      
     
      console.log(geojson);
      mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcnUyNzEiLCJhIjoiY2tiZXMxbnA3MG92azJ5bDlkanIyMzVuZiJ9.gix_xkzsIloXF3fC0It1bw';
    var map = new mapboxgl.Map({
      container: 'map', // Specify the container ID
      style: 'mapbox://styles/mapbox/dark-v10', // Specify which map style to use
      center: [0, 0], // Specify the starting position [lng, lat]
      zoom: 1 // Specify the starting zoom
    });
    var country = document.getElementById('mag');
var confirmed = document.getElementById('loc');
var death = document.getElementById('date');

map.on('load', function() {

map.addSource('earthquakes', {
  'type': 'geojson',
  'data': geojson,
  'generateId': true // This ensures that all features have unique IDs
});
map.addLayer({
  'id': 'earthquakes-viz',
  'type': 'circle',
  'source': 'earthquakes',
  'paint': {
    'circle-stroke-color': 'red',
    'circle-stroke-width': 1,
    'circle-color': 'red'
  }
});
var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
    });
var quakeID = null;

map.on('mousemove', 'earthquakes-viz', (e) => {

  map.getCanvas().style.cursor = 'pointer';
  var coordinates = e.features[0].geometry.coordinates.slice();
  console.log(coordinates);
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
  // Set variables equal to the current feature's magnitude, location, and time
  var name_data = e.features[0].properties.name;
  var confirmed_data = e.features[0].properties.latest_confirmed;
    var death_data=e.features[0].properties.latest_death;
    popup
    .setLngLat(coordinates)
    .setHTML(name_data+"<br>"+"Confirmed : "+confirmed_data.toString()+"<br>"+"Deaths : "+death_data.toString())
    // .setHTML("ConFirmed : "+confirmed_data.toString())
    // .setHTML("Deaths : "+death_data.toString())
    .addTo(map);
  // Check whether features exist
  if (e.features.length > 0) {
    // Display the magnitude, location, and time in the sidebar
  //   country.textContent = name_data;
  //  confirmed.textContent = confirmed_data;
  //   death.textContent = death_data;

    // If quakeID for the hovered feature is not null,
    // use removeFeatureState to reset to the default behavior
    if (quakeID) {
      map.removeFeatureState({
        source: "earthquakes",
        code: quakeID
      });
    }

    quakeID = e.features[0].code;

    // When the mouse moves over the earthquakes-viz layer, update the
    // feature state for the feature under the mouse
    map.setFeatureState({
      source: 'earthquakes',
      code: quakeID,
    }, {
      hover: true
    });

  }
});
map.on("mouseleave", "earthquakes-viz", function() {
  if (quakeID) {
    map.setFeatureState({
      source: 'earthquakes',
      code: quakeID
    }, {
      hover: false
    });
  }
  
  // quakeID = null;
  // // Remove the information from the previously hovered feature from the sidebar
  // country.textContent = '';
  // confirmed.textContent = '';
  // death.textContent = '';
  // // Reset the cursor style
  // map.getCanvas().style.cursor = '';
});
map.on('mouseleave', "earthquakes-viz", function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
    });

});  


      
}
extra();

     
    



   

 


