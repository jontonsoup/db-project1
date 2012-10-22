//
// Global state
//
// map     - the map object
// usermark- marks the user's position on the map
// markers - list of markers on the current map (not including the user position)
//
//

//
// First time run: request current location, with callback to Start
//

$("document").ready(function() {
  var committees = document.getElementById("committees");
  var individuals = document.getElementById("individuals");
  var candidates = document.getElementById("candidates");
  var opinions = document.getElementById("opinions");

  var Cycles = document.getElementById("cycles");
  Cycles.options[2].selected = true;

});

if (navigator.geolocation)  {
  navigator.geolocation.getCurrentPosition(Start);
}


function UpdateMapById(id, tag) {

  var target = document.getElementById(id);
  var data = target.innerHTML;

  var rows  = data.split("\n");

  for (i in rows) {
   var cols = rows[i].split("\t");
   var lat = cols[0];
   var long = cols[1];

   markers.push(new google.maps.Marker({ map:map,
    position: new google.maps.LatLng(lat,long),
    title: tag+"\n"+cols.join("\n")}));

 }
}

function ClearMarkers()
{
    // clear the markers
    while (markers.length>0) {
     markers.pop().setMap(null);
   }
 }


 function UpdateMap()
 {
  var color = document.getElementById("color");

  color.innerHTML="<b><blink>Updating Display...</blink></b>";
  color.style.backgroundColor='white';

  ClearMarkers();

  UpdateMapById("committee_data","COMMITTEE");
  UpdateMapById("candidate_data","CANDIDATE");
  UpdateMapById("individual_data", "INDIVIDUAL");
  UpdateMapById("opinion_data","OPINION");


  color.innerHTML="Ready";

  if (Math.random()>0.5) {
   color.style.backgroundColor='blue';
 } else {
   color.style.backgroundColor='red';
 }

}

function NewData(data)
{
  var target = document.getElementById("data");

  target.innerHTML = data;

  UpdateMap();

}

// when called, returns which cycles are selected in an array
function SelectedCycles() {
  var Cycles = document.getElementById('cycles');
  var x = 0;
  var arr = [];
  for (x=0;x<Cycles.options.length;x++) {
    if (Cycles.options[x].selected == true) {
      arr.push(Cycles.options[x].value);
    }
  }
  return arr;
}

function ViewShift()
{
  var bounds = map.getBounds();

  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();

  var color = document.getElementById("color");

  var selected_cycles = SelectedCycles();
  var selected_cycles_param = selected_cycles.toString();

  // if (selected_cycles.length == 0) {
  //   selected_cycles_param = "";
  // }
  // else {
  //   selected_cycles_param = String(selected_cycles);
  // }

  color.innerHTML="<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>";
  color.style.backgroundColor='white';
  if(committees.checked && individuals.checked && candidates.checked && opinions.checked || !committees.checked && !individuals.checked && !candidates.checked && !opinions.checked){
        // debug status flows through by cookie
        var query_string = "rwb.pl?act=near&latne="+ne.lat()+"&longne="+ne.lng()+"&latsw="+sw.lat()+"&longsw="+sw.lng();
        query_string = query_string +  "&cycle=" + selected_cycles_param;
        query_string = query_string + "&format=raw&what=all";
        
        $.get(query_string, NewData);

      }
      else{
        var what_sting = "";
        var what_array = [];
        if(committees.checked){
          what_array.push("committees");
        }
        if(individuals.checked){
          what_array.push("individuals");
        }
        if(candidates.checked){
          what_array.push("candidates");
        }
        if(opinions.checked){
          what_array.push("opinions");
        }
        what_sting = what_array.join(',');
        var query_string = "rwb.pl?act=near&latne="+ne.lat()+"&longne="+ne.lng()+"&latsw="+sw.lat()+"&longsw="+sw.lng();
        query_string += "&cycle=" + selected_cycles_param;
        query_string += "&format=raw&what=" + what_sting;
        //alert(query_string);
        $.get(query_string, NewData);
      }

    }
    function Setpos(pos)
    {
      var lat=pos.coords.latitude;
      var long=pos.coords.longitude;
      if($('#lat').length == 0){
        $('#lat').value = lat;
      }
      if($('#long').length == 0){
          $('#long').value = long;
      }
    }

    function Reposition(pos)
    {
      var lat=pos.coords.latitude;
      var long=pos.coords.longitude;

      map.setCenter(new google.maps.LatLng(lat,long));
      usermark.setPosition(new google.maps.LatLng(lat,long));


    }


    function Start(location)
    {
      var lat = location.coords.latitude;
      var long = location.coords.longitude;
      var acc = location.coords.accuracy;

      var mapc = $( "#map");

      map = new google.maps.Map(mapc[0],
       { zoom:16,
        center:new google.maps.LatLng(lat,long),
        mapTypeId: google.maps.MapTypeId.HYBRID
      } );

      usermark = new google.maps.Marker({ map:map,
       position: new google.maps.LatLng(lat,long),
       title: "You are here"});

      markers = new Array;

      var color = document.getElementById("color");
      color.style.backgroundColor='white';
      color.innerHTML="<b><blink>Waiting for first position</blink></b>";

      google.maps.event.addListener(map,"bounds_changed",ViewShift);
      google.maps.event.addListener(map,"center_changed",ViewShift);
      google.maps.event.addListener(map,"zoom_changed",ViewShift);

      navigator.geolocation.watchPosition(Reposition);
      navigator.geolocation.watchPosition(Setpos);

    }


