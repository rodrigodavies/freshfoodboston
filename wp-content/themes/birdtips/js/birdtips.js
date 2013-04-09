jQuery(function(){
	
	/* toggle small menu */
	jQuery("#small-menu").click( function() {
		jQuery(".menu").slideToggle();
		jQuery(this).toggleClass("active");
	});

});
