(function($){
$(document).ready(function(){

/* ===================================================================
  #Dropdown Menu
=================================================================== */
$('.topnav ul:first').addClass('sf-menu').superfish({
  dropShadows: false    
});

/* ===================================================================
  #Featured Slider
=================================================================== */
var $sliderContainer = $('.slider-container'),
    $sliderDir = $('.slider-dir-nav');

$sliderContainer.css('opacity', 0);
$sliderContainer.find('.slider-slide').each(function(i){
  $(this).attr('data-index', i+1);
});

if( $sliderContainer.length > 0 ) {
  $sliderContainer.imagesLoaded(function(){
    window.featuredOpts = {
      width: '100%',
      auto: 5000,
      circular: true,
      infinite: false,
      responsive: true,
      prev: $sliderDir.find('.prev'),
      next: $sliderDir.find('.next'),
      swipe: {
        onTouch: true
      }
      // pagination: {
      //   container: $('.slider-nav'),
      //   anchorBuilder: function(number, item) {
      //     var thumbUrl =  $('[data-index='+number+']').data('thumbnail');
      //         output = '';

      //     output += '<a href="#">';
      //     output += '</a>';

      //     return output;
      //   }
      // }
    };

    $(this).carouFredSel( featuredOpts );
    $sliderContainer.fadeTo(500, 1);
  });

  // $(window).bind('load resize', function(){
  //   if( $(window).width() <= 978 ) {
  //     featuredOpts.responsive = true;
  //     featuredOpts.scroll = {fx: 'fade'};
  //     $sliderContainer.carouFredSel( featuredOpts );
  //   }
  // });
} // End if $sliderContainer


/* ===================================================================
  #Single Gallery Slider
=================================================================== */
if( $('.single .entry-top .innercontainer img').length > 1 ) {
  $('.entry-top .slider').imagesLoaded(function(){
    $(this).carouFredSel({
      infinite: false,
      circular: false,
      auto: false,
      responsive: true,
      scroll: {
        fx: 'crossfade'
      },
      next: '.single-slider-nav .next',
      prev: '.single-slider-nav .prev'
    });
  });
}


/* ===================================================================
  #Post List - Masonry
=================================================================== */
var $postMasonry = $('.post-masonry');

$postMasonry.css('opacity', 0);
$postMasonry.imagesLoaded(function(){
  $(this).masonry({
    itemSelector: '.entry-post',
    columnWidth: 222,
    gutterWidth: 30,
    isFitWidth: true
  });
  $postMasonry.delay(200).fadeTo(500, 1);
});


/* Simple Tooltip for author meta
  	----------------------------------------------*/
  	$('.entry-author').hover(function(){
		$(this).find('.author-description')
			.stop(true, true)
			.animate({
			top: '25px',
			opacity: 'show'
		});
	}, function(){
		$(this).find('.author-description')
			.stop(true, true)
			.animate({
			top: '15px',
			opacity: 'hide'
		});
	});


/* ===================================================================
  #Mobile Menu Toggle
=================================================================== */
$('.collapse-toggle').click(function(e){
  e.preventDefault();
  var $el = $(this),
      $navCollapse = $('.nav-collapse');

  // If collapsed
  if( $el.hasClass('collapsed') ) {
    $navCollapse.height( $navCollapse.children().outerHeight(true) );
    $el.removeClass('collapsed');
  } else {
    $navCollapse.height(0);
    $el.addClass('collapsed');
  }

});


/* ===================================================================
  #Fancybox
=================================================================== */
function fancyInit( $fancy ) {
  // Initiate Fancybox
  $fancy.fancybox({
    transitionIn  : 'elastic',
    transitionOut : 'elastic',
    onComplete: function(el) {
      var description = $(el).next('.desc');

      // Check if description exists
      if( description.length > 0 ) {
        $('<div class="fancy-desc">'+description.html()+'</div>').appendTo('#fancybox-content');
      }      
    }
  });
}
fancyInit( $('a.grouped, a[rel^=lightbox-]') );


var ajaxMessage = 'Loading...',
    loadingBox = $('<div class="loading-box">').text('Loading...').appendTo('body');
$('.entry-likes').live('click', function(e){
  e.preventDefault();
  var 
    likeData  = $(this).data('like'),
    likeData  = likeData.split('_'),
    likeId    = likeData[1],
    liked     = ( $.cookie('like_' + likeId) == 'true' ) ? true : false,
    disable   = ( $(this).hasClass('disabled') || liked ) ? true : false;
    if( !disable ) {
      likethis( likeId, $(this) );
    } else {
      ajaxMessage = 'You have already liked this post';
      $('.loading-box').trigger('ajaxSend').trigger('ajaxComplete');
      return;
    }
});
  
/* ===================================================================
  #Like Button
=================================================================== */
function likethis(likeId, el) {
  $.ajax({
    url: config.ajaxurl,
    //cache: true,
    type: 'post',
    data: {
      action: 'like',
      id: likeId
    },
    beforeSend: function(){
      ajaxMessage = 'Loading...';
      loadingBox.text(ajaxMessage).delay(100).animate({ top: -1 });
    },
    success: function(response, event) {
      $.cookie('like_' + likeId,'true', {expires:1});
      ajaxMessage = 'Liked!';
      // if like button on 
      var likeNumber  = el.find('span'),
            before      = parseInt(likeNumber.text());
            likeNumber.text( before + 1 );
		  el.find('i').addClass('true');

      var boxHeight = loadingBox.outerHeight();
      loadingBox.text( ajaxMessage ).delay(1000).animate({ top: -boxHeight-5 });
    }
  });

} // end function like
  
/* --- Append loading box for ajax request loading ---*/
/*var loadingBox = $('<div class="loading-box">').text('Loading...').appendTo('body');
loadingBox.bind( 'ajaxSend', function(res, req){
  $(this).text(ajaxMessage).delay(100).animate({ top: -1 });
})
.bind( 'ajaxComplete', function(res, req){
  var boxHeight = $(this).outerHeight();
  $(this).text( ajaxMessage ).delay(1000).animate({ top: -boxHeight-5 });
});*/

/* ===================================================================
  #Infinite Scroll trigger
=================================================================== */
var pagedCounter = 2,
    postEnd = false;
$('.loader.photograph').click(function(e){
  e.preventDefault();
  if( !postEnd ) {
    loadPhotograph(pagedCounter,'photograph', $(this).val());
  }
});
$('.loader.all').click(function(e){
  e.preventDefault();
  if( !postEnd ) {
    loadPhotograph(pagedCounter,'all', $(this).val());
  }
});

function loadPhotograph(paged, page, value) {
  $.ajax({
    url: config.ajaxurl,
    //cache: true,
    type: 'post',
    data: {
      action: 'getphotograph',
      paged: paged,
	page : page,
	value : value
    },
    beforeSend: function(){
      ajaxMessage = 'Loading...';
      if( !postEnd ) {
		$('.loader').addClass('loading');
      }
    },
    success: function(response) {
      $('.loader').removeClass('loading');
      if( response === '' ) {
        ajaxMessage = 'No More';
        postEnd = true;
        $('<span>' + ajaxMessage + '</span>').insertAfter('.loader');
	  $('.loader').css('display','none');
      } else {
        $(response).insertAfter($('article:last'));
        pagedCounter+=1;
      }
	
	$(response).imagesLoaded(function(){
	  $('.post-masonry').masonry('reload');
	})
	
	/* --- Fancybox --- */
	// if( typeof $.fn.fancybox === 'function' ) {
	// 	$('a.grouped, a[rel^=lightbox-]').fancybox({
	// 	  'transitionIn'  : 'elastic',
	// 	  'transitionOut' : 'elastic'
	// 	});
	// }
    }
  });
}


/* ===================================================================
  #Infinite Scroll
=================================================================== */
$postMasonry.infinitescroll({
  itemSelector: '.entry-post',
  navSelector: '.nav-previous',
  nextSelector: '.nav-previous a',
  loading: {
    finishedMsg: 'No more post to load'
  }
}, function( newEl ){
  var $newEl = $(newEl).css('opacity', 0);

  $newEl.imagesLoaded(function(){
    $newEl.animate({opacity: 1});
    $postMasonry.masonry('appended', $newEl, true);
    fancyInit( $newEl.find('a[rel^=lightbox-]') );
  });
});


});
})(jQuery);