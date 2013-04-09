
    <footer class="footer row">
      <?php colabs_credit(); ?>
    </footer>
  </div><!-- .row -->
</div><!-- .main-container -->

<?php wp_footer(); ?> 

<?php  if ( is_page_template('map.php') ) : ?>

<script type="text/javascript"> 

function init(){
    var p = "<?php global $points; echo $points; ?>", mapCoords;
	
    p = p.split("),(");
	
    for(var x = 0; x < p.length; x++){
	p[x] = p[x].split(",");
	if(mapCoords == null){
		mapCoords = [new google.maps.LatLng(p[x][0], p[x][1])];
	}else {
		mapCoords.push(new google.maps.LatLng(p[x][0], p[x][1]));
	}
    }	

$(function(){ init(); });
	
    /* Create posts array */
    var posts = "<?php global $thePosts; echo $thePosts; ?>";
    posts = posts.split('),(');
	
    for(var x = 0; x < posts.length; x++){
	posts[x] = posts[x].split('|');
    }
	
    newMap('canvas', mapCoords, posts);
}

$(function(){ init(); });

function newMap(id, mapCoords, posts){
    var centre = (new google.maps.LatLng(51.44031275716014, 0.3955078125)),
	zoomLevel = 6,
        route,
        myOptions,
        map;

    route = new google.maps.Polyline({
        path: mapCoords,
        strokeColor: "#2324e4",
        strokeOpacity: .70,
        strokeWeight: 7,
        editable: false
    });
		    
    myOptions = {
        center: centre,
        zoom: zoomLevel,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById(id), myOptions);
    route.setMap(map);
    
    // New code starts here
	
    function getInfoWindowEvent(marker, x) {
	infowindow.close()
	infowindow.setContent('<div class="infowindow"><a href="'+posts[x][1]+'"><strong>'+posts[x][0]+'</strong><br>'+posts[x][2]+'</a></div>');
	infowindow.open(map, marker);
    }
    
    var markers = [];
    
    for(var x = 0; x < mapCoords.length; x++){
        markers[x] = new google.maps.Marker({    
	    position: mapCoords[x],    
	    map: map,
	    /* icon: 'http://example.com/images/pin.png' */ // Remove this to use the default pin
	});
	    
	google.maps.event.addListener(markers[x], 'click', (function(x) {
	    return function(){ 
		getInfoWindowEvent(markers[x], x);
	    }
	})(x));			
    }  
}

</script>

<?php endif; ?>

</body>
</html>