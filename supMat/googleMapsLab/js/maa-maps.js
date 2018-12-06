//  Initialize jQuery detail accordions in the HTML

$( function() {
  var  accordion_list;			// List of detail accordion IDs
  var  i;				// Current accordion_list index

  accordion_list = [
/*
    "#var-accordion", "#dict-accordion", "#loop-accordion",
    "#for-accordion", "#bug-accordion", "#seek-accordion",
    "#newline-accordion", "#max-pop-accordion", "#fib-accordion",
    "#pandas-pop-accordion", "#pandas-slice-accordion"
*/
  ];

  for ( i in accordion_list ) {
    $( accordion_list[ i ] ).accordion( {
      active: false,
      collapsible: true,
      autoHeight: false,
      heightStyle: "content"
    } );
  }

  //  This code tracks the navigation bar, if it scrolls past the top
  //  of the page, it's "floated" and pinned to the top of the page

  var  is_fixed;			// Nav bar is pinned flag
  var  nav;				// Ref to nav bar's div
  var  nav_foot;			// Ref to nav bar's bottom spacer
  var  nav_y;				// Top of nav bar y-offset on page
  var  w;				// Reference to main window


  nav = $("#nav");			// Grab nav bar div, footer div
  nav_foot = $("#nav-footer");

  nav_y = nav.offset().top;		// Get nav bar's top offset on page

  is_fixed = false;

  w = $(window);
  w.scroll( function() {
    var  fixed;				// Nav bar should be fixed flag
    var  nav_h;				// Nav bar height
    var  top;				// Vert scrollbar's top offset on page

    top = w.scrollTop();		// Get vert sbar pos from top of page
    fixed = top > nav_y;		// Scrolled past nav bar's top on page?
    nav_h = $("#nav").height();		// Get nav bar's height

    if ( fixed && !is_fixed ) {		// Fix navbar in place?
      nav.css( {
        position: "fixed",
        top: 0,
        left: nav.offset().left,
        width: "98.5%"
      } );
      nav_foot.css( {
        position: "fixed",
        top: nav_h,
        left: nav.offset().left,
        width: "98.5%"
      } );

      is_fixed = true;

    } else if ( !fixed && is_fixed ) {	// Release fixed navbar?
      nav.css( {
        position: "static",
        width: "100%"
      } );
      nav_foot.css( {
        position: "static",
        width: "100%"
      } );

      is_fixed = false;
    }
  } );

  $("#nav-list li").click( function() {
    var  div_id	= [			// ID of div to scroll to
      { "id": "map-intro", "div": "#intro" },
      { "id": "map-setup", "div": "#setup" },
      { "id": "map-basic", "div": "#basic" },
      { "id": "map-annotate", "div": "#annotate" },
      { "id": "map-data", "div": "#data" }
    ];
    var  i;				// Loop counter


    //  Find div ID for whatever nav item user clicked

    for( i = 0; i < div_id.length; i++ ) {
      if ( $(this).attr( "id" ) == div_id[ i ][ "id" ] ) {
        break;
      }
    }

    if ( i >= div_id.length ) {		// Unknown nav item?
      console.log( "Unknown navigation ID " + $(this).attr( "id" ) );
    } else {

    //  Animate the top of the div to the top of the page, but offset
    //  by 25px to account for the navigation toolbar itself

      $("html, body").animate(
        { scrollTop: $(div_id[ i ][ "div" ]).position().top - 25 }, 'swing' );
    }
  } );

  google.load( "visualization", "1", { "callback": init_map_ex } );
} );


function init_basic_map()

  //  Initialize first Google map w/o any other data
{
  var  map;				// Map
  var  opt = {				// Map options
         center: new google.maps.LatLng( 35.82, -78.64 ),
         zoom:   8
       };


  map = new google.maps.Map( document.getElementById( "basic-map" ), opt );
}					// End function init_basic_map


function init_marker_map()

  //  Initialize Google map with basic markers
{
  var  map;				// Map
  var  marker = [ ];			// Marker
  var  opt = {				// Map options
         center: new google.maps.LatLng( 35.82, -78.64 ),
         zoom:   8
       };


  map = new google.maps.Map( document.getElementById( "marker-map" ), opt );

  marker.push( new google.maps.Marker( {
    position:  new google.maps.LatLng( 35.78, -78.80 ),
    map:       map,
    draggable: true,
    title:     "Cary, NC 27512, USA"
  } ) );

  google.maps.event.addListener( marker[ 0 ], 'dragend', function() {
    var  geocoder;
    var  pos;

    pos = this.getPosition();

    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'latLng': pos }, function( results, status ) {
      if ( status == google.maps.GeocoderStatus.OK && results[ 1 ] ) {
        marker[ 0 ].setTitle( results[ 1 ].formatted_address );
      } else {
        marker[ 0 ].setTitle( "Unknown location" );
      }
    } );
  } );
}					// End function init_marker_map


function init_map_ex()

  //  Initialize all map examples
{
  var  q;				// Google spreadsheet query object


  init_basic_map();
  init_marker_map();
  init_svg_map();
  //init_route_map();

  //q = new google.visualization.Query( "https://docs.google.com/a/ncsu.edu/spreadsheet/ccc?key=0AjLqx9vOBShEdE5PbmM3Z1Z1a01RVDljWkVrQV84OEE&usp=sharing#gid=1" );
  //q = new google.visualization.Query( "https://docs.google.com/a/ncsu.edu/spreadsheet/ccc?key=0AjLqx9vOBShEdE5PbmM3Z1Z1a01RVDljWkVrQV84OEE" );
    q = new google.visualization.Query( "https://docs.google.com/a/ncsu.edu/spreadsheets/d/1W94oDu66sBb96RqsKhd8pHhShW8TFGFiceSCSqtFJTE/edit?usp=sharing" );
  q.setQuery( 'SELECT B,D,H,I WHERE D > 499999 ORDER BY B' );
  q.send( init_pop_map );
}					// End function init_map_ex


function init_pop_map( resp )

  //  Initialize population map
  //
  //  resp:  Response data from Google population spreadsheet
{
  var  city;				// City name
  var  i;				// Loop counter
  var  lat;				// Latitude
  var  lon;				// Longitude
  var  map;				// Map
  var  marker = [ ];			// SVG circle markers
  var  n;				// Number of data rows
  var  opt = {				// Map options
         center: new google.maps.LatLng( 38.267, -97.806 ),
         mapTypeId: google.maps.MapTypeId.TERRAIN,
         zoom: 4
       };
  var  pop;				// City population
  var  pop_rng;				// City population range
  var  siz;				// Marker size
  var  tbl;				// Data table returned


  map = new google.maps.Map( document.getElementById( "pop-map" ), opt );

  if ( resp.isError() ) {
    console.log( "resp(), Google query failed" );
    return;
  }

  tbl = resp.getDataTable();		// Get data table
  n = tbl.getNumberOfRows();		// Get rows (cities) in table
  pop_rng = tbl.getColumnRange( 1 );	// Population range

  for( i = 0; i < n; i++ ) {		// For all cities
    lat = tbl.getValue( i, 2 );		// Get lat, lon, population, city name
    lon = tbl.getValue( i, 3 );
    pop = tbl.getValue( i, 1 );
    city = tbl.getValue( i, 0 ).replace( / city/g, "" );

    siz = 5 + ( ( pop - pop_rng.min ) / ( pop_rng.max - pop_rng.min ) * 10.0 );

    marker.push( new google.maps.Marker( {
      position:  new google.maps.LatLng( lat, lon ),
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: ( pop >= 1000000 ? "red" : "blue" ),
        fillOpacity: 0.7,
        scale: siz,
        strokeColor: "grey",
        strokeWeight: 1
      },
      title: ( city + ": " + pop.toLocaleString() )
    } ) );
  }
}					// End function init_pop_map


function init_route_map()

  //  Initialize route map
{
  var  dir_disp = [ ];			// Display renderer objects
  var  dir_req = [ ];			// Route request structs
  var  dir_serv;			// Route calculation server
  var  i;				// Loop counter
  var  lat;				// Latitude
  var  lon;				// Longitude
  var  lat_lng;				// Cary latitude/longitude
  var  map;				// Map
  var  opt = {				// Map options
         center: new google.maps.LatLng( 38.267, -97.806 ),
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         zoom: 4
       };


  map = new google.maps.Map( document.getElementById( "route-map" ), opt );

  map.set( "styles", [
    {
      featureType: "landscape",		// Simplified, white landscape
      elementType: "geometry",
      stylers: [ {
        color: "#ffffff",
        visibility: "simplified"
      } ]
    },

  //  Turn off all administrative features, then selectively turn some
  //  text and boundaries back on

    {
      featureType: "administrative",
      elementType: "all",
      stylers: [ {
        visibility: "off",
      } ]
    },
    {
      featureType:			// Restore country names
        "administrative.country",
      elementType: "text",
      stylers: [
        { lightness: 70 },
        { visibility: "on" }
      ]
    },
    {
      featureType:			// Restore state/province names
        "administrative.province",
      elementType: "text",
      stylers: [
        { lightness: 60 },
        { visibility: "on" }
      ]
    },
    {
      featureType:			// Replace "large" city names
        "administrative.locality",
      elementType: "text",
      stylers: [
        { lightness: 60 },
        { visibility: "on" }
      ]
    },
    {
      featureType: "water",		// Pale blue water
      elementType: "geometry",
      stylers: [ {
        lightness: 50,
        saturation: -50
      } ]
    },

    //  Turn off features

    {
      featureType: "poi",		// Turn off points of interest
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },
    {
      featureType: "road",		// Thins and de-saturates roads
      elementType: "geometry.stroke",
      stylers: [
        { lightness: 100 }
      ]
    },
    {
      featureType: "transit",		// Turn off transit
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    }
  ] );

  for( i = 0; i < 2; i++ ) {		// Create route renderers
    dir_disp.push(
      new google.maps.DirectionsRenderer( { suppressMarkers: true } ) );
    dir_disp[ dir_disp.length - 1 ].setMap( map );
  }

  //  Define Cary's latitude/longitude as a LatLng object

  lat_lng = new google.maps.LatLng( 35.78, -78.80 );

  dir_req.push( {
    origin: lat_lng,
    destination: "Greensboro, NC",
    travelMode: google.maps.TravelMode.DRIVING
  } );

  dir_req.push( {
    origin: lat_lng,
    destination: "Fayetteville, NC",
    travelMode: google.maps.TravelMode.DRIVING
  } );

  dir_serv = new google.maps.DirectionsService();

  dir_serv.route( dir_req[ 0 ], function( result, status ) {
    if ( status == google.maps.DirectionsStatus.OK ) {
      dir_disp[ 0 ].setDirections( result );
    }
  } );

  dir_serv.route( dir_req[ 1 ], function( result, status ) {
    if ( status == google.maps.DirectionsStatus.OK ) {
      dir_disp[ 1 ].setDirections( result );
    }
  } );
}					// End function init_route_map


function init_svg_map()

  //  Initialize Google map with basic svgs
{
  var  map;				// Map
  var  marker = [ ];			// Markers
  var  opt = {				// Map options
         center: new google.maps.LatLng( 35.82, -78.64 ),
         zoom:   8
       };


  map = new google.maps.Map( document.getElementById( "svg-map" ), opt );

  marker.push( new google.maps.Marker( {
    position:  new google.maps.LatLng( 35.78, -78.80 ),
    map:       map,
    draggable: true,
    title:     "Cary, NC 27512, USA"
  } ) );

  marker.push( new google.maps.Marker( {
    position:  new google.maps.LatLng( 35.95, -77.81 ),
    map:       map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#0000ff",
      fillOpacity: 0.7,
      scale: 10,
      strokeColor: "grey",
      strokeWeight: 1
    },
    title:     "SVG circle"
  } ) );

  marker.push( new google.maps.Marker( {
    position:  new google.maps.LatLng( 35.38, -77.98 ),
    map:       map,
    icon: {
      path: "M 0,-115 30,-30 120,-30 50,25 75,110 0,60 -75,110 -50,25 -120,-30 -30,-30 z",
      fillColor: "yellow",
      fillOpacity: 0.7,
      scale: 0.125,
      strokeColor: "grey",
      strokeWeight: 1
    },
    title:     "SVG star"
  } ) );
}					// End function init_svg_map
