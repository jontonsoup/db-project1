if (navigator.geolocation)  {
  navigator.geolocation.getCurrentPosition(Setpos);
}

function Setpos(pos)
{
 var lat=pos.coords.latitude;
 var long=pos.coords.longitude;
 if($('#lat').length != 0){
    $('#lat').val(lat);
  }
  if($('#long').length != 0){
    $('#long').val(long);
  }
}
