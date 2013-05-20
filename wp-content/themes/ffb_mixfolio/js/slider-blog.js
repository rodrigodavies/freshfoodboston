jQuery(document).ready(function($){ 
        var slideEffect = $('.slide-effect-blog').text(); 

        $('.blog-slider .flexslider').flexslider({
            controlNav: false,
	        directionNav: true,
	        animation: slideEffect,
	        start: function(){
	            $('.loader').hide();
	        }
        });
});