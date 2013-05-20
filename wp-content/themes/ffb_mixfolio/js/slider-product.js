jQuery(document).ready(function($){ 
        var slideEffect = $('.slide-effect-product').text(); 

        $('.product-slider .flexslider').flexslider({
            controlNav: false,
	        directionNav: true,
	        animation: slideEffect,
	        start: function(){
	            $('.loader').hide();
	        }
        });
});