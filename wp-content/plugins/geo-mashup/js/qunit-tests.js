jQuery(function(c){var b=parseInt(gm_test_data.location_count,10);function a(d,f){var e=c("<iframe/>").attr("name",gm_test_data.name).attr("width",gm_test_data.width).attr("height",gm_test_data.height).appendTo("#qunit-fixture").attr("src",d);return e.load(f)}c.each(gm_test_data.test_apis,function(d,e){asyncTest(e+" global loads",9,function(){a(gm_test_data.global_urls[e],function(){var f=window.frames[gm_test_data.name].GeoMashup;ok(f,"GeoMashup object is available");ok(f.map,"map object is available");ok(f.map.markers,"markers are available");equal(f.map.markers.length,b,"a marker is created for each location");ok(f.map.polylines,"polylines are available");equal(f.map.polylines.length,1,"a polyline is created for each term with line zoom set");equal(f.map.getZoom(),10,"initial zoom is as specified (10)");QUnit.close(f.map.getCenter().lat,f.map.markers[0].location.lat,0.005,"map center latitude is near the first marker");QUnit.close(f.map.getCenter().lon,f.map.markers[0].location.lon,0.005,"map center longitude is near the first marker");start()})});asyncTest(e+" markers respond",b*3,function(){a(gm_test_data.global_urls[e],function(){var f=window.frames[gm_test_data.name].GeoMashup;c.each(f.map.markers,function(h,g){g.click.fire();equal(f.selected_marker,g,"a marker is selected when clicked");QUnit.close(g.location.lat,f.map.getCenter().lat,0.005,"map center latitude is close to selected marker");QUnit.close(g.location.lon,f.map.getCenter().lon,0.005,"map center longitude is close to selected marker")});start()})})})});