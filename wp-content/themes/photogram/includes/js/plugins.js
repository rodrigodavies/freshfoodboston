/*!
 * jQuery imagesLoaded plugin v2.1.1
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */

/*jshint curly: true, eqeqeq: true, noempty: true, strict: true, undef: true, browser: true */
/*global jQuery: false */

;(function($, undefined) {
'use strict';

// blank image data-uri bypasses webkit log warning (thx doug jones)
var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

$.fn.imagesLoaded = function( callback ) {
  var $this = this,
    deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
    hasNotify = $.isFunction(deferred.notify),
    $images = $this.find('img').add( $this.filter('img') ),
    loaded = [],
    proper = [],
    broken = [];

  // Register deferred callbacks
  if ($.isPlainObject(callback)) {
    $.each(callback, function (key, value) {
      if (key === 'callback') {
        callback = value;
      } else if (deferred) {
        deferred[key](value);
      }
    });
  }

  function doneLoading() {
    var $proper = $(proper),
      $broken = $(broken);

    if ( deferred ) {
      if ( broken.length ) {
        deferred.reject( $images, $proper, $broken );
      } else {
        deferred.resolve( $images );
      }
    }

    if ( $.isFunction( callback ) ) {
      callback.call( $this, $images, $proper, $broken );
    }
  }

  function imgLoadedHandler( event ) {
    imgLoaded( event.target, event.type === 'error' );
  }

  function imgLoaded( img, isBroken ) {
    // don't proceed if BLANK image, or image is already loaded
    if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
      return;
    }

    // store element in loaded images array
    loaded.push( img );

    // keep track of broken and properly loaded images
    if ( isBroken ) {
      broken.push( img );
    } else {
      proper.push( img );
    }

    // cache image and its state for future calls
    $.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );

    // trigger deferred progress method if present
    if ( hasNotify ) {
      deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
    }

    // call doneLoading and clean listeners if all images are loaded
    if ( $images.length === loaded.length ) {
      setTimeout( doneLoading );
      $images.unbind( '.imagesLoaded', imgLoadedHandler );
    }
  }

  // if no images, trigger immediately
  if ( !$images.length ) {
    doneLoading();
  } else {
    $images.bind( 'load.imagesLoaded error.imagesLoaded', imgLoadedHandler )
    .each( function( i, el ) {
      var src = el.src;

      // find out if this image has been already checked for status
      // if it was, and src has not changed, call imgLoaded on it
      var cached = $.data( el, 'imagesLoaded' );
      if ( cached && cached.src === src ) {
        imgLoaded( el, cached.isBroken );
        return;
      }

      // if complete is true and browser supports natural sizes, try
      // to check for image status manually
      if ( el.complete && el.naturalWidth !== undefined ) {
        imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
        return;
      }

      // cached images don't fire load sometimes, so we reset src, but only when
      // dealing with IE, or image is complete (loaded) and failed manual check
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      if ( el.readyState || el.complete ) {
        el.src = BLANK;
        el.src = src;
      }
    });
  }

  return deferred ? deferred.promise( $this ) : $this;
};

})(jQuery);



/**
 * jQuery Masonry v2.1.06
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */

/*jshint browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function( window, $, undefined ){

  'use strict';

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        $.event.handle.apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };

// ========================= Masonry ===============================


  // our "Widget" object constructor
  $.Mason = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };

  $.Mason.settings = {
    isResizable: true,
    isAnimated: false,
    animationOptions: {
      queue: false,
      duration: 500
    },
    gutterWidth: 0,
    isRTL: false,
    isFitWidth: false,
    containerStyle: {
      position: 'relative'
    }
  };

  $.Mason.prototype = {

    _filterFindBricks: function( $elems ) {
      var selector = this.options.itemSelector;
      // if there is a selector
      // filter/find appropriate item elements
      return !selector ? $elems : $elems.filter( selector ).add( $elems.find( selector ) );
    },

    _getBricks: function( $elems ) {
      var $bricks = this._filterFindBricks( $elems )
        .css({ position: 'absolute' })
        .addClass('masonry-brick');
      return $bricks;
    },
    
    // sets up widget
    _create : function( options ) {
      
      this.options = $.extend( true, {}, $.Mason.settings, options );
      this.styleQueue = [];

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {
        // get height
        height: elemStyle.height || ''
      };
      // get other styles that will be overwritten
      var containerStyle = this.options.containerStyle;
      for ( var prop in containerStyle ) {
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }

      this.element.css( containerStyle );

      this.horizontalDirection = this.options.isRTL ? 'right' : 'left';

      var x = this.element.css( 'padding-' + this.horizontalDirection );
      var y = this.element.css( 'padding-top' );
      this.offset = {
        x: x ? parseInt( x, 10 ) : 0,
        y: y ? parseInt( y, 10 ) : 0
      };
      
      this.isFluid = this.options.columnWidth && typeof this.options.columnWidth === 'function';

      // add masonry class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass('masonry');
      }, 0 );
      
      // bind resize method
      if ( this.options.isResizable ) {
        $(window).bind( 'smartresize.masonry', function() { 
          instance.resize();
        });
      }


      // need to get bricks
      this.reloadItems();

    },
  
    // _init fires when instance is first created
    // and when instance is triggered again -> $el.masonry();
    _init : function( callback ) {
      this._getColumns();
      this._reLayout( callback );
    },

    option: function( key, value ){
      // set options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( key ) ){
        this.options = $.extend(true, this.options, key);
      } 
    },
    
    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $bricks, callback ) {

      // place each brick
      for (var i=0, len = $bricks.length; i < len; i++) {
        this._placeBrick( $bricks[i] );
      }
      
      // set the size of the container
      var containerSize = {};
      containerSize.height = Math.max.apply( Math, this.colYs );
      if ( this.options.isFitWidth ) {
        var unusedCols = 0;
        i = this.cols;
        // count unused columns
        while ( --i ) {
          if ( this.colYs[i] !== 0 ) {
            break;
          }
          unusedCols++;
        }
        // fit container to columns that have been used;
        containerSize.width = (this.cols - unusedCols) * this.columnWidth - this.options.gutterWidth;
      }
      this.styleQueue.push({ $el: this.element, style: containerSize });

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.options.isAnimated ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions;

      // process styleQueue
      var obj;
      for (i=0, len = this.styleQueue.length; i < len; i++) {
        obj = this.styleQueue[i];
        obj.$el[ styleFn ]( obj.style, animOpts );
      }

      // clear out queue for next time
      this.styleQueue = [];

      // provide $elems as context for the callback
      if ( callback ) {
        callback.call( $bricks );
      }
      
      this.isLaidOut = true;
    },
    
    // calculates number of columns
    // i.e. this.columnWidth = 200
    _getColumns : function() {
      var container = this.options.isFitWidth ? this.element.parent() : this.element,
          containerWidth = container.width();

                         // use fluid columnWidth function if there
      this.columnWidth = this.isFluid ? this.options.columnWidth( containerWidth ) :
                    // if not, how about the explicitly set option?
                    this.options.columnWidth ||
                    // or use the size of the first item
                    this.$bricks.outerWidth(true) ||
                    // if there's no items, use size of container
                    containerWidth;

      this.columnWidth += this.options.gutterWidth;

      this.cols = Math.floor( ( containerWidth + this.options.gutterWidth ) / this.columnWidth );
      this.cols = Math.max( this.cols, 1 );

    },

    // layout logic
    _placeBrick: function( brick ) {
      var $brick = $(brick),
          colSpan, groupCount, groupY, groupColY, j;

      //how many columns does this brick span
      colSpan = Math.ceil( $brick.outerWidth(true) / this.columnWidth );
      colSpan = Math.min( colSpan, this.cols );

      if ( colSpan === 1 ) {
        // if brick spans only one column, just like singleMode
        groupY = this.colYs;
      } else {
        // brick spans more than one column
        // how many different places could this brick fit horizontally
        groupCount = this.cols + 1 - colSpan;
        groupY = [];

        // for each group potential horizontal position
        for ( j=0; j < groupCount; j++ ) {
          // make an array of colY values for that one group
          groupColY = this.colYs.slice( j, j+colSpan );
          // and get the max value of the array
          groupY[j] = Math.max.apply( Math, groupColY );
        }

      }

      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, groupY ),
          shortCol = 0;
      
      // Find index of short column, the first from the left
      for (var i=0, len = groupY.length; i < len; i++) {
        if ( groupY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var position = {
        top: minimumY + this.offset.y
      };
      // position.left or position.right
      position[ this.horizontalDirection ] = this.columnWidth * shortCol + this.offset.x;
      this.styleQueue.push({ $el: $brick, style: position });

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.colYs[ shortCol + i ] = setHeight;
      }

    },
    
    
    resize: function() {
      var prevColCount = this.cols;
      // get updated colCount
      this._getColumns();
      if ( this.isFluid || this.cols !== prevColCount ) {
        // if column count has changed, trigger new layout
        this._reLayout();
      }
    },
    
    
    _reLayout : function( callback ) {
      // reset columns
      var i = this.cols;
      this.colYs = [];
      while (i--) {
        this.colYs.push( 0 );
      }
      // apply layout logic to all bricks
      this.layout( this.$bricks, callback );
    },
    
    // ====================== Convenience methods ======================
    
    // goes through all children again and gets bricks in proper order
    reloadItems : function() {
      this.$bricks = this._getBricks( this.element.children() );
    },
    
    
    reload : function( callback ) {
      this.reloadItems();
      this._init( callback );
    },
    

    // convienence method for working with Infinite Scroll
    appended : function( $content, isAnimatedFromBottom, callback ) {
      if ( isAnimatedFromBottom ) {
        // set new stuff to the bottom
        this._filterFindBricks( $content ).css({ top: this.element.height() });
        var instance = this;
        setTimeout( function(){
          instance._appended( $content, callback );
        }, 1 );
      } else {
        this._appended( $content, callback );
      }
    },
    
    _appended : function( $content, callback ) {
      var $newBricks = this._getBricks( $content );
      // add new bricks to brick pool
      this.$bricks = this.$bricks.add( $newBricks );
      this.layout( $newBricks, callback );
    },
    
    // removes elements from Masonry widget
    remove : function( $content ) {
      this.$bricks = this.$bricks.not( $content );
      $content.remove();
    },
    
    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      this.$bricks
        .removeClass('masonry-brick')
        .each(function(){
          this.style.position = '';
          this.style.top = '';
          this.style.left = '';
        });
      
      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var prop in this.originalStyle ) {
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }

      this.element
        .unbind('.masonry')
        .removeClass('masonry')
        .removeData('masonry');
      
      $(window).unbind('.masonry');

    }
    
  };
  
  
  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.1.0
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded( event ) {
      var img = event.target;
      if ( img.src !== blank && $.inArray( img, loaded ) === -1 ){
        loaded.push( img );
        if ( --len <= 0 ){
          setTimeout( triggerCallback );
          $images.unbind( '.imagesLoaded', imgLoaded );
        }
      }
    }

    // if no images, trigger immediately
    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load.imagesLoaded error.imagesLoaded',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      var src = this.src;
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      // data uri bypasses webkit log warning (thx doug jones)
      this.src = blank;
      this.src = src;
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( window.console ) {
      window.console.error( message );
    }
  };
  
  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Mason constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel 
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.masonry = function( options ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'masonry' );
        if ( !instance ) {
          logError( "cannot call methods on masonry prior to initialization; " +
            "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for masonry instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'masonry' );
        if ( instance ) {
          // apply options & init
          instance.option( options || {} );
          instance._init();
        } else {
          // initialize new instance
          $.data( this, 'masonry', new $.Mason( options, this ) );
        }
      });
    }
    return this;
  };

})( window, jQuery );




/*
 *  jQuery carouFredSel 6.1.0
 *  Demo's and documentation:
 *  caroufredsel.frebsite.nl
 *
 *  Copyright (c) 2012 Fred Heusschen
 *  www.frebsite.nl
 *
 *  Dual licensed under the MIT and GPL licenses.
 *  http://en.wikipedia.org/wiki/MIT_License
 *  http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


(function($) {


  //  LOCAL

  if ( $.fn.carouFredSel )
  {
    return;
  }

  $.fn.caroufredsel = $.fn.carouFredSel = function(options, configs)
  {

    //  no element
    if (this.length == 0)
    {
      debug( true, 'No element found for "' + this.selector + '".' );
      return this;
    }

    //  multiple elements
    if (this.length > 1)
    {
      return this.each(function() {
        $(this).carouFredSel(options, configs);
      });
    }


    var $cfs = this,
      $tt0 = this[0],
      starting_position = false;

    if ($cfs.data('_cfs_isCarousel'))
    {
      starting_position = $cfs.triggerHandler('_cfs_triggerEvent', 'currentPosition');
      $cfs.trigger('_cfs_triggerEvent', ['destroy', true]);
    }


    $cfs._cfs_init = function(o, setOrig, start)
    {
      o = go_getObject($tt0, o);

      o.items = go_getItemsObject($tt0, o.items);
      o.scroll = go_getScrollObject($tt0, o.scroll);
      o.auto = go_getAutoObject($tt0, o.auto);
      o.prev = go_getPrevNextObject($tt0, o.prev);
      o.next = go_getPrevNextObject($tt0, o.next);
      o.pagination = go_getPaginationObject($tt0, o.pagination);
      o.swipe = go_getSwipeObject($tt0, o.swipe);
      o.mousewheel = go_getMousewheelObject($tt0, o.mousewheel);

      if (setOrig)
      {
        opts_orig = $.extend(true, {}, $.fn.carouFredSel.defaults, o);
      }

      opts = $.extend(true, {}, $.fn.carouFredSel.defaults, o);
      opts.d = cf_getDimensions(opts);

      crsl.direction = (opts.direction == 'up' || opts.direction == 'left') ? 'next' : 'prev';

      var a_itm = $cfs.children(),
        avail_primary = ms_getParentSize($wrp, opts, 'width');

      if (is_true(opts.cookie))
      {
        opts.cookie = 'caroufredsel_cookie_' + conf.serialNumber;
      }

      opts.maxDimension = ms_getMaxDimension(opts, avail_primary);

      //  complement items and sizes
      opts.items = in_complementItems(opts.items, opts, a_itm, start);
      opts[opts.d['width']] = in_complementPrimarySize(opts[opts.d['width']], opts, a_itm);
      opts[opts.d['height']] = in_complementSecondarySize(opts[opts.d['height']], opts, a_itm);

      //  primary size not set for a responsive carousel
      if (opts.responsive)
      {
        if (!is_percentage(opts[opts.d['width']]))
        {
          opts[opts.d['width']] = '100%';
        }
      }

      //  primary size is percentage
      if (is_percentage(opts[opts.d['width']]))
      {
        crsl.upDateOnWindowResize = true;
        crsl.primarySizePercentage = opts[opts.d['width']];
        opts[opts.d['width']] = ms_getPercentage(avail_primary, crsl.primarySizePercentage);
        if (!opts.items.visible)
        {
          opts.items.visibleConf.variable = true;
        }
      }

      if (opts.responsive)
      {
        opts.usePadding = false;
        opts.padding = [0, 0, 0, 0];
        opts.align = false;
        opts.items.visibleConf.variable = false;
      }
      else
      {
        //  visible-items not set
        if (!opts.items.visible)
        {
          opts = in_complementVisibleItems(opts, avail_primary);
        }

        //  primary size not set -> calculate it or set to "variable"
        if (!opts[opts.d['width']])
        {
          if (!opts.items.visibleConf.variable && is_number(opts.items[opts.d['width']]) && opts.items.filter == '*')
          {
            opts[opts.d['width']] = opts.items.visible * opts.items[opts.d['width']];
            opts.align = false;
          }
          else
          {
            opts[opts.d['width']] = 'variable';
          }
        }
        //  align not set -> set to center if primary size is number
        if (is_undefined(opts.align))
        {
          opts.align = (is_number(opts[opts.d['width']]))
            ? 'center'
            : false;
        }
        //  set variabe visible-items
        if (opts.items.visibleConf.variable)
        {
          opts.items.visible = gn_getVisibleItemsNext(a_itm, opts, 0);
        }
      }

      //  set visible items by filter
      if (opts.items.filter != '*' && !opts.items.visibleConf.variable)
      {
        opts.items.visibleConf.org = opts.items.visible;
        opts.items.visible = gn_getVisibleItemsNextFilter(a_itm, opts, 0);
      }

      opts.items.visible = cf_getItemsAdjust(opts.items.visible, opts, opts.items.visibleConf.adjust, $tt0);
      opts.items.visibleConf.old = opts.items.visible;

      if (opts.responsive)
      {
        if (!opts.items.visibleConf.min)
        {
          opts.items.visibleConf.min = opts.items.visible;
        }
        if (!opts.items.visibleConf.max)
        {
          opts.items.visibleConf.max = opts.items.visible;
        }
        opts = in_getResponsiveValues(opts, a_itm, avail_primary);
      }
      else
      {
        opts.padding = cf_getPadding(opts.padding);

        if (opts.align == 'top')
        {
          opts.align = 'left';
        }
        else if (opts.align == 'bottom')
        {
          opts.align = 'right';
        }

        switch (opts.align)
        {
          //  align: center, left or right
          case 'center':
          case 'left':
          case 'right':
            if (opts[opts.d['width']] != 'variable')
            {
              opts = in_getAlignPadding(opts, a_itm);
              opts.usePadding = true;
            }
            break;

          //  padding
          default:
            opts.align = false;
            opts.usePadding = (
              opts.padding[0] == 0 && 
              opts.padding[1] == 0 && 
              opts.padding[2] == 0 && 
              opts.padding[3] == 0
            ) ? false : true;
            break;
        }
      }

      if (!is_number(opts.scroll.duration))
      {
        opts.scroll.duration = 500;
      }
      if (is_undefined(opts.scroll.items))
      {
        opts.scroll.items = (opts.responsive || opts.items.visibleConf.variable || opts.items.filter != '*') 
          ? 'visible'
          : opts.items.visible;
      }

      opts.auto = $.extend(true, {}, opts.scroll, opts.auto);
      opts.prev = $.extend(true, {}, opts.scroll, opts.prev);
      opts.next = $.extend(true, {}, opts.scroll, opts.next);
      opts.pagination = $.extend(true, {}, opts.scroll, opts.pagination);
      //  swipe and mousewheel extend later on, per direction

      opts.auto = go_complementAutoObject($tt0, opts.auto);
      opts.prev = go_complementPrevNextObject($tt0, opts.prev);
      opts.next = go_complementPrevNextObject($tt0, opts.next);
      opts.pagination = go_complementPaginationObject($tt0, opts.pagination);
      opts.swipe = go_complementSwipeObject($tt0, opts.swipe);
      opts.mousewheel = go_complementMousewheelObject($tt0, opts.mousewheel);

      if (opts.synchronise)
      {
        opts.synchronise = cf_getSynchArr(opts.synchronise);
      }


      //  DEPRECATED
      if (opts.auto.onPauseStart)
      {
        opts.auto.onTimeoutStart = opts.auto.onPauseStart;
        deprecated('auto.onPauseStart', 'auto.onTimeoutStart');
      }
      if (opts.auto.onPausePause)
      {
        opts.auto.onTimeoutPause = opts.auto.onPausePause;
        deprecated('auto.onPausePause', 'auto.onTimeoutPause');
      }
      if (opts.auto.onPauseEnd)
      {
        opts.auto.onTimeoutEnd = opts.auto.onPauseEnd;
        deprecated('auto.onPauseEnd', 'auto.onTimeoutEnd');
      }
      if (opts.auto.pauseDuration)
      {
        opts.auto.timeoutDuration = opts.auto.pauseDuration;
        deprecated('auto.pauseDuration', 'auto.timeoutDuration');
      }
      //  /DEPRECATED


    };  //  /init


    $cfs._cfs_build = function() {
      $cfs.data('_cfs_isCarousel', true);

      var a_itm = $cfs.children(),
        orgCSS = in_mapCss($cfs, ['textAlign', 'float', 'position', 'top', 'right', 'bottom', 'left', 'zIndex', 'width', 'height', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft']),
        newPosition = 'relative';

      switch (orgCSS.position)
      {
        case 'absolute':
        case 'fixed':
          newPosition = orgCSS.position;
          break;
      }

      $wrp.css(orgCSS).css({
        'overflow'    : 'hidden',
        'position'    : newPosition
      });

      $cfs.data('_cfs_origCss', orgCSS).css({
        'textAlign'   : 'left',
        'float'     : 'none',
        'position'    : 'absolute',
        'top'     : 0,
        'right'     : 'auto',
        'bottom'    : 'auto',
        'left'      : 0,
        'marginTop'   : 0,
        'marginRight' : 0,
        'marginBottom'  : 0,
        'marginLeft'  : 0
      });

      sz_storeMargin(a_itm, opts);
      sz_storeSizes(a_itm, opts);
      if (opts.responsive)
      {
        sz_setResponsiveSizes(opts, a_itm);
      }

    };  //  /build


    $cfs._cfs_bind_events = function() {
      $cfs._cfs_unbind_events();


      //  stop event
      $cfs.bind(cf_e('stop', conf), function(e, imm) {
        e.stopPropagation();

        //  button
        if (!crsl.isStopped)
        {
          if (opts.auto.button)
          {
            opts.auto.button.addClass(cf_c('stopped', conf));
          }
        }

        //  set stopped
        crsl.isStopped = true;

        if (opts.auto.play)
        {
          opts.auto.play = false;
          $cfs.trigger(cf_e('pause', conf), imm);
        }
        return true;
      });


      //  finish event
      $cfs.bind(cf_e('finish', conf), function(e) {
        e.stopPropagation();
        if (crsl.isScrolling)
        {
          sc_stopScroll(scrl);
        }
        return true;
      });


      //  pause event
      $cfs.bind(cf_e('pause', conf), function(e, imm, res) {
        e.stopPropagation();
        tmrs = sc_clearTimers(tmrs);

        //  immediately pause
        if (imm && crsl.isScrolling)
        {
          scrl.isStopped = true;
          var nst = getTime() - scrl.startTime;
          scrl.duration -= nst;
          if (scrl.pre)
          {
            scrl.pre.duration -= nst;
          }
          if (scrl.post)
          {
            scrl.post.duration -= nst;
          }
          sc_stopScroll(scrl, false);
        }

        //  update remaining pause-time
        if (!crsl.isPaused && !crsl.isScrolling)
        {
          if (res)
          {
            tmrs.timePassed += getTime() - tmrs.startTime;
          }
        }

        //  button
        if (!crsl.isPaused)
        {
          if (opts.auto.button)
          {
            opts.auto.button.addClass(cf_c('paused', conf));
          }
        }

        //  set paused
        crsl.isPaused = true;

        //  pause pause callback
        if (opts.auto.onTimeoutPause)
        {
          var dur1 = opts.auto.timeoutDuration - tmrs.timePassed,
            perc = 100 - Math.ceil( dur1 * 100 / opts.auto.timeoutDuration );

          opts.auto.onTimeoutPause.call($tt0, perc, dur1);
        }
        return true;
      });


      //  play event
      $cfs.bind(cf_e('play', conf), function(e, dir, del, res) {
        e.stopPropagation();
        tmrs = sc_clearTimers(tmrs);

        //  sort params
        var v = [dir, del, res],
          t = ['string', 'number', 'boolean'],
          a = cf_sortParams(v, t);

        dir = a[0];
        del = a[1];
        res = a[2];

        if (dir != 'prev' && dir != 'next')
        {
          dir = crsl.direction;
        }
        if (!is_number(del))
        {
          del = 0;
        }
        if (!is_boolean(res))
        {
          res = false;
        }

        //  stopped?
        if (res)
        {
          crsl.isStopped = false;
          opts.auto.play = true;
        }
        if (!opts.auto.play)
        {
          e.stopImmediatePropagation();
          return debug(conf, 'Carousel stopped: Not scrolling.');
        }

        //  button
        if (crsl.isPaused)
        {
          if (opts.auto.button)
          {
            opts.auto.button.removeClass(cf_c('stopped', conf));
            opts.auto.button.removeClass(cf_c('paused', conf));
          }
        }

        //  set playing
        crsl.isPaused = false;
        tmrs.startTime = getTime();

        //  timeout the scrolling
        var dur1 = opts.auto.timeoutDuration + del;
          dur2 = dur1 - tmrs.timePassed;
          perc = 100 - Math.ceil(dur2 * 100 / dur1);

        if (opts.auto.progress)
        {
          tmrs.progress = setInterval(function() {
            var pasd = getTime() - tmrs.startTime + tmrs.timePassed,
              perc = Math.ceil(pasd * 100 / dur1);
            opts.auto.progress.updater.call(opts.auto.progress.bar[0], perc);
          }, opts.auto.progress.interval);
        }

        tmrs.auto = setTimeout(function() {
          if (opts.auto.progress)
          {
            opts.auto.progress.updater.call(opts.auto.progress.bar[0], 100);
          }
          if (opts.auto.onTimeoutEnd)
          {
            opts.auto.onTimeoutEnd.call($tt0, perc, dur2);
          }
          if (crsl.isScrolling)
          {
            $cfs.trigger(cf_e('play', conf), dir);
          }
          else
          {
            $cfs.trigger(cf_e(dir, conf), opts.auto);
          }
        }, dur2);

        //  pause start callback
        if (opts.auto.onTimeoutStart)
        {
          opts.auto.onTimeoutStart.call($tt0, perc, dur2);
        }

        return true;
      });


      //  resume event
      $cfs.bind(cf_e('resume', conf), function(e) {
        e.stopPropagation();
        if (scrl.isStopped)
        {
          scrl.isStopped = false;
          crsl.isPaused = false;
          crsl.isScrolling = true;
          scrl.startTime = getTime();
          sc_startScroll(scrl);
        }
        else
        {
          $cfs.trigger(cf_e('play', conf));
        }
        return true;
      });


      //  prev + next events
      $cfs.bind(cf_e('prev', conf)+' '+cf_e('next', conf), function(e, obj, num, clb, que) {
        e.stopPropagation();

        //  stopped or hidden carousel, don't scroll, don't queue
        if (crsl.isStopped || $cfs.is(':hidden'))
        {
          e.stopImmediatePropagation();
          return debug(conf, 'Carousel stopped or hidden: Not scrolling.');
        }

        //  not enough items
        var minimum = (is_number(opts.items.minimum)) ? opts.items.minimum : opts.items.visible + 1;
        if (minimum > itms.total)
        {
          e.stopImmediatePropagation();
          return debug(conf, 'Not enough items ('+itms.total+' total, '+minimum+' needed): Not scrolling.');
        }

        //  get config
        var v = [obj, num, clb, que],
          t = ['object', 'number/string', 'function', 'boolean'],
          a = cf_sortParams(v, t);

        obj = a[0];
        num = a[1];
        clb = a[2];
        que = a[3];

        var eType = e.type.slice(conf.events.prefix.length);

        if (!is_object(obj))
        {
          obj = {};
        }
        if (is_function(clb))
        {
          obj.onAfter = clb;
        }
        if (is_boolean(que))
        {
          obj.queue = que;
        }
        obj = $.extend(true, {}, opts[eType], obj);

        //  test conditions callback
        if (obj.conditions && !obj.conditions.call($tt0, eType))
        {
          e.stopImmediatePropagation();
          return debug(conf, 'Callback "conditions" returned false.');
        }

        if (!is_number(num))
        {
          if (opts.items.filter != '*')
          {
            num = 'visible';
          }
          else
          {
            var arr = [num, obj.items, opts[eType].items];
            for (var a = 0, l = arr.length; a < l; a++)
            {
              if (is_number(arr[a]) || arr[a] == 'page' || arr[a] == 'visible') {
                num = arr[a];
                break;
              }
            }
          }
          switch(num) {
            case 'page':
              e.stopImmediatePropagation();
              return $cfs.triggerHandler(cf_e(eType+'Page', conf), [obj, clb]);
              break;

            case 'visible':
              if (!opts.items.visibleConf.variable && opts.items.filter == '*')
              {
                num = opts.items.visible;
              }
              break;
          }
        }

        //  resume animation, add current to queue
        if (scrl.isStopped)
        {
          $cfs.trigger(cf_e('resume', conf));
          $cfs.trigger(cf_e('queue', conf), [eType, [obj, num, clb]]);
          e.stopImmediatePropagation();
          return debug(conf, 'Carousel resumed scrolling.');
        }

        //  queue if scrolling
        if (obj.duration > 0)
        {
          if (crsl.isScrolling)
          {
            if (obj.queue)
            {
              if (obj.queue == 'last')
              {
                queu = [];
              }
              if (obj.queue != 'first' || queu.length == 0)
              {
                $cfs.trigger(cf_e('queue', conf), [eType, [obj, num, clb]]);
              }
            }
            e.stopImmediatePropagation();
            return debug(conf, 'Carousel currently scrolling.');
          }
        }

        tmrs.timePassed = 0;
        $cfs.trigger(cf_e('slide_'+eType, conf), [obj, num]);

        //  synchronise
        if (opts.synchronise)
        {
          var s = opts.synchronise,
            c = [obj, num];

          for (var j = 0, l = s.length; j < l; j++) {
            var d = eType;
            if (!s[j][2])
            {
              d = (d == 'prev') ? 'next' : 'prev';
            }
            if (!s[j][1])
            {
              c[0] = s[j][0].triggerHandler('_cfs_triggerEvent', ['configuration', d]);
            }
            c[1] = num + s[j][3];
            s[j][0].trigger('_cfs_triggerEvent', ['slide_'+d, c]);
          }
        }
        return true;
      });


      //  prev event
      $cfs.bind(cf_e('slide_prev', conf), function(e, sO, nI) {
        e.stopPropagation();
        var a_itm = $cfs.children();

        //  non-circular at start, scroll to end
        if (!opts.circular)
        {
          if (itms.first == 0)
          {
            if (opts.infinite)
            {
              $cfs.trigger(cf_e('next', conf), itms.total-1);
            }
            return e.stopImmediatePropagation();
          }
        }

        sz_resetMargin(a_itm, opts);

        //  find number of items to scroll
        if (!is_number(nI))
        {
          if (opts.items.visibleConf.variable)
          {
            nI = gn_getVisibleItemsPrev(a_itm, opts, itms.total-1);
          }
          else if (opts.items.filter != '*')
          {
            var xI = (is_number(sO.items)) ? sO.items : gn_getVisibleOrg($cfs, opts);
            nI = gn_getScrollItemsPrevFilter(a_itm, opts, itms.total-1, xI);
          }
          else
          {
            nI = opts.items.visible;
          }
          nI = cf_getAdjust(nI, opts, sO.items, $tt0);
        }

        //  prevent non-circular from scrolling to far
        if (!opts.circular)
        {
          if (itms.total - nI < itms.first)
          {
            nI = itms.total - itms.first;
          }
        }

        //  set new number of visible items
        opts.items.visibleConf.old = opts.items.visible;
        if (opts.items.visibleConf.variable)
        {
          var vI = cf_getItemsAdjust(gn_getVisibleItemsNext(a_itm, opts, itms.total-nI), opts, opts.items.visibleConf.adjust, $tt0);
          if (opts.items.visible+nI <= vI && nI < itms.total)
          {
            nI++;
            vI = cf_getItemsAdjust(gn_getVisibleItemsNext(a_itm, opts, itms.total-nI), opts, opts.items.visibleConf.adjust, $tt0);
          }
          opts.items.visible = vI;
        }
        else if (opts.items.filter != '*')
        {
          var vI = gn_getVisibleItemsNextFilter(a_itm, opts, itms.total-nI);
          opts.items.visible = cf_getItemsAdjust(vI, opts, opts.items.visibleConf.adjust, $tt0);
        }

        sz_resetMargin(a_itm, opts, true);

        //  scroll 0, don't scroll
        if (nI == 0)
        {
          e.stopImmediatePropagation();
          return debug(conf, '0 items to scroll: Not scrolling.');
        }
        debug(conf, 'Scrolling '+nI+' items backward.');


        //  save new config
        itms.first += nI;
        while (itms.first >= itms.total)
        {
          itms.first -= itms.total;
        }

        //  non-circular callback
        if (!opts.circular)
        {
          if (itms.first == 0 && sO.onEnd)
          {
            sO.onEnd.call($tt0, 'prev');
          }
          if (!opts.infinite)
          {
            nv_enableNavi(opts, itms.first, conf);
          }
        }

        //  rearrange items
        $cfs.children().slice(itms.total-nI, itms.total).prependTo($cfs);
        if (itms.total < opts.items.visible + nI)
        {
          $cfs.children().slice(0, (opts.items.visible+nI)-itms.total).clone(true).appendTo($cfs);
        }

        //  the needed items
        var a_itm = $cfs.children(),
          i_old = gi_getOldItemsPrev(a_itm, opts, nI),
          i_new = gi_getNewItemsPrev(a_itm, opts),
          i_cur_l = a_itm.eq(nI-1),
          i_old_l = i_old.last(),
          i_new_l = i_new.last();

        sz_resetMargin(a_itm, opts);

        var pL = 0,
          pR = 0;

        if (opts.align)
        {
          var p = cf_getAlignPadding(i_new, opts);
          pL = p[0];
          pR = p[1];
        }
        var oL = (pL < 0) ? opts.padding[opts.d[3]] : 0;

        //  hide items for fx directscroll
        var hiddenitems = false,
          i_skp = $();
        if (opts.items.visible < nI)
        {
          i_skp = a_itm.slice(opts.items.visibleConf.old, nI);
          if (sO.fx == 'directscroll')
          {
            var orgW = opts.items[opts.d['width']];
            hiddenitems = i_skp;
            i_cur_l = i_new_l;
            sc_hideHiddenItems(hiddenitems);
            opts.items[opts.d['width']] = 'variable';
          }
        }

        //  save new sizes
        var $cf2 = false,
          i_siz = ms_getTotalSize(a_itm.slice(0, nI), opts, 'width'),
          w_siz = cf_mapWrapperSizes(ms_getSizes(i_new, opts, true), opts, !opts.usePadding),
          i_siz_vis = 0,
          a_cfs = {},
          a_wsz = {},
          a_cur = {},
          a_old = {},
          a_new = {},
          a_lef = {},
          a_lef_vis = {},
          a_dur = sc_getDuration(sO, opts, nI, i_siz);

        switch(sO.fx)
        {
          case 'cover':
          case 'cover-fade':
            i_siz_vis = ms_getTotalSize(a_itm.slice(0, opts.items.visible), opts, 'width');
            break;
        }

        if (hiddenitems)
        {
          opts.items[opts.d['width']] = orgW;
        }

        sz_resetMargin(a_itm, opts, true);
        if (pR >= 0)
        {
          sz_resetMargin(i_old_l, opts, opts.padding[opts.d[1]]);
        }
        if (pL >= 0)
        {
          sz_resetMargin(i_cur_l, opts, opts.padding[opts.d[3]]);
        }

        if (opts.align)
        {
          opts.padding[opts.d[1]] = pR;
          opts.padding[opts.d[3]] = pL;
        }

        a_lef[opts.d['left']] = -(i_siz - oL);
        a_lef_vis[opts.d['left']] = -(i_siz_vis - oL);
        a_wsz[opts.d['left']] = w_siz[opts.d['width']];

        //  scrolling functions
        var _s_wrapper = function() {},
          _a_wrapper = function() {},
          _s_paddingold = function() {},
          _a_paddingold = function() {},
          _s_paddingnew = function() {},
          _a_paddingnew = function() {},
          _s_paddingcur = function() {},
          _a_paddingcur = function() {},
          _onafter = function() {},
          _moveitems = function() {},
          _position = function() {};

        //  clone carousel
        switch(sO.fx)
        {
          case 'crossfade':
          case 'cover':
          case 'cover-fade':
          case 'uncover':
          case 'uncover-fade':
            $cf2 = $cfs.clone(true).appendTo($wrp);
            break;
        }
        switch(sO.fx)
        {
          case 'crossfade':
          case 'uncover':
          case 'uncover-fade':
            $cf2.children().slice(0, nI).remove();
            $cf2.children().slice(opts.items.visibleConf.old).remove();
            break;

          case 'cover':
          case 'cover-fade':
            $cf2.children().slice(opts.items.visible).remove();
            $cf2.css(a_lef_vis);
            break;
        }

        $cfs.css(a_lef);

        //  reset all scrolls
        scrl = sc_setScroll(a_dur, sO.easing);

        //  animate / set carousel
        a_cfs[opts.d['left']] = (opts.usePadding) ? opts.padding[opts.d[3]] : 0;

        //  animate / set wrapper
        if (opts[opts.d['width']] == 'variable' || opts[opts.d['height']] == 'variable')
        {
          _s_wrapper = function() {
            $wrp.css(w_siz);
          };
          _a_wrapper = function() {
            scrl.anims.push([$wrp, w_siz]);
          };
        }

        //  animate / set items
        if (opts.usePadding)
        {
          if (i_new_l.not(i_cur_l).length)
          {
            a_cur[opts.d['marginRight']] = i_cur_l.data('_cfs_origCssMargin');

            if (pL < 0)
            {
              i_cur_l.css(a_cur);
            }
            else
            {
              _s_paddingcur = function() {
                i_cur_l.css(a_cur);
              };
              _a_paddingcur = function() {
                scrl.anims.push([i_cur_l, a_cur]);
              };
            }
          }
          switch(sO.fx)
          {
            case 'cover':
            case 'cover-fade':
              $cf2.children().eq(nI-1).css(a_cur);
              break;
          }

          if (i_new_l.not(i_old_l).length)
          {
            a_old[opts.d['marginRight']] = i_old_l.data('_cfs_origCssMargin');
            _s_paddingold = function() {
              i_old_l.css(a_old);
            };
            _a_paddingold = function() {
              scrl.anims.push([i_old_l, a_old]);
            };
          }

          if (pR >= 0)
          {
            a_new[opts.d['marginRight']] = i_new_l.data('_cfs_origCssMargin') + opts.padding[opts.d[1]];
            _s_paddingnew = function() {
              i_new_l.css(a_new);
            };
            _a_paddingnew = function() {
              scrl.anims.push([i_new_l, a_new]);
            };
          }
        }

        //  set position
        _position = function() {
          $cfs.css(a_cfs);
        };


        var overFill = opts.items.visible+nI-itms.total;

        //  rearrange items
        _moveitems = function() {
          if (overFill > 0)
          {
            $cfs.children().slice(itms.total).remove();
            i_old = $( $cfs.children().slice(itms.total-(opts.items.visible-overFill)).get().concat( $cfs.children().slice(0, overFill).get() ) );
          }
          sc_showHiddenItems(hiddenitems);

          if (opts.usePadding)
          {
            var l_itm = $cfs.children().eq(opts.items.visible+nI-1);
            l_itm.css(opts.d['marginRight'], l_itm.data('_cfs_origCssMargin'));
          }
        };


        var cb_arguments = sc_mapCallbackArguments(i_old, i_skp, i_new, nI, 'prev', a_dur, w_siz);

        //  fire onAfter callbacks
        _onafter = function() {
          sc_afterScroll($cfs, $cf2, sO);
          crsl.isScrolling = false;
          clbk.onAfter = sc_fireCallbacks($tt0, sO, 'onAfter', cb_arguments, clbk);
          queu = sc_fireQueue($cfs, queu, conf);

          if (!crsl.isPaused)
          {
            $cfs.trigger(cf_e('play', conf));
          }
        };

        //  fire onBefore callback
        crsl.isScrolling = true;
        tmrs = sc_clearTimers(tmrs);
        clbk.onBefore = sc_fireCallbacks($tt0, sO, 'onBefore', cb_arguments, clbk);

        switch(sO.fx)
        {
          case 'none':
            $cfs.css(a_cfs);
            _s_wrapper();
            _s_paddingold();
            _s_paddingnew();
            _s_paddingcur();
            _position();
            _moveitems();
            _onafter();
            break;

          case 'fade':
            scrl.anims.push([$cfs, { 'opacity': 0 }, function() {
              _s_wrapper();
              _s_paddingold();
              _s_paddingnew();
              _s_paddingcur();
              _position();
              _moveitems();
              scrl = sc_setScroll(a_dur, sO.easing);
              scrl.anims.push([$cfs, { 'opacity': 1 }, _onafter]);
              sc_startScroll(scrl);
            }]);
            break;

          case 'crossfade':
            $cfs.css({ 'opacity': 0 });
            scrl.anims.push([$cf2, { 'opacity': 0 }]);
            scrl.anims.push([$cfs, { 'opacity': 1 }, _onafter]);
            _a_wrapper();
            _s_paddingold();
            _s_paddingnew();
            _s_paddingcur();
            _position();
            _moveitems();
            break;

          case 'cover':
            scrl.anims.push([$cf2, a_cfs, function() {
              _s_paddingold();
              _s_paddingnew();
              _s_paddingcur();
              _position();
              _moveitems();
              _onafter();
            }]);
            _a_wrapper();
            break;

          case 'cover-fade':
            scrl.anims.push([$cfs, { 'opacity': 0 }]);
            scrl.anims.push([$cf2, a_cfs, function() {
              $cfs.css({ 'opacity': 1 });
              _s_paddingold();
              _s_paddingnew();
              _s_paddingcur();
              _position();
              _moveitems();
              _onafter();
            }]);
            _a_wrapper();
            break;

          case 'uncover':
            scrl.anims.push([$cf2, a_wsz, _onafter]);
            _a_wrapper();
            _s_paddingold();
            _s_paddingnew();
            _s_paddingcur();
            _position();
            _moveitems();
            break;

          case 'uncover-fade':
            $cfs.css({ 'opacity': 0 });
            scrl.anims.push([$cfs, { 'opacity': 1 }]);
            scrl.anims.push([$cf2, a_wsz, _onafter]);
            _a_wrapper();
            _s_paddingold();
            _s_paddingnew();
            _s_paddingcur();
            _position();
            _moveitems();
            break;

          default:
            scrl.anims.push([$cfs, a_cfs, function() {
              _moveitems();
              _onafter();
            }]);
            _a_wrapper();
            _a_paddingold();
            _a_paddingnew();
            _a_paddingcur();
            break;
        }

        sc_startScroll(scrl);
        cf_setCookie(opts.cookie, $cfs, conf);

        $cfs.trigger(cf_e('updatePageStatus', conf), [false, w_siz]);

        return true;
      });


      //  next event
      $cfs.bind(cf_e('slide_next', conf), function(e, sO, nI) {
        e.stopPropagation();
        var a_itm = $cfs.children();

        //  non-circular at end, scroll to start
        if (!opts.circular)
        {
          if (itms.first == opts.items.visible)
          {
            if (opts.infinite)
            {
              $cfs.trigger(cf_e('prev', conf), itms.total-1);
            }
            return e.stopImmediatePropagation();
          }
        }

        sz_resetMargin(a_itm, opts);

        //  find number of items to scroll
        if (!is_number(nI))
        {
          if (opts.items.filter != '*')
          {
            var xI = (is_number(sO.items)) ? sO.items : gn_getVisibleOrg($cfs, opts);
            nI = gn_getScrollItemsNextFilter(a_itm, opts, 0, xI);
          }
          else
          {
            nI = opts.items.visible;
          }
          nI = cf_getAdjust(nI, opts, sO.items, $tt0);
        }

        var lastItemNr = (itms.first == 0) ? itms.total : itms.first;

        //  prevent non-circular from scrolling to far
        if (!opts.circular)
        {
          if (opts.items.visibleConf.variable)
          {
            var vI = gn_getVisibleItemsNext(a_itm, opts, nI),
              xI = gn_getVisibleItemsPrev(a_itm, opts, lastItemNr-1);
          }
          else
          {
            var vI = opts.items.visible,
              xI = opts.items.visible;
          }

          if (nI + vI > lastItemNr)
          {
            nI = lastItemNr - xI;
          }
        }

        //  set new number of visible items
        opts.items.visibleConf.old = opts.items.visible;
        if (opts.items.visibleConf.variable)
        {
          var vI = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(a_itm, opts, nI, lastItemNr), opts, opts.items.visibleConf.adjust, $tt0);
          while (opts.items.visible-nI >= vI && nI < itms.total)
          {
            nI++;
            vI = cf_getItemsAdjust(gn_getVisibleItemsNextTestCircular(a_itm, opts, nI, lastItemNr), opts, opts.items.visibleConf.adjust, $tt0);
          }
          opts.items.visible = vI;
        }
        else if (opts.items.filter != '*')
        {
          var vI = gn_getVisibleItemsNextFilter(a_itm, opts, nI);
          opts.items.visible = cf_getItemsAdjust(vI, opts, opts.items.visibleConf.adjust, $tt0);
        }

        sz_resetMargin(a_itm, opts, true);

        //  scroll 0, don't scroll
        if (nI == 0)
        {
          e.stopImmediatePropagation();
          return debug(conf, '0 items to scroll: Not scrolling.');
        }
        debug(conf, 'Scrolling '+nI+' items forward.');


        //  save new config
        itms.first -= nI;
        while (itms.first < 0)
        {
          itms.first += itms.total;
        }

        //  non-circular callback
        if (!opts.circular)
        {
          if (itms.first == opts.items.visible && sO.onEnd)
          {
            sO.onEnd.call($tt0, 'next');
          }
          if (!opts.infinite)
          {
            nv_enableNavi(opts, itms.first, conf);
          }
        }

        //  rearrange items
        if (itms.total < opts.items.visible+nI)
        {
          $cfs.children().slice(0, (opts.items.visible+nI)-itms.total).clone(true).appendTo($cfs);
        }

        //  the needed items
        var a_itm = $cfs.children(),
          i_old = gi_getOldItemsNext(a_itm, opts),
          i_new = gi_getNewItemsNext(a_itm, opts, nI),
          i_cur_l = a_itm.eq(nI-1),
          i_old_l = i_old.last(),
          i_new_l = i_new.last();

        sz_resetMargin(a_itm, opts);

        var pL = 0,
          pR = 0;

        if (opts.align)
        {
          var p = cf_getAlignPadding(i_new, opts);
          pL = p[0];
          pR = p[1];
        }

        //  hide items for fx directscroll
        var hiddenitems = false,
          i_skp = $();
        if (opts.items.visibleConf.old < nI)
        {
          i_skp = a_itm.slice(opts.items.visibleConf.old, nI);
          if (sO.fx == 'directscroll')
          {
            var orgW = opts.items[opts.d['width']];
            hiddenitems = i_skp;
            i_cur_l = i_old_l;
            sc_hideHiddenItems(hiddenitems);
            opts.items[opts.d['width']] = 'variable';
          }
        }

        //  save new sizes
        var $cf2 = false,
          i_siz = ms_getTotalSize(a_itm.slice(0, nI), opts, 'width'),
          w_siz = cf_mapWrapperSizes(ms_getSizes(i_new, opts, true), opts, !opts.usePadding),
          i_siz_vis = 0,
          a_cfs = {},
          a_cfs_vis = {},
          a_cur = {},
          a_old = {},
          a_lef = {},
          a_dur = sc_getDuration(sO, opts, nI, i_siz);

        switch(sO.fx)
        {
          case 'uncover':
          case 'uncover-fade':
            i_siz_vis = ms_getTotalSize(a_itm.slice(0, opts.items.visibleConf.old), opts, 'width');
            break;
        }

        if (hiddenitems)
        {
          opts.items[opts.d['width']] = orgW;
        }

        if (opts.align)
        {
          if (opts.padding[opts.d[1]] < 0)
          {
            opts.padding[opts.d[1]] = 0;
          }
        }
        sz_resetMargin(a_itm, opts, true);
        sz_resetMargin(i_old_l, opts, opts.padding[opts.d[1]]);

        if (opts.align)
        {
          opts.padding[opts.d[1]] = pR;
          opts.padding[opts.d[3]] = pL;
        }

        a_lef[opts.d['left']] = (opts.usePadding) ? opts.padding[opts.d[3]] : 0;

        //  scrolling functions
        var _s_wrapper = function() {},
          _a_wrapper = function() {},
          _s_paddingold = function() {},
          _a_paddingold = function() {},
          _s_paddingcur = function() {},
          _a_paddingcur = function() {},
          _onafter = function() {},
          _moveitems = function() {},
          _position = function() {};

        //  clone carousel
        switch(sO.fx)
        {
          case 'crossfade':
          case 'cover':
          case 'cover-fade':
          case 'uncover':
          case 'uncover-fade':
            $cf2 = $cfs.clone(true).appendTo($wrp);
            $cf2.children().slice(opts.items.visibleConf.old).remove();
            break;
        }
        switch(sO.fx)
        {
          case 'crossfade':
          case 'cover':
          case 'cover-fade':
            $cfs.css('zIndex', 1);
            $cf2.css('zIndex', 0);
            break;
        }

        //  reset all scrolls
        scrl = sc_setScroll(a_dur, sO.easing);

        //  animate / set carousel
        a_cfs[opts.d['left']] = -i_siz;
        a_cfs_vis[opts.d['left']] = -i_siz_vis;

        if (pL < 0)
        {
          a_cfs[opts.d['left']] += pL;
        }

        //  animate / set wrapper
        if (opts[opts.d['width']] == 'variable' || opts[opts.d['height']] == 'variable')
        {
          _s_wrapper = function() {
            $wrp.css(w_siz);
          };
          _a_wrapper = function() {
            scrl.anims.push([$wrp, w_siz]);
          };
        }

        //  animate / set items
        if (opts.usePadding)
        {
          var i_new_l_m = i_new_l.data('_cfs_origCssMargin');
          if (pR >= 0)
          {
            i_new_l_m += opts.padding[opts.d[1]];
          }
          i_new_l.css(opts.d['marginRight'], i_new_l_m);

          if (i_cur_l.not(i_old_l).length)
          {
            a_old[opts.d['marginRight']] = i_old_l.data('_cfs_origCssMargin');
          }
          _s_paddingold = function() {
            i_old_l.css(a_old);
          };
          _a_paddingold = function() {
            scrl.anims.push([i_old_l, a_old]);
          };

          var i_cur_l_m = i_cur_l.data('_cfs_origCssMargin');
          if (pL > 0)
          {
            i_cur_l_m += opts.padding[opts.d[3]];
          }
          a_cur[opts.d['marginRight']] = i_cur_l_m;
          _s_paddingcur = function() {
            i_cur_l.css(a_cur);
          };
          _a_paddingcur = function() {
            scrl.anims.push([i_cur_l, a_cur]);
          };
        }

        //  set position
        _position = function() {
          $cfs.css(a_lef);
        };


        var overFill = opts.items.visible+nI-itms.total;

        //  rearrange items
        _moveitems = function() {
          if (overFill > 0)
          {
            $cfs.children().slice(itms.total).remove();
          }
          var l_itm = $cfs.children().slice(0, nI).appendTo($cfs).last();
          if (overFill > 0)
          {
            i_new = gi_getCurrentItems(a_itm, opts);
          }
          sc_showHiddenItems(hiddenitems);

          if (opts.usePadding)
          {
            if (itms.total < opts.items.visible+nI) {
              var i_cur_l = $cfs.children().eq(opts.items.visible-1);
              i_cur_l.css(opts.d['marginRight'], i_cur_l.data('_cfs_origCssMargin') + opts.padding[opts.d[3]]);
            }
            l_itm.css(opts.d['marginRight'], l_itm.data('_cfs_origCssMargin'));
          }
        };


        var cb_arguments = sc_mapCallbackArguments(i_old, i_skp, i_new, nI, 'next', a_dur, w_siz);

        //  fire onAfter callbacks
        _onafter = function() {
          $cfs.css('zIndex', $cfs.data('_cfs_origCss').zIndex);
          sc_afterScroll($cfs, $cf2, sO);
          crsl.isScrolling = false;
          clbk.onAfter = sc_fireCallbacks($tt0, sO, 'onAfter', cb_arguments, clbk);
          queu = sc_fireQueue($cfs, queu, conf);
          
          if (!crsl.isPaused)
          {
            $cfs.trigger(cf_e('play', conf));
          }
        };

        //  fire onBefore callbacks
        crsl.isScrolling = true;
        tmrs = sc_clearTimers(tmrs);
        clbk.onBefore = sc_fireCallbacks($tt0, sO, 'onBefore', cb_arguments, clbk);

        switch(sO.fx)
        {
          case 'none':
            $cfs.css(a_cfs);
            _s_wrapper();
            _s_paddingold();
            _s_paddingcur();
            _position();
            _moveitems();
            _onafter();
            break;

          case 'fade':
            scrl.anims.push([$cfs, { 'opacity': 0 }, function() {
              _s_wrapper();
              _s_paddingold();
              _s_paddingcur();
              _position();
              _moveitems();
              scrl = sc_setScroll(a_dur, sO.easing);
              scrl.anims.push([$cfs, { 'opacity': 1 }, _onafter]);
              sc_startScroll(scrl);
            }]);
            break;

          case 'crossfade':
            $cfs.css({ 'opacity': 0 });
            scrl.anims.push([$cf2, { 'opacity': 0 }]);
            scrl.anims.push([$cfs, { 'opacity': 1 }, _onafter]);
            _a_wrapper();
            _s_paddingold();
            _s_paddingcur();
            _position();
            _moveitems();
            break;

          case 'cover':
            $cfs.css(opts.d['left'], $wrp[opts.d['width']]());
            scrl.anims.push([$cfs, a_lef, _onafter]);
            _a_wrapper();
            _s_paddingold();
            _s_paddingcur();
            _moveitems();
            break;

          case 'cover-fade':
            $cfs.css(opts.d['left'], $wrp[opts.d['width']]());
            scrl.anims.push([$cf2, { 'opacity': 0 }]);
            scrl.anims.push([$cfs, a_lef, _onafter]);
            _a_wrapper();
            _s_paddingold();
            _s_paddingcur();
            _moveitems();
            break;

          case 'uncover':
            scrl.anims.push([$cf2, a_cfs_vis, _onafter]);
            _a_wrapper();
            _s_paddingold();
            _s_paddingcur();
            _position();
            _moveitems();
            break;

          case 'uncover-fade':
            $cfs.css({ 'opacity': 0 });
            scrl.anims.push([$cfs, { 'opacity': 1 }]);
            scrl.anims.push([$cf2, a_cfs_vis, _onafter]);
            _a_wrapper();
            _s_paddingold();
            _s_paddingcur();
            _position();
            _moveitems();
            break;

          default:
            scrl.anims.push([$cfs, a_cfs, function() {
              _position();
              _moveitems();
              _onafter();
            }]);
            _a_wrapper();
            _a_paddingold();
            _a_paddingcur();
            break;
        }

        sc_startScroll(scrl);
        cf_setCookie(opts.cookie, $cfs, conf);

        $cfs.trigger(cf_e('updatePageStatus', conf), [false, w_siz]);

        return true;
      });


      //  slideTo event
      $cfs.bind(cf_e('slideTo', conf), function(e, num, dev, org, obj, dir, clb) {
        e.stopPropagation();

        var v = [num, dev, org, obj, dir, clb],
          t = ['string/number/object', 'number', 'boolean', 'object', 'string', 'function'],
          a = cf_sortParams(v, t);

        obj = a[3];
        dir = a[4];
        clb = a[5];

        num = gn_getItemIndex(a[0], a[1], a[2], itms, $cfs);

        if (num == 0)
        {
          return false;
        }
        if (!is_object(obj))
        {
          obj = false;
        }

/*
        if (crsl.isScrolling)
        {
          if (!is_object(obj) || obj.duration > 0)
          {
//            return false;
          }
        }
*/

        if (dir != 'prev' && dir != 'next')
        {
          if (opts.circular)
          {
            dir = (num <= itms.total / 2) ? 'next' : 'prev';
          }
          else
          {
            dir = (itms.first == 0 || itms.first > num) ? 'next' : 'prev';
          }
        }

        if (dir == 'prev')
        {
          num = itms.total-num;
        }
        $cfs.trigger(cf_e(dir, conf), [obj, num, clb]);

        return true;
      });


      //  prevPage event
      $cfs.bind(cf_e('prevPage', conf), function(e, obj, clb) {
        e.stopPropagation();
        var cur = $cfs.triggerHandler(cf_e('currentPage', conf));
        return $cfs.triggerHandler(cf_e('slideToPage', conf), [cur-1, obj, 'prev', clb]);
      });


      //  nextPage event
      $cfs.bind(cf_e('nextPage', conf), function(e, obj, clb) {
        e.stopPropagation();
        var cur = $cfs.triggerHandler(cf_e('currentPage', conf));
        return $cfs.triggerHandler(cf_e('slideToPage', conf), [cur+1, obj, 'next', clb]);
      });


      //  slideToPage event
      $cfs.bind(cf_e('slideToPage', conf), function(e, pag, obj, dir, clb) {
        e.stopPropagation();
        if (!is_number(pag))
        {
          pag = $cfs.triggerHandler(cf_e('currentPage', conf));
        }
        var ipp = opts.pagination.items || opts.items.visible,
          max = Math.ceil(itms.total / ipp)-1;

        if (pag < 0)
        {
          pag = max;
        }
        if (pag > max)
        {
          pag = 0;
        }
        return $cfs.triggerHandler(cf_e('slideTo', conf), [pag*ipp, 0, true, obj, dir, clb]);
      });

      //  jumpToStart event
      $cfs.bind(cf_e('jumpToStart', conf), function(e, s) {
        e.stopPropagation();
        if (s)
        {
          s = gn_getItemIndex(s, 0, true, itms, $cfs);
        }
        else
        {
          s = 0;
        }

        s += itms.first;
        if (s != 0)
        {
          if (itms.total > 0)
          {
            while (s > itms.total)
            {
              s -= itms.total;
            }
          }
          $cfs.prepend($cfs.children().slice(s, itms.total));
        }
        return true;
      });


      //  synchronise event
      $cfs.bind(cf_e('synchronise', conf), function(e, s) {
        e.stopPropagation();
        if (s)
        {
          s = cf_getSynchArr(s);
        }
        else if (opts.synchronise)
        {
          s = opts.synchronise;
        }
        else
        {
          return debug(conf, 'No carousel to synchronise.');
        }

        var n = $cfs.triggerHandler(cf_e('currentPosition', conf)),
          x = true;

        for (var j = 0, l = s.length; j < l; j++)
        {
          if (!s[j][0].triggerHandler(cf_e('slideTo', conf), [n, s[j][3], true]))
          {
            x = false;
          }
        }
        return x;
      });


      //  queue event
      $cfs.bind(cf_e('queue', conf), function(e, dir, opt) {
        e.stopPropagation();
        if (is_function(dir))
        {
          dir.call($tt0, queu);
        }
        else if (is_array(dir))
        {
          queu = dir;
        }
        else if (!is_undefined(dir))
        {
          queu.push([dir, opt]);
        }
        return queu;
      });


      //  insertItem event
      $cfs.bind(cf_e('insertItem', conf), function(e, itm, num, org, dev) {
        e.stopPropagation();

        var v = [itm, num, org, dev],
          t = ['string/object', 'string/number/object', 'boolean', 'number'],
          a = cf_sortParams(v, t);

        itm = a[0];
        num = a[1];
        org = a[2];
        dev = a[3];

        if (is_object(itm) && !is_jquery(itm))
        { 
          itm = $(itm);
        }
        else if (is_string(itm))
        {
          itm = $(itm);
        }
        if (!is_jquery(itm) || itm.length == 0)
        {
          return debug(conf, 'Not a valid object.');
        }

        if (is_undefined(num))
        {
          num = 'end';
        }

        sz_storeMargin(itm, opts);
        sz_storeSizes(itm, opts);

        var orgNum = num,
          before = 'before';

        if (num == 'end')
        {
          if (org)
          {
            if (itms.first == 0)
            {
              num = itms.total-1;
              before = 'after';
            }
            else
            {
              num = itms.first;
              itms.first += itm.length;
            }
            if (num < 0)
            {
              num = 0;
            }
          }
          else
          {
            num = itms.total-1;
            before = 'after';
          }
        }
        else
        {
          num = gn_getItemIndex(num, dev, org, itms, $cfs);
        }

        var $cit = $cfs.children().eq(num);
        if ($cit.length)
        {
          $cit[before](itm);
        }
        else
        {
          debug(conf, 'Correct insert-position not found! Appending item to the end.');
          $cfs.append(itm);
        }

        if (orgNum != 'end' && !org)
        {
          if (num < itms.first)
          {
            itms.first += itm.length;
          }
        }
        itms.total = $cfs.children().length;
        if (itms.first >= itms.total)
        {
          itms.first -= itms.total;
        }

        $cfs.trigger(cf_e('updateSizes', conf));
        $cfs.trigger(cf_e('linkAnchors', conf));

        return true;
      });


      //  removeItem event
      $cfs.bind(cf_e('removeItem', conf), function(e, num, org, dev) {
        e.stopPropagation();

        var v = [num, org, dev],
          t = ['string/number/object', 'boolean', 'number'],
          a = cf_sortParams(v, t);

        num = a[0];
        org = a[1];
        dev = a[2];

        var removed = false;
        if (num instanceof $ && num.length > 1)
        {
          $removed = $();
          num.each(function(i, el) {
            var $rem = $cfs.trigger(cf_e('removeItem', conf), [$(this), org, dev]);
            if ($rem) $removed = $removed.add($rem);
          });
          return $removed;
        }

        if (is_undefined(num) || num == 'end')
        {
          $removed = $cfs.children().last();
        }
        else
        {
          num = gn_getItemIndex(num, dev, org, itms, $cfs);
          var $removed = $cfs.children().eq(num);
          if ($removed.length){
            if (num < itms.first) itms.first -= $removed.length;
          }
        }
        if ($removed && $removed.length)
        {
          $removed.detach();
          itms.total = $cfs.children().length;
          $cfs.trigger(cf_e('updateSizes', conf));
        }

        return $removed;
      });


      //  onBefore and onAfter event
      $cfs.bind(cf_e('onBefore', conf)+' '+cf_e('onAfter', conf), function(e, fn) {
        e.stopPropagation();
        var eType = e.type.slice(conf.events.prefix.length);
        if (is_array(fn))
        {
          clbk[eType] = fn;
        }
        if (is_function(fn))
        {
          clbk[eType].push(fn);
        }
        return clbk[eType];
      });


      //  currentPosition event
      $cfs.bind(cf_e('currentPosition', conf), function(e, fn) {
        e.stopPropagation();
        if (itms.first == 0)
        {
          var val = 0;
        }
        else
        {
          var val = itms.total - itms.first;
        }
        if (is_function(fn))
        {
          fn.call($tt0, val);
        }
        return val;
      });


      //  currentPage event
      $cfs.bind(cf_e('currentPage', conf), function(e, fn) {
        e.stopPropagation();
        var ipp = opts.pagination.items || opts.items.visible,
          max = Math.ceil(itms.total/ipp-1),
          nr;
        if (itms.first == 0)
        {
          nr = 0;
        }
        else if (itms.first < itms.total % ipp)
        {
          nr = 0;
        }
        else if (itms.first == ipp && !opts.circular)
        {
          nr = max;
        }
        else 
        {
           nr = Math.round((itms.total-itms.first)/ipp);
        }
        if (nr < 0)
        {
          nr = 0;
        }
        if (nr > max)
        {
          nr = max;
        }
        if (is_function(fn))
        {
          fn.call($tt0, nr);
        }
        return nr;
      });


      //  currentVisible event
      $cfs.bind(cf_e('currentVisible', conf), function(e, fn) {
        e.stopPropagation();
        var $i = gi_getCurrentItems($cfs.children(), opts);
        if (is_function(fn))
        {
          fn.call($tt0, $i);
        }
        return $i;
      });


      //  slice event
      $cfs.bind(cf_e('slice', conf), function(e, f, l, fn) {
        e.stopPropagation();

        if (itms.total == 0)
        {
          return false;
        }

        var v = [f, l, fn],
          t = ['number', 'number', 'function'],
          a = cf_sortParams(v, t);

        f = (is_number(a[0])) ? a[0] : 0;
        l = (is_number(a[1])) ? a[1] : itms.total;
        fn = a[2];

        f += itms.first;
        l += itms.first;

        if (items.total > 0)
        {
          while (f > itms.total)
          {
            f -= itms.total;
          }
          while (l > itms.total)
          {
            l -= itms.total;
          }
          while (f < 0)
          {
            f += itms.total;
          }
          while (l < 0)
          {
            l += itms.total;
          }
        }
        var $iA = $cfs.children(),
          $i;

        if (l > f)
        {
          $i = $iA.slice(f, l);
        }
        else
        {
          $i = $( $iA.slice(f, itms.total).get().concat( $iA.slice(0, l).get() ) );
        }

        if (is_function(fn))
        {
          fn.call($tt0, $i);
        }
        return $i;
      });


      //  isPaused, isStopped and isScrolling events
      $cfs.bind(cf_e('isPaused', conf)+' '+cf_e('isStopped', conf)+' '+cf_e('isScrolling', conf), function(e, fn) {
        e.stopPropagation();
        var eType = e.type.slice(conf.events.prefix.length),
          value = crsl[eType];
        if (is_function(fn))
        {
          fn.call($tt0, value);
        }
        return value;
      });


      //  configuration event
      $cfs.bind(cf_e('configuration', conf), function(e, a, b, c) {
        e.stopPropagation();
        var reInit = false;

        //  return entire configuration-object
        if (is_function(a))
        {
          a.call($tt0, opts);
        }
        //  set multiple options via object
        else if (is_object(a))
        {
          opts_orig = $.extend(true, {}, opts_orig, a);
          if (b !== false) reInit = true;
          else opts = $.extend(true, {}, opts, a);

        }
        else if (!is_undefined(a))
        {

          //  callback function for specific option
          if (is_function(b))
          {
            var val = eval('opts.'+a);
            if (is_undefined(val))
            {
              val = '';
            }
            b.call($tt0, val);
          }
          //  set individual option
          else if (!is_undefined(b))
          {
            if (typeof c !== 'boolean') c = true;
            eval('opts_orig.'+a+' = b');
            if (c !== false) reInit = true;
            else eval('opts.'+a+' = b');
          }
          //  return value for specific option
          else
          {
            return eval('opts.'+a);
          }
        }
        if (reInit)
        {
          sz_resetMargin($cfs.children(), opts);
          $cfs._cfs_init(opts_orig);
          $cfs._cfs_bind_buttons();
          var sz = sz_setSizes($cfs, opts);
          $cfs.trigger(cf_e('updatePageStatus', conf), [true, sz]);
        }
        return opts;
      });


      //  linkAnchors event
      $cfs.bind(cf_e('linkAnchors', conf), function(e, $con, sel) {
        e.stopPropagation();

        if (is_undefined($con))
        {
          $con = $('body');
        }
        else if (is_string($con))
        {
          $con = $($con);
        }
        if (!is_jquery($con) || $con.length == 0)
        {
          return debug(conf, 'Not a valid object.');
        }
        if (!is_string(sel))
        {
          sel = 'a.caroufredsel';
        }

        $con.find(sel).each(function() {
          var h = this.hash || '';
          if (h.length > 0 && $cfs.children().index($(h)) != -1)
          {
            $(this).unbind('click').click(function(e) {
              e.preventDefault();
              $cfs.trigger(cf_e('slideTo', conf), h);
            });
          }
        });
        return true;
      });


      //  updatePageStatus event
      $cfs.bind(cf_e('updatePageStatus', conf), function(e, build, sizes) {
        e.stopPropagation();
        if (!opts.pagination.container)
        {
          return;
        }

        var ipp = opts.pagination.items || opts.items.visible,
          pgs = Math.ceil(itms.total/ipp);

        if (build)
        {
          if (opts.pagination.anchorBuilder)
          {
            opts.pagination.container.children().remove();
            opts.pagination.container.each(function() {
              for (var a = 0; a < pgs; a++)
              {
                var i = $cfs.children().eq( gn_getItemIndex(a*ipp, 0, true, itms, $cfs) );
                $(this).append(opts.pagination.anchorBuilder.call(i[0], a+1));
              }
            });
          }
          opts.pagination.container.each(function() {
            $(this).children().unbind(opts.pagination.event).each(function(a) {
              $(this).bind(opts.pagination.event, function(e) {
                e.preventDefault();
                $cfs.trigger(cf_e('slideTo', conf), [a*ipp, -opts.pagination.deviation, true, opts.pagination]);
              });
            });
          });
        }

        var selected = $cfs.triggerHandler(cf_e('currentPage', conf)) + opts.pagination.deviation;
        if (selected >= pgs)
        {
          selected = 0;
        }
        if (selected < 0)
        {
          selected = pgs-1;
        }
        opts.pagination.container.each(function() {
          $(this).children().removeClass(cf_c('selected', conf)).eq(selected).addClass(cf_c('selected', conf));
        });
        return true;
      });


      //  updateSizes event
      $cfs.bind(cf_e('updateSizes', conf), function(e) {
        var vI = opts.items.visible,
          a_itm = $cfs.children(),
          avail_primary = ms_getParentSize($wrp, opts, 'width');

        itms.total = a_itm.length;

        if (crsl.primarySizePercentage)
        {
          opts.maxDimension = avail_primary;
          opts[opts.d['width']] = ms_getPercentage(avail_primary, crsl.primarySizePercentage);
        }
        else
        {
          opts.maxDimension = ms_getMaxDimension(opts, avail_primary);
        }

        if (opts.responsive)
        {
          opts.items.width = opts.items.sizesConf.width;
          opts.items.height = opts.items.sizesConf.height;
          opts = in_getResponsiveValues(opts, a_itm, avail_primary);
          vI = opts.items.visible;
          sz_setResponsiveSizes(opts, a_itm);
        }
        else if (opts.items.visibleConf.variable)
        {
          vI = gn_getVisibleItemsNext(a_itm, opts, 0);
        }
        else if (opts.items.filter != '*')
        {
          vI = gn_getVisibleItemsNextFilter(a_itm, opts, 0);
        }

        if (!opts.circular && itms.first != 0 && vI > itms.first) {
          if (opts.items.visibleConf.variable)
          {
            var nI = gn_getVisibleItemsPrev(a_itm, opts, itms.first) - itms.first;
          }
          else if (opts.items.filter != '*')
          {
            var nI = gn_getVisibleItemsPrevFilter(a_itm, opts, itms.first) - itms.first;
          }
          else
          {
            var nI = opts.items.visible - itms.first;
          }
          debug(conf, 'Preventing non-circular: sliding '+nI+' items backward.');
          $cfs.trigger(cf_e('prev', conf), nI);
        }

        opts.items.visible = cf_getItemsAdjust(vI, opts, opts.items.visibleConf.adjust, $tt0);
        opts.items.visibleConf.old = opts.items.visible;
        opts = in_getAlignPadding(opts, a_itm);

        var sz = sz_setSizes($cfs, opts);
        $cfs.trigger(cf_e('updatePageStatus', conf), [true, sz]);
        nv_showNavi(opts, itms.total, conf);
        nv_enableNavi(opts, itms.first, conf);

        return sz;
      });


      //  destroy event
      $cfs.bind(cf_e('destroy', conf), function(e, orgOrder) {
        e.stopPropagation();
        tmrs = sc_clearTimers(tmrs);

        $cfs.data('_cfs_isCarousel', false);
        $cfs.trigger(cf_e('finish', conf));
        if (orgOrder)
        {
          $cfs.trigger(cf_e('jumpToStart', conf));
        }
        sz_resetMargin($cfs.children(), opts);
        if (opts.responsive)
        {
          $cfs.children().each(function() {
            $(this).css($(this).data('_cfs_origCssSizes'));
          });
        }

        $cfs.css($cfs.data('_cfs_origCss'));
        $cfs._cfs_unbind_events();
        $cfs._cfs_unbind_buttons();
        $wrp.replaceWith($cfs);

        return true;
      });


      //  debug event
      $cfs.bind(cf_e('debug', conf), function(e) {
        debug(conf, 'Carousel width: '+opts.width);
        debug(conf, 'Carousel height: '+opts.height);
        debug(conf, 'Item widths: '+opts.items.width);
        debug(conf, 'Item heights: '+opts.items.height);
        debug(conf, 'Number of items visible: '+opts.items.visible);
        if (opts.auto.play)
        {
          debug(conf, 'Number of items scrolled automatically: '+opts.auto.items);
        }
        if (opts.prev.button)
        {
          debug(conf, 'Number of items scrolled backward: '+opts.prev.items);
        }
        if (opts.next.button)
        {
          debug(conf, 'Number of items scrolled forward: '+opts.next.items);
        }
        return conf.debug;
      });


      //  triggerEvent, making prefixed and namespaced events accessible from outside
      $cfs.bind('_cfs_triggerEvent', function(e, n, o) {
        e.stopPropagation();
        return $cfs.triggerHandler(cf_e(n, conf), o);
      });
    };  //  /bind_events


    $cfs._cfs_unbind_events = function() {
      $cfs.unbind(cf_e('', conf));
      $cfs.unbind(cf_e('', conf, false));
      $cfs.unbind('_cfs_triggerEvent');
    };  //  /unbind_events


    $cfs._cfs_bind_buttons = function() {
      $cfs._cfs_unbind_buttons();
      nv_showNavi(opts, itms.total, conf);
      nv_enableNavi(opts, itms.first, conf);

      if (opts.auto.pauseOnHover)
      {
        var pC = bt_pauseOnHoverConfig(opts.auto.pauseOnHover);
        $wrp.bind(cf_e('mouseenter', conf, false), function() { $cfs.trigger(cf_e('pause', conf), pC);  })
          .bind(cf_e('mouseleave', conf, false), function() { $cfs.trigger(cf_e('resume', conf));   });
      }

      //  play button
      if (opts.auto.button)
      {
        opts.auto.button.bind(cf_e(opts.auto.event, conf, false), function(e) {
          e.preventDefault();
          var ev = false,
            pC = null;

          if (crsl.isPaused)
          {
            ev = 'play';
          }
          else if (opts.auto.pauseOnEvent)
          {
            ev = 'pause';
            pC = bt_pauseOnHoverConfig(opts.auto.pauseOnEvent);
          }
          if (ev)
          {
            $cfs.trigger(cf_e(ev, conf), pC);
          }
        });
      }

      //  prev button
      if (opts.prev.button)
      {
        opts.prev.button.bind(cf_e(opts.prev.event, conf, false), function(e) {
          e.preventDefault();
          $cfs.trigger(cf_e('prev', conf));
        });
        if (opts.prev.pauseOnHover)
        {
          var pC = bt_pauseOnHoverConfig(opts.prev.pauseOnHover);
          opts.prev.button.bind(cf_e('mouseenter', conf, false), function() { $cfs.trigger(cf_e('pause', conf), pC);  })
                  .bind(cf_e('mouseleave', conf, false), function() { $cfs.trigger(cf_e('resume', conf));   });
        }
      }

      //  next butotn
      if (opts.next.button)
      {
        opts.next.button.bind(cf_e(opts.next.event, conf, false), function(e) {
          e.preventDefault();
          $cfs.trigger(cf_e('next', conf));
        });
        if (opts.next.pauseOnHover)
        {
          var pC = bt_pauseOnHoverConfig(opts.next.pauseOnHover);
          opts.next.button.bind(cf_e('mouseenter', conf, false), function() { $cfs.trigger(cf_e('pause', conf), pC);  })
                  .bind(cf_e('mouseleave', conf, false), function() { $cfs.trigger(cf_e('resume', conf));   });
        }
      }

      //  pagination
      if (opts.pagination.container)
      {
        if (opts.pagination.pauseOnHover)
        {
          var pC = bt_pauseOnHoverConfig(opts.pagination.pauseOnHover);
          opts.pagination.container.bind(cf_e('mouseenter', conf, false), function() { $cfs.trigger(cf_e('pause', conf), pC); })
                       .bind(cf_e('mouseleave', conf, false), function() { $cfs.trigger(cf_e('resume', conf));  });
        }
      }

      //  prev/next keys
      if (opts.prev.key || opts.next.key)
      {
        $(document).bind(cf_e('keyup', conf, false, true, true), function(e) {
          var k = e.keyCode;
          if (k == opts.next.key)
          {
            e.preventDefault();
            $cfs.trigger(cf_e('next', conf));
          }
          if (k == opts.prev.key)
          {
            e.preventDefault();
            $cfs.trigger(cf_e('prev', conf));
          }
        });
      }

      //  pagination keys
      if (opts.pagination.keys)
      {
        $(document).bind(cf_e('keyup', conf, false, true, true), function(e) {
          var k = e.keyCode;
          if (k >= 49 && k < 58)
          {
            k = (k-49) * opts.items.visible;
            if (k <= itms.total)
            {
              e.preventDefault();
              $cfs.trigger(cf_e('slideTo', conf), [k, 0, true, opts.pagination]);
            }
          }
        });
      }


      //  DEPRECATED
      if (opts.prev.wipe || opts.next.wipe)
      {
        deprecated( 'the touchwipe-plugin', 'the touchSwipe-plugin' );
        if ($.fn.touchwipe)
        {
          var wP = (opts.prev.wipe) ? function() { $cfs.trigger(cf_e('prev', conf)) } : null,
            wN = (opts.next.wipe) ? function() { $cfs.trigger(cf_e('next', conf)) } : null;

          if (wN || wN)
          {
            if (!crsl.touchwipe)
            {
              crsl.touchwipe = true;
              var twOps = {
                'min_move_x': 30,
                'min_move_y': 30,
                'preventDefaultEvents': true
              };
              switch (opts.direction)
              {
                case 'up':
                case 'down':
                  twOps.wipeUp = wP;
                  twOps.wipeDown = wN;
                  break;
                default:
                  twOps.wipeLeft = wN;
                  twOps.wipeRight = wP;
              }
              $wrp.touchwipe(twOps);
            }
          }
        }
      }
      //  /DEPRECATED


      //  swipe
      if ($.fn.swipe)
      {
        var isTouch = 'ontouchstart' in window;
        if ((isTouch && opts.swipe.onTouch) || (!isTouch && opts.swipe.onMouse))
        {
          var scP = $.extend(true, {}, opts.prev, opts.swipe),
            scN = $.extend(true, {}, opts.next, opts.swipe),
            swP = function() { $cfs.trigger(cf_e('prev', conf), [scP]) },
            swN = function() { $cfs.trigger(cf_e('next', conf), [scN]) };

          switch (opts.direction)
          {
            case 'up':
            case 'down':
              opts.swipe.options.swipeUp = swN;
              opts.swipe.options.swipeDown = swP;
              break;
            default:
              opts.swipe.options.swipeLeft = swN;
              opts.swipe.options.swipeRight = swP;
          }
          if (crsl.swipe)
          {
            $cfs.swipe('destroy');
          }
          $wrp.swipe(opts.swipe.options);
          $wrp.css('cursor', 'move');
          crsl.swipe = true;
        }
      }

      //  mousewheel
      if ($.fn.mousewheel)
      {


        //  DEPRECATED
        if (opts.prev.mousewheel)
        {
          deprecated('The prev.mousewheel option', 'the mousewheel configuration object');
          opts.prev.mousewheel = null;
          opts.mousewheel = {
            items: bt_mousesheelNumber(opts.prev.mousewheel)
          };
        }
        if (opts.next.mousewheel)
        {
          deprecated('The next.mousewheel option', 'the mousewheel configuration object');
          opts.next.mousewheel = null;
          opts.mousewheel = {
            items: bt_mousesheelNumber(opts.next.mousewheel)
          };
        }
        //  /DEPRECATED


        if (opts.mousewheel)
        {
          var mcP = $.extend(true, {}, opts.prev, opts.mousewheel),
            mcN = $.extend(true, {}, opts.next, opts.mousewheel);

          if (crsl.mousewheel)
          {
            $wrp.unbind(cf_e('mousewheel', conf, false));
          }
          $wrp.bind(cf_e('mousewheel', conf, false), function(e, delta) { 
            e.preventDefault();
            if (delta > 0)
            {
              $cfs.trigger(cf_e('prev', conf), [mcP]);
            }
            else
            {
              $cfs.trigger(cf_e('next', conf), [mcN]);
            }
          });
          crsl.mousewheel = true;
        }
      }

      if (opts.auto.play)
      {
        $cfs.trigger(cf_e('play', conf), opts.auto.delay);
      }

      if (crsl.upDateOnWindowResize)
      {
        var resizeFn = function(e) {
          $cfs.trigger(cf_e('finish', conf));
          if (opts.auto.pauseOnResize && !crsl.isPaused)
          {
            $cfs.trigger(cf_e('play', conf));
          }
          sz_resetMargin($cfs.children(), opts);
          $cfs.trigger(cf_e('updateSizes', conf));
        };

        var $w = $(window),
          onResize = null;

        if ($.debounce && conf.onWindowResize == 'debounce')
        {
          onResize = $.debounce(200, resizeFn);
        }
        else if ($.throttle && conf.onWindowResize == 'throttle')
        {
          onResize = $.throttle(300, resizeFn);
        }
        else
        {
          var _windowWidth = 0,
            _windowHeight = 0;

          onResize = function() {
            var nw = $w.width(),
              nh = $w.height();

            if (nw != _windowWidth || nh != _windowHeight)
            {
              resizeFn();
              _windowWidth = nw;
              _windowHeight = nh;
            }
          };
        }
        $w.bind(cf_e('resize', conf, false, true, true), onResize);
      }
    };  //  /bind_buttons


    $cfs._cfs_unbind_buttons = function() {
      var ns1 = cf_e('', conf),
        ns2 = cf_e('', conf, false);
        ns3 = cf_e('', conf, false, true, true);

      $(document).unbind(ns3);
      $(window).unbind(ns3);
      $wrp.unbind(ns2);

      if (opts.auto.button)
      {
        opts.auto.button.unbind(ns2);
      }
      if (opts.prev.button)
      {
        opts.prev.button.unbind(ns2);
      }
      if (opts.next.button)
      {
        opts.next.button.unbind(ns2);
      }
      if (opts.pagination.container)
      {
        opts.pagination.container.unbind(ns2);
        if (opts.pagination.anchorBuilder)
        {
          opts.pagination.container.children().remove();
        }
      }
      if (crsl.swipe)
      {
        $cfs.swipe('destroy');
        $wrp.css('cursor', 'default');
        crsl.swipe = false;
      }
      if (crsl.mousewheel)
      {
        crsl.mousewheel = false;
      }

      nv_showNavi(opts, 'hide', conf);
      nv_enableNavi(opts, 'removeClass', conf);

    };  //  /unbind_buttons



    //  START

    if (is_boolean(configs))
    {
      configs = {
        'debug': configs
      };
    }

    //  set vars
    var crsl = {
        'direction'   : 'next',
        'isPaused'    : true,
        'isScrolling' : false,
        'isStopped'   : false,
        'mousewheel'  : false,
        'swipe'     : false
      },
      itms = {
        'total'     : $cfs.children().length,
        'first'     : 0
      },
      tmrs = {
        'auto'      : null,
        'progress'    : null,
        'startTime'   : getTime(),
        'timePassed'  : 0
      },
      scrl = {
        'isStopped'   : false,
        'duration'    : 0,
        'startTime'   : 0,
        'easing'    : '',
        'anims'     : []
      },
      clbk = {
        'onBefore'    : [],
        'onAfter'   : []
      },
      queu = [],
      conf = $.extend(true, {}, $.fn.carouFredSel.configs, configs),
      opts = {},
      opts_orig = $.extend(true, {}, options), 
      $wrp = $cfs.wrap('<'+conf.wrapper.element+' class="'+conf.wrapper.classname+'" />').parent();


    conf.selector   = $cfs.selector;
    conf.serialNumber = $.fn.carouFredSel.serialNumber++;


    //  create carousel
    $cfs._cfs_init(opts_orig, true, starting_position);
    $cfs._cfs_build();
    $cfs._cfs_bind_events();
    $cfs._cfs_bind_buttons();

    //  find item to start
    if (is_array(opts.items.start))
    {
      var start_arr = opts.items.start;
    }
    else
    {
      var start_arr = [];
      if (opts.items.start != 0)
      {
        start_arr.push(opts.items.start);
      }
    }
    if (opts.cookie)
    {
      start_arr.unshift(parseInt(cf_getCookie(opts.cookie), 10));
    }

    if (start_arr.length > 0)
    {
      for (var a = 0, l = start_arr.length; a < l; a++)
      {
        var s = start_arr[a];
        if (s == 0)
        {
          continue;
        }
        if (s === true)
        {
          s = window.location.hash;
          if (s.length < 1)
          {
            continue;
          }
        }
        else if (s === 'random')
        {
          s = Math.floor(Math.random()*itms.total);
        }
        if ($cfs.triggerHandler(cf_e('slideTo', conf), [s, 0, true, { fx: 'none' }]))
        {
          break;
        }
      }
    }
    var siz = sz_setSizes($cfs, opts),
      itm = gi_getCurrentItems($cfs.children(), opts);

    if (opts.onCreate)
    {
      opts.onCreate.call($tt0, {
        'width': siz.width,
        'height': siz.height,
        'items': itm
      });
    }

    $cfs.trigger(cf_e('updatePageStatus', conf), [true, siz]);
    $cfs.trigger(cf_e('linkAnchors', conf));

    if (conf.debug)
    {
      $cfs.trigger(cf_e('debug', conf));
    }

    return $cfs;
  };



  //  GLOBAL PUBLIC

  $.fn.carouFredSel.serialNumber = 1;
  $.fn.carouFredSel.defaults = {
    'synchronise' : false,
    'infinite'    : true,
    'circular'    : true,
    'responsive'  : false,
    'direction'   : 'left',
    'items'     : {
      'start'     : 0
    },
    'scroll'    : {
      'easing'    : 'swing',
      'duration'    : 500,
      'pauseOnHover'  : false,
      'event'     : 'click',
      'queue'     : false
    }
  };
  $.fn.carouFredSel.configs = {
    'debug'     : false,
    'onWindowResize': 'throttle',
    'events'    : {
      'prefix'    : '',
      'namespace'   : 'cfs'
    },
    'wrapper'   : {
      'element'   : 'div',
      'classname'   : 'caroufredsel_wrapper'
    },
    'classnames'  : {}
  };
  $.fn.carouFredSel.pageAnchorBuilder = function(nr) {
    return '<a href="#"><span>'+nr+'</span></a>';
  };
  $.fn.carouFredSel.progressbarUpdater = function(perc) {
    $(this).css('width', perc+'%');
  };

  $.fn.carouFredSel.cookie = {
    get: function(n) {
      n += '=';
      var ca = document.cookie.split(';');
      for (var a = 0, l = ca.length; a < l; a++)
      {
        var c = ca[a];
        while (c.charAt(0) == ' ')
        {
          c = c.slice(1);
        }
        if (c.indexOf(n) == 0)
        {
          return c.slice(n.length);
        }
      }
      return 0;
    },
    set: function(n, v, d) {
      var e = "";
      if (d)
      {
        var date = new Date();
        date.setTime(date.getTime() + (d * 24 * 60 * 60 * 1000));
        e = "; expires=" + date.toGMTString();
      }
      document.cookie = n + '=' + v + e + '; path=/';
    },
    remove: function(n) {
      $.fn.carouFredSel.cookie.set(n, "", -1);
    }
  };


  //  GLOBAL PRIVATE

  //  scrolling functions
  function sc_setScroll(d, e) {
    return {
      anims: [],
      duration: d,
      orgDuration: d,
      easing: e,
      startTime: getTime()
    };
  }
  function sc_startScroll(s) {

    if (is_object(s.pre))
    {
      sc_startScroll(s.pre);
    }
    for (var a = 0, l = s.anims.length; a < l; a++)
    {
      var b = s.anims[a];
      if (!b)
      {
        continue;
      }
      if (b[3])
      {
        b[0].stop();
      }
      b[0].animate(b[1], {
        complete: b[2],
        duration: s.duration,
        easing: s.easing
      });
    }
    if (is_object(s.post))
    {
      sc_startScroll(s.post);
    }
  }
  function sc_stopScroll(s, finish) {
    if (!is_boolean(finish))
    {
      finish = true;
    }
    if (is_object(s.pre))
    {
      sc_stopScroll(s.pre, finish);
    }
    for (var a = 0, l = s.anims.length; a < l; a++)
    {
      var b = s.anims[a];
      b[0].stop(true);
      if (finish)
      {
        b[0].css(b[1]);
        if (is_function(b[2]))
        {
          b[2]();
        }
      }
    }
    if (is_object(s.post))
    {
      sc_stopScroll(s.post, finish);
    }
  }
  function sc_afterScroll( $c, $c2, o ) {
    if ($c2)
    {
      $c2.remove();
    }

    switch(o.fx) {
      case 'fade':
      case 'crossfade':
      case 'cover-fade':
      case 'uncover-fade':
        $c.css('filter', '');
        break;
    }
  }
  function sc_fireCallbacks($t, o, b, a, c) {
    if (o[b])
    {
      o[b].call($t, a);
    }
    if (c[b].length)
    {
      for (var i = 0, l = c[b].length; i < l; i++)
      {
        c[b][i].call($t, a);
      }
    }
    return [];
  }
  function sc_fireQueue($c, q, c) {

    if (q.length)
    {
      $c.trigger(cf_e(q[0][0], c), q[0][1]);
      q.shift();
    }
    return q;
  }
  function sc_hideHiddenItems(hiddenitems) {
    hiddenitems.each(function() {
      var hi = $(this);
      hi.data('_cfs_isHidden', hi.is(':hidden')).hide();
    });
  }
  function sc_showHiddenItems(hiddenitems) {
    if (hiddenitems)
    {
      hiddenitems.each(function() {
        var hi = $(this);
        if (!hi.data('_cfs_isHidden'))
        {
          hi.show();
        }
      });
    }
  }
  function sc_clearTimers(t) {
    if (t.auto)
    {
      clearTimeout(t.auto);
    }
    if (t.progress)
    {
      clearInterval(t.progress);
    }
    return t;
  }
  function sc_mapCallbackArguments(i_old, i_skp, i_new, s_itm, s_dir, s_dur, w_siz) {
    return {
      'width': w_siz.width,
      'height': w_siz.height,
      'items': {
        'old': i_old,
        'skipped': i_skp,
        'visible': i_new,

        //  DEPRECATED
        'new': i_new
        //  /DEPRECATED
      },
      'scroll': {
        'items': s_itm,
        'direction': s_dir,
        'duration': s_dur
      }
    };
  }
  function sc_getDuration( sO, o, nI, siz ) {
    var dur = sO.duration;
    if (sO.fx == 'none')
    {
      return 0;
    }
    if (dur == 'auto')
    {
      dur = o.scroll.duration / o.scroll.items * nI;
    }
    else if (dur < 10)
    {
      dur = siz / dur;
    }
    if (dur < 1)
    {
      return 0;
    }
    if (sO.fx == 'fade')
    {
      dur = dur / 2;
    }
    return Math.round(dur);
  }

  //  navigation functions
  function nv_showNavi(o, t, c) {
    var minimum = (is_number(o.items.minimum)) ? o.items.minimum : o.items.visible + 1;
    if (t == 'show' || t == 'hide')
    {
      var f = t;
    }
    else if (minimum > t)
    {
      debug(c, 'Not enough items ('+t+' total, '+minimum+' needed): Hiding navigation.');
      var f = 'hide';
    }
    else
    {
      var f = 'show';
    }
    var s = (f == 'show') ? 'removeClass' : 'addClass',
      h = cf_c('hidden', c);

    if (o.auto.button)
    {
      o.auto.button[f]()[s](h);
    }
    if (o.prev.button)
    {
      o.prev.button[f]()[s](h);
    }
    if (o.next.button)
    {
      o.next.button[f]()[s](h);
    }
    if (o.pagination.container)
    {
      o.pagination.container[f]()[s](h);
    }
  }
  function nv_enableNavi(o, f, c) {
    if (o.circular || o.infinite) return;
    var fx = (f == 'removeClass' || f == 'addClass') ? f : false,
      di = cf_c('disabled', c);

    if (o.auto.button && fx)
    {
      o.auto.button[fx](di);
    }
    if (o.prev.button)
    {
      var fn = fx || (f == 0) ? 'addClass' : 'removeClass';
      o.prev.button[fn](di);
    }
    if (o.next.button)
    {
      var fn = fx || (f == o.items.visible) ? 'addClass' : 'removeClass';
      o.next.button[fn](di);
    }
  }

  //  get object functions
  function go_getObject($tt, obj) {
    if (is_function(obj))
    {
      obj = obj.call($tt);
    }
    else if (is_undefined(obj))
    {
      obj = {};
    }
    return obj;
  }
  function go_getItemsObject($tt, obj) {
    obj = go_getObject($tt, obj);
    if (is_number(obj))
    {
      obj = {
        'visible': obj
      };
    }
    else if (obj == 'variable')
    {
      obj = {
        'visible': obj,
        'width': obj, 
        'height': obj
      };
    }
    else if (!is_object(obj))
    {
      obj = {};
    }
    return obj;
  }
  function go_getScrollObject($tt, obj) {
    obj = go_getObject($tt, obj);
    if (is_number(obj))
    {
      if (obj <= 50)
      {
        obj = {
          'items': obj
        };
      }
      else
      {
        obj = {
          'duration': obj
        };
      }
    }
    else if (is_string(obj))
    {
      obj = {
        'easing': obj
      };
    }
    else if (!is_object(obj))
    {
      obj = {};
    }
    return obj;
  }
  function go_getNaviObject($tt, obj) {
    obj = go_getObject($tt, obj);
    if (is_string(obj))
    {
      var temp = cf_getKeyCode(obj);
      if (temp == -1)
      {
        obj = $(obj);
      }
      else
      {
        obj = temp;
      }
    }
    return obj;
  }

  function go_getAutoObject($tt, obj) {
    obj = go_getNaviObject($tt, obj);
    if (is_jquery(obj))
    {
      obj = {
        'button': obj
      };
    }
    else if (is_boolean(obj))
    {
      obj = {
        'play': obj
      };
    }
    else if (is_number(obj))
    {
      obj = {
        'timeoutDuration': obj
      };
    }
    if (obj.progress)
    {
      if (is_string(obj.progress) || is_jquery(obj.progress))
      {
        obj.progress = {
          'bar': obj.progress
        };
      }
    }
    return obj;
  }
  function go_complementAutoObject($tt, obj) {
    if (is_function(obj.button))
    {
      obj.button = obj.button.call($tt);
    }
    if (is_string(obj.button))
    {
      obj.button = $(obj.button);
    }
    if (!is_boolean(obj.play))
    {
      obj.play = true;
    }
    if (!is_number(obj.delay))
    {
      obj.delay = 0;
    }
    if (is_undefined(obj.pauseOnEvent))
    {
      obj.pauseOnEvent = true;
    }
    if (!is_boolean(obj.pauseOnResize))
    {
      obj.pauseOnResize = true;
    }
    if (!is_number(obj.timeoutDuration))
    {
      obj.timeoutDuration = (obj.duration < 10)
        ? 2500
        : obj.duration * 5;
    }
    if (obj.progress)
    {
      if (is_function(obj.progress.bar))
      {
        obj.progress.bar = obj.progress.bar.call($tt);
      }
      if (is_string(obj.progress.bar))
      {
        obj.progress.bar = $(obj.progress.bar);
      }
      if (obj.progress.bar)
      {
        if (!is_function(obj.progress.updater))
        {
          obj.progress.updater = $.fn.carouFredSel.progressbarUpdater;
        }
        if (!is_number(obj.progress.interval))
        {
          obj.progress.interval = 50;
        }
      }
      else
      {
        obj.progress = false;
      }
    }
    return obj;
  }

  function go_getPrevNextObject($tt, obj) {
    obj = go_getNaviObject($tt, obj);
    if (is_jquery(obj))
    {
      obj = {
        'button': obj
      };
    }
    else if (is_number(obj))
    {
      obj = {
        'key': obj
      };
    }
    return obj;
  }
  function go_complementPrevNextObject($tt, obj) {
    if (is_function(obj.button))
    {
      obj.button = obj.button.call($tt);
    }
    if (is_string(obj.button))
    {
      obj.button = $(obj.button);
    }
    if (is_string(obj.key))
    {
      obj.key = cf_getKeyCode(obj.key);
    }
    return obj;
  }

  function go_getPaginationObject($tt, obj) {
    obj = go_getNaviObject($tt, obj);
    if (is_jquery(obj))
    {
      obj = {
        'container': obj
      };
    }
    else if (is_boolean(obj))
    {
      obj = {
        'keys': obj
      };
    }
    return obj;
  }
  function go_complementPaginationObject($tt, obj) {
    if (is_function(obj.container))
    {
      obj.container = obj.container.call($tt);
    }
    if (is_string(obj.container))
    {
      obj.container = $(obj.container);
    }
    if (!is_number(obj.items))
    {
      obj.items = false;
    }
    if (!is_boolean(obj.keys))
    {
      obj.keys = false;
    }
    if (!is_function(obj.anchorBuilder) && !is_false(obj.anchorBuilder))
    {
      obj.anchorBuilder = $.fn.carouFredSel.pageAnchorBuilder;
    }
    if (!is_number(obj.deviation))
    {
      obj.deviation = 0;
    }
    return obj;
  }

  function go_getSwipeObject($tt, obj) {
    if (is_function(obj))
    {
      obj = obj.call($tt);
    }
    if (is_undefined(obj))
    {
      obj = {
        'onTouch': false
      };
    }
    if (is_true(obj))
    {
      obj = {
        'onTouch': obj
      };
    }
    else if (is_number(obj))
    {
      obj = {
        'items': obj
      };
    }
    return obj;
  }
  function go_complementSwipeObject($tt, obj) {
    if (!is_boolean(obj.onTouch))
    {
      obj.onTouch = true;
    }
    if (!is_boolean(obj.onMouse))
    {
      obj.onMouse = false;
    }
    if (!is_object(obj.options))
    {
      obj.options = {};
    }
    if (!is_boolean(obj.options.triggerOnTouchEnd))
    {
      obj.options.triggerOnTouchEnd = false;
    }
    return obj;
  }
  function go_getMousewheelObject($tt, obj) {
    if (is_function(obj))
    {
      obj = obj.call($tt);
    }
    if (is_true(obj))
    {
      obj = {};
    }
    else if (is_number(obj))
    {
      obj = {
        'items': obj
      };
    }
    else if (is_undefined(obj))
    {
      obj = false;
    }
    return obj;
  }
  function go_complementMousewheelObject($tt, obj) {
    return obj;
  }

  //  get number functions
  function gn_getItemIndex(num, dev, org, items, $cfs) {
    if (is_string(num))
    {
      num = $(num, $cfs);
    }

    if (is_object(num))
    {
      num = $(num, $cfs);
    }
    if (is_jquery(num))
    {
      num = $cfs.children().index(num);
      if (!is_boolean(org))
      {
        org = false;
      }
    }
    else
    {
      if (!is_boolean(org))
      {
        org = true;
      }
    }
    if (!is_number(num))
    {
      num = 0;
    }
    if (!is_number(dev))
    {
      dev = 0;
    }

    if (org)
    {
      num += items.first;
    }
    num += dev;
    if (items.total > 0)
    {
      while (num >= items.total)
      {
        num -= items.total;
      }
      while (num < 0)
      {
        num += items.total;
      }
    }
    return num;
  }

  //  items prev
  function gn_getVisibleItemsPrev(i, o, s) {
    var t = 0,
      x = 0;

    for (var a = s; a >= 0; a--)
    {
      var j = i.eq(a);
      t += (j.is(':visible')) ? j[o.d['outerWidth']](true) : 0;
      if (t > o.maxDimension)
      {
        return x;
      }
      if (a == 0)
      {
        a = i.length;
      }
      x++;
    }
  }
  function gn_getVisibleItemsPrevFilter(i, o, s) {
    return gn_getItemsPrevFilter(i, o.items.filter, o.items.visibleConf.org, s);
  }
  function gn_getScrollItemsPrevFilter(i, o, s, m) {
    return gn_getItemsPrevFilter(i, o.items.filter, m, s);
  }
  function gn_getItemsPrevFilter(i, f, m, s) {
    var t = 0,
      x = 0;

    for (var a = s, l = i.length; a >= 0; a--)
    {
      x++;
      if (x == l)
      {
        return x;
      }

      var j = i.eq(a);
      if (j.is(f))
      {
        t++;
        if (t == m)
        {
          return x;
        }
      }
      if (a == 0)
      {
        a = l;
      }
    }
  }

  function gn_getVisibleOrg($c, o) {
    return o.items.visibleConf.org || $c.children().slice(0, o.items.visible).filter(o.items.filter).length;
  }

  //  items next
  function gn_getVisibleItemsNext(i, o, s) {
    var t = 0,
      x = 0;

    for (var a = s, l = i.length-1; a <= l; a++)
    {
      var j = i.eq(a);

      t += (j.is(':visible')) ? j[o.d['outerWidth']](true) : 0;
      if (t > o.maxDimension)
      {
        return x;
      }

      x++;
      if (x == l+1)
      {
        return x;
      }
      if (a == l)
      {
        a = -1;
      }
    }
  }
  function gn_getVisibleItemsNextTestCircular(i, o, s, l) {
    var v = gn_getVisibleItemsNext(i, o, s);
    if (!o.circular)
    {
      if (s + v > l)
      {
        v = l - s;
      }
    }
    return v;
  }
  function gn_getVisibleItemsNextFilter(i, o, s) {
    return gn_getItemsNextFilter(i, o.items.filter, o.items.visibleConf.org, s, o.circular);
  }
  function gn_getScrollItemsNextFilter(i, o, s, m) {
    return gn_getItemsNextFilter(i, o.items.filter, m+1, s, o.circular) - 1;
  }
  function gn_getItemsNextFilter(i, f, m, s, c) {
    var t = 0,
      x = 0;

    for (var a = s, l = i.length-1; a <= l; a++)
    {
      x++;
      if (x >= l)
      {
        return x;
      }

      var j = i.eq(a);
      if (j.is(f))
      {
        t++;
        if (t == m)
        {
          return x;
        }
      }
      if (a == l)
      {
        a = -1;
      }
    }
  }

  //  get items functions
  function gi_getCurrentItems(i, o) {
    return i.slice(0, o.items.visible);
  }
  function gi_getOldItemsPrev(i, o, n) {
    return i.slice(n, o.items.visibleConf.old+n);
  }
  function gi_getNewItemsPrev(i, o) {
    return i.slice(0, o.items.visible);
  }
  function gi_getOldItemsNext(i, o) {
    return i.slice(0, o.items.visibleConf.old);
  }
  function gi_getNewItemsNext(i, o, n) {
    return i.slice(n, o.items.visible+n);
  }

  //  sizes functions
  function sz_storeMargin(i, o, d) {
    if (o.usePadding)
    {
      if (!is_string(d))
      {
        d = '_cfs_origCssMargin';
      }
      i.each(function() {
        var j = $(this),
          m = parseInt(j.css(o.d['marginRight']), 10);
        if (!is_number(m)) 
        {
          m = 0;
        }
        j.data(d, m);
      });
    }
  }
  function sz_resetMargin(i, o, m) {
    if (o.usePadding)
    {
      var x = (is_boolean(m)) ? m : false;
      if (!is_number(m))
      {
        m = 0;
      }
      sz_storeMargin(i, o, '_cfs_tempCssMargin');
      i.each(function() {
        var j = $(this);
        j.css(o.d['marginRight'], ((x) ? j.data('_cfs_tempCssMargin') : m + j.data('_cfs_origCssMargin')));
      });
    }
  }
  function sz_storeSizes(i, o) {
    if (o.responsive)
    {
      i.each(function() {
        var j = $(this),
          s = in_mapCss(j, ['width', 'height']);
        j.data('_cfs_origCssSizes', s);
      });
    }
  }
  function sz_setResponsiveSizes(o, all) {
    var visb = o.items.visible,
      newS = o.items[o.d['width']],
      seco = o[o.d['height']],
      secp = is_percentage(seco);

    all.each(function() {
      var $t = $(this),
        nw = newS - ms_getPaddingBorderMargin($t, o, 'Width');

      $t[o.d['width']](nw);
      if (secp)
      {
        $t[o.d['height']](ms_getPercentage(nw, seco));
      }
    });
  }
  function sz_setSizes($c, o) {
    var $w = $c.parent(),
      $i = $c.children(),
      $v = gi_getCurrentItems($i, o),
      sz = cf_mapWrapperSizes(ms_getSizes($v, o, true), o, false);

    $w.css(sz);

    if (o.usePadding)
    {
      var p = o.padding,
        r = p[o.d[1]];

      if (o.align && r < 0)
      {
        r = 0;
      }
      var $l = $v.last();
      $l.css(o.d['marginRight'], $l.data('_cfs_origCssMargin') + r);
      $c.css(o.d['top'], p[o.d[0]]);
      $c.css(o.d['left'], p[o.d[3]]);
    }

    $c.css(o.d['width'], sz[o.d['width']]+(ms_getTotalSize($i, o, 'width')*2));
    $c.css(o.d['height'], ms_getLargestSize($i, o, 'height'));
    return sz;
  }

  //  measuring functions
  function ms_getSizes(i, o, wrapper) {
    return [ms_getTotalSize(i, o, 'width', wrapper), ms_getLargestSize(i, o, 'height', wrapper)];
  }
  function ms_getLargestSize(i, o, dim, wrapper) {
    if (!is_boolean(wrapper))
    {
      wrapper = false;
    }
    if (is_number(o[o.d[dim]]) && wrapper)
    {
      return o[o.d[dim]];
    }
    if (is_number(o.items[o.d[dim]]))
    {
      return o.items[o.d[dim]];
    }
    dim = (dim.toLowerCase().indexOf('width') > -1) ? 'outerWidth' : 'outerHeight';
    return ms_getTrueLargestSize(i, o, dim);
  }
  function ms_getTrueLargestSize(i, o, dim) {
    var s = 0;

    for (var a = 0, l = i.length; a < l; a++)
    {
      var j = i.eq(a);

      var m = (j.is(':visible')) ? j[o.d[dim]](true) : 0;
      if (s < m)
      {
        s = m;
      }
    }
    return s;
  }

  function ms_getTotalSize(i, o, dim, wrapper) {
    if (!is_boolean(wrapper))
    {
      wrapper = false;
    }
    if (is_number(o[o.d[dim]]) && wrapper)
    {
      return o[o.d[dim]];
    }
    if (is_number(o.items[o.d[dim]]))
    {
      return o.items[o.d[dim]] * i.length;
    }

    var d = (dim.toLowerCase().indexOf('width') > -1) ? 'outerWidth' : 'outerHeight',
      s = 0;

    for (var a = 0, l = i.length; a < l; a++)
    {
      var j = i.eq(a);
      s += (j.is(':visible')) ? j[o.d[d]](true) : 0;
    }
    return s;
  }
  function ms_getParentSize($w, o, d) {
    var isVisible = $w.is(':visible');
    if (isVisible)
    {
      $w.hide();
    }
    var s = $w.parent()[o.d[d]]();
    if (isVisible)
    {
      $w.show();
    }
    return s;
  }
  function ms_getMaxDimension(o, a) {
    return (is_number(o[o.d['width']])) ? o[o.d['width']] : a;
  }
  function ms_hasVariableSizes(i, o, dim) {
    var s = false,
      v = false;

    for (var a = 0, l = i.length; a < l; a++)
    {
      var j = i.eq(a);

      var c = (j.is(':visible')) ? j[o.d[dim]](true) : 0;
      if (s === false)
      {
        s = c;
      }
      else if (s != c)
      {
        v = true;
      }
      if (s == 0)
      {
        v = true;
      }
    }
    return v;
  }
  function ms_getPaddingBorderMargin(i, o, d) {
    return i[o.d['outer'+d]](true) - i[o.d[d.toLowerCase()]]();
  }
  function ms_getPercentage(s, o) {
    if (is_percentage(o))
    {
      o = parseInt( o.slice(0, -1), 10 );
      if (!is_number(o))
      {
        return s;
      }
      s *= o/100;
    }
    return s;
  }

  //  config functions
  function cf_e(n, c, pf, ns, rd) {
    if (!is_boolean(pf))
    {
      pf = true;
    }
    if (!is_boolean(ns))
    {
      ns = true;
    }
    if (!is_boolean(rd))
    {
      rd = false;
    }

    if (pf)
    {
      n = c.events.prefix + n;
    }
    if (ns)
    {
      n = n +'.'+ c.events.namespace;
    }
    if (ns && rd)
    {
      n += c.serialNumber;
    }

    return n;
  }
  function cf_c(n, c) {
    return (is_string(c.classnames[n])) ? c.classnames[n] : n;
  }
  function cf_mapWrapperSizes(ws, o, p) {
    if (!is_boolean(p))
    {
      p = true;
    }
    var pad = (o.usePadding && p) ? o.padding : [0, 0, 0, 0];
    var wra = {};

    wra[o.d['width']] = ws[0] + pad[1] + pad[3];
    wra[o.d['height']] = ws[1] + pad[0] + pad[2];

    return wra;
  }
  function cf_sortParams(vals, typs) {
    var arr = [];
    for (var a = 0, l1 = vals.length; a < l1; a++)
    {
      for (var b = 0, l2 = typs.length; b < l2; b++)
      {
        if (typs[b].indexOf(typeof vals[a]) > -1 && is_undefined(arr[b]))
        {
          arr[b] = vals[a];
          break;
        }
      }
    }
    return arr;
  }
  function cf_getPadding(p) {
    if (is_undefined(p))
    {
      return [0, 0, 0, 0];
    }
    if (is_number(p))
    {
      return [p, p, p, p];
    }
    if (is_string(p))
    {
      p = p.split('px').join('').split('em').join('').split(' ');
    }

    if (!is_array(p))
    {
      return [0, 0, 0, 0];
    }
    for (var i = 0; i < 4; i++)
    {
      p[i] = parseInt(p[i], 10);
    }
    switch (p.length)
    {
      case 0:
        return [0, 0, 0, 0];
      case 1:
        return [p[0], p[0], p[0], p[0]];
      case 2:
        return [p[0], p[1], p[0], p[1]];
      case 3:
        return [p[0], p[1], p[2], p[1]];
      default:
        return [p[0], p[1], p[2], p[3]];
    }
  }
  function cf_getAlignPadding(itm, o) {
    var x = (is_number(o[o.d['width']])) ? Math.ceil(o[o.d['width']] - ms_getTotalSize(itm, o, 'width')) : 0;
    switch (o.align)
    {
      case 'left': 
        return [0, x];
      case 'right':
        return [x, 0];
      case 'center':
      default:
        return [Math.ceil(x/2), Math.floor(x/2)];
    }
  }
  function cf_getDimensions(o) {
    var dm = [
        ['width'  , 'innerWidth'  , 'outerWidth'  , 'height'  , 'innerHeight' , 'outerHeight' , 'left', 'top' , 'marginRight' , 0, 1, 2, 3],
        ['height' , 'innerHeight' , 'outerHeight' , 'width' , 'innerWidth'  , 'outerWidth'  , 'top' , 'left', 'marginBottom', 3, 2, 1, 0]
      ];

    var dl = dm[0].length,
      dx = (o.direction == 'right' || o.direction == 'left') ? 0 : 1;

    var dimensions = {};
    for (var d = 0; d < dl; d++)
    {
      dimensions[dm[0][d]] = dm[dx][d];
    }
    return dimensions;
  }
  function cf_getAdjust(x, o, a, $t) {
    var v = x;
    if (is_function(a))
    {
      v = a.call($t, v);

    }
    else if (is_string(a))
    {
      var p = a.split('+'),
        m = a.split('-');

      if (m.length > p.length)
      {
        var neg = true,
          sta = m[0],
          adj = m[1];
      }
      else
      {
        var neg = false,
          sta = p[0],
          adj = p[1];
      }

      switch(sta)
      {
        case 'even':
          v = (x % 2 == 1) ? x-1 : x;
          break;
        case 'odd':
          v = (x % 2 == 0) ? x-1 : x;
          break;
        default:
          v = x;
          break;
      }
      adj = parseInt(adj, 10);
      if (is_number(adj))
      {
        if (neg)
        {
          adj = -adj;
        }
        v += adj;
      }
    }
    if (!is_number(v) || v < 1)
    {
      v = 1;
    }
    return v;
  }
  function cf_getItemsAdjust(x, o, a, $t) {
    return cf_getItemAdjustMinMax(cf_getAdjust(x, o, a, $t), o.items.visibleConf);
  }
  function cf_getItemAdjustMinMax(v, i) {
    if (is_number(i.min) && v < i.min)
    {
      v = i.min;
    }
    if (is_number(i.max) && v > i.max)
    {
      v = i.max;
    }
    if (v < 1)
    {
      v = 1;
    }
    return v;
  }
  function cf_getSynchArr(s) {
    if (!is_array(s))
    {
      s = [[s]];
    }
    if (!is_array(s[0]))
    {
      s = [s];
    }
    for (var j = 0, l = s.length; j < l; j++)
    {
      if (is_string(s[j][0]))
      {
        s[j][0] = $(s[j][0]);
      }
      if (!is_boolean(s[j][1]))
      {
        s[j][1] = true;
      }
      if (!is_boolean(s[j][2]))
      {
        s[j][2] = true;
      }
      if (!is_number(s[j][3]))
      {
        s[j][3] = 0;
      }
    }
    return s;
  }
  function cf_getKeyCode(k) {
    if (k == 'right')
    {
      return 39;
    }
    if (k == 'left')
    {
      return 37;
    }
    if (k == 'up')
    {
      return 38;
    }
    if (k == 'down')
    {
      return 40;
    }
    return -1;
  }
  function cf_setCookie(n, $c, c) {
    if (n)
    {
      var v = $c.triggerHandler(cf_e('currentPosition', c));
      $.fn.carouFredSel.cookie.set(n, v);
    }
  }
  function cf_getCookie(n) {
    var c = $.fn.carouFredSel.cookie.get(n);
    return (c == '') ? 0 : c;
  }

  //  init function
  function in_mapCss($elem, props) {
    var css = {}, prop;
    for (var p = 0, l = props.length; p < l; p++)
    {
      prop = props[p];
      css[prop] = $elem.css(prop);
    }
    return css;
  }
  function in_complementItems(obj, opt, itm, sta) {
    if (!is_object(obj.visibleConf))
    {
      obj.visibleConf = {};
    }
    if (!is_object(obj.sizesConf))
    {
      obj.sizesConf = {};
    }

    if (obj.start == 0 && is_number(sta))
    {
      obj.start = sta;
    }

    //  visible items
    if (is_object(obj.visible))
    {
      obj.visibleConf.min = obj.visible.min;
      obj.visibleConf.max = obj.visible.max;
      obj.visible = false;
    }
    else if (is_string(obj.visible))
    {
      //  variable visible items
      if (obj.visible == 'variable')
      {
        obj.visibleConf.variable = true;
      }
      //  adjust string visible items
      else
      {
        obj.visibleConf.adjust = obj.visible;
      }
      obj.visible = false;
    }
    else if (is_function(obj.visible))
    {
      obj.visibleConf.adjust = obj.visible;
      obj.visible = false;
    }

    //  set items filter
    if (!is_string(obj.filter))
    {
      obj.filter = (itm.filter(':hidden').length > 0) ? ':visible' : '*';
    }

    //  primary item-size not set
    if (!obj[opt.d['width']])
    {
      //  responsive carousel -> set to largest
      if (opt.responsive)
      {
        debug(true, 'Set a '+opt.d['width']+' for the items!');
        obj[opt.d['width']] = ms_getTrueLargestSize(itm, opt, 'outerWidth');
      }
      //   non-responsive -> measure it or set to "variable"
      else
      {
        obj[opt.d['width']] = (ms_hasVariableSizes(itm, opt, 'outerWidth')) 
          ? 'variable' 
          : itm[opt.d['outerWidth']](true);
      }
    }

    //  secondary item-size not set -> measure it or set to "variable"
    if (!obj[opt.d['height']])
    {
      obj[opt.d['height']] = (ms_hasVariableSizes(itm, opt, 'outerHeight')) 
        ? 'variable' 
        : itm[opt.d['outerHeight']](true);
    }

    obj.sizesConf.width = obj.width;
    obj.sizesConf.height = obj.height;
    return obj;
  }
  function in_complementVisibleItems(opt, avl) {
    //  primary item-size variable -> set visible items variable
    if (opt.items[opt.d['width']] == 'variable')
    {
      opt.items.visibleConf.variable = true;
    }
    if (!opt.items.visibleConf.variable) {
      //  primary size is number -> calculate visible-items
      if (is_number(opt[opt.d['width']]))
      {
        opt.items.visible = Math.floor(opt[opt.d['width']] / opt.items[opt.d['width']]);
      }
      //  measure and calculate primary size and visible-items
      else
      {
        opt.items.visible = Math.floor(avl / opt.items[opt.d['width']]);
        opt[opt.d['width']] = opt.items.visible * opt.items[opt.d['width']];
        if (!opt.items.visibleConf.adjust)
        {
          opt.align = false;
        }
      }
      if (opt.items.visible == 'Infinity' || opt.items.visible < 1)
      {
        debug(true, 'Not a valid number of visible items: Set to "variable".');
        opt.items.visibleConf.variable = true;
      }
    }
    return opt;
  }
  function in_complementPrimarySize(obj, opt, all) {
    //  primary size set to auto -> measure largest item-size and set it
    if (obj == 'auto')
    {
      obj = ms_getTrueLargestSize(all, opt, 'outerWidth');
    }
    return obj;
  }
  function in_complementSecondarySize(obj, opt, all) {
    //  secondary size set to auto -> measure largest item-size and set it
    if (obj == 'auto')
    {
      obj = ms_getTrueLargestSize(all, opt, 'outerHeight');
    }
    //  secondary size not set -> set to secondary item-size
    if (!obj)
    {
      obj = opt.items[opt.d['height']];
    }
    return obj;
  }
  function in_getAlignPadding(o, all) {
    var p = cf_getAlignPadding(gi_getCurrentItems(all, o), o);
    o.padding[o.d[1]] = p[1];
    o.padding[o.d[3]] = p[0];
    return o;
  }
  function in_getResponsiveValues(o, all, avl) {

    var visb = cf_getItemAdjustMinMax(Math.ceil(o[o.d['width']] / o.items[o.d['width']]), o.items.visibleConf);
    if (visb > all.length)
    {
      visb = all.length;
    }

    var newS = Math.floor(o[o.d['width']]/visb);

    o.items.visible = visb;
    o.items[o.d['width']] = newS;
    o[o.d['width']] = visb * newS;
    return o;
  }


  //  buttons functions
  function bt_pauseOnHoverConfig(p) {
    if (is_string(p))
    {
      var i = (p.indexOf('immediate') > -1) ? true : false,
        r = (p.indexOf('resume')  > -1) ? true : false;
    }
    else
    {
      var i = r = false;
    }
    return [i, r];
  }
  function bt_mousesheelNumber(mw) {
    return (is_number(mw)) ? mw : null
  }

  //  helper functions
  function is_null(a) {
    return (a === null);
  }
  function is_undefined(a) {
    return (is_null(a) || typeof a == 'undefined' || a === '' || a === 'undefined');
  }
  function is_array(a) {
    return (a instanceof Array);
  }
  function is_jquery(a) {
    return (a instanceof jQuery);
  }
  function is_object(a) {
    return ((a instanceof Object || typeof a == 'object') && !is_null(a) && !is_jquery(a) && !is_array(a));
  }
  function is_number(a) {
    return ((a instanceof Number || typeof a == 'number') && !isNaN(a));
  }
  function is_string(a) {
    return ((a instanceof String || typeof a == 'string') && !is_undefined(a) && !is_true(a) && !is_false(a));
  }
  function is_function(a) {
    return (a instanceof Function || typeof a == 'function');
  }
  function is_boolean(a) {
    return (a instanceof Boolean || typeof a == 'boolean' || is_true(a) || is_false(a));
  }
  function is_true(a) {
    return (a === true || a === 'true');
  }
  function is_false(a) {
    return (a === false || a === 'false');
  }
  function is_percentage(x) {
    return (is_string(x) && x.slice(-1) == '%');
  }


  function getTime() {
    return new Date().getTime();
  }

  function deprecated( o, n ) {
    debug(true, o+' is DEPRECATED, support for it will be removed. Use '+n+' instead.');
  }
  function debug(d, m) {
    if (is_object(d))
    {
      var s = ' ('+d.selector+')';
      d = d.debug;
    }
    else
    {
      var s = '';
    }
    if (!d)
    {
      return false;
    }

    if (is_string(m))
    {
      m = 'carouFredSel'+s+': ' + m;
    }
    else
    {
      m = ['carouFredSel'+s+':', m];
    }

    if (window.console && window.console.log)
    {
      window.console.log(m);
    }
    return false;
  }



  //  EASING FUNCTIONS

  $.extend($.easing, {
    'quadratic': function(t) {
      var t2 = t * t;
      return t * (-t2 * t + 4 * t2 - 6 * t + 4);
    },
    'cubic': function(t) {
      return t * (4 * t * t - 9 * t + 6);
    },
    'elastic': function(t) {
      var t2 = t * t;
      return t * (33 * t2 * t2 - 106 * t2 * t + 126 * t2 - 67 * t + 15);
    }
  });


})(jQuery);



/*
 * Superfish v1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */

;(function($){
  $.fn.superfish = function(op){

    var sf = $.fn.superfish,
      c = sf.c,
      $arrow = $(['<span class="',c.arrowClass,'"> &#187;</span>'].join('')),
      over = function(){
        var $$ = $(this), menu = getMenu($$);
        clearTimeout(menu.sfTimer);
        $$.showSuperfishUl().siblings().hideSuperfishUl();
      },
      out = function(){
        var $$ = $(this), menu = getMenu($$), o = sf.op;
        clearTimeout(menu.sfTimer);
        menu.sfTimer=setTimeout(function(){
          o.retainPath=($.inArray($$[0],o.$path)>-1);
          $$.hideSuperfishUl();
          if (o.$path.length && $$.parents(['li.',o.hoverClass].join('')).length<1){over.call(o.$path);}
        },o.delay); 
      },
      getMenu = function($menu){
        var menu = $menu.parents(['ul.',c.menuClass,':first'].join(''))[0];
        sf.op = sf.o[menu.serial];
        return menu;
      },
      addArrow = function($a){ $a.addClass(c.anchorClass).append($arrow.clone()); };
      
    return this.each(function() {
      var s = this.serial = sf.o.length;
      var o = $.extend({},sf.defaults,op);
      o.$path = $('li.'+o.pathClass,this).slice(0,o.pathLevels).each(function(){
        $(this).addClass([o.hoverClass,c.bcClass].join(' '))
          .filter('li:has(ul)').removeClass(o.pathClass);
      });
      sf.o[s] = sf.op = o;
      
      $('li:has(ul)',this)[($.fn.hoverIntent && !o.disableHI) ? 'hoverIntent' : 'hover'](over,out).each(function() {
        if (o.autoArrows) addArrow( $('>a:first-child',this) );
      })
      .not('.'+c.bcClass)
        .hideSuperfishUl();
      
      var $a = $('a',this);
      $a.each(function(i){
        var $li = $a.eq(i).parents('li');
        $a.eq(i).focus(function(){over.call($li);}).blur(function(){out.call($li);});
      });
      o.onInit.call(this);
      
    }).each(function() {
      var menuClasses = [c.menuClass];
      if (sf.op.dropShadows  && !($.browser.msie && $.browser.version < 7)) menuClasses.push(c.shadowClass);
      $(this).addClass(menuClasses.join(' '));
    });
  };

  var sf = $.fn.superfish;
  sf.o = [];
  sf.op = {};
  sf.IE7fix = function(){
    var o = sf.op;
    if ($.browser.msie && $.browser.version > 6 && o.dropShadows && o.animation.opacity!=undefined)
      this.toggleClass(sf.c.shadowClass+'-off');
    };
  sf.c = {
    bcClass     : 'sf-breadcrumb',
    menuClass   : 'sf-js-enabled',
    anchorClass : 'sf-with-ul',
    arrowClass  : 'sf-sub-indicator',
    shadowClass : 'sf-shadow'
  };
  sf.defaults = {
    hoverClass  : 'sfHover',
    pathClass : 'overideThisToUse',
    pathLevels  : 1,
    delay   : 800,
    animation : {opacity:'show'},
    speed   : 'normal',
    autoArrows  : true,
    dropShadows : true,
    disableHI : false,    // true disables hoverIntent detection
    onInit    : function(){}, // callback functions
    onBeforeShow: function(){},
    onShow    : function(){},
    onHide    : function(){}
  };
  $.fn.extend({
    hideSuperfishUl : function(){
      var o = sf.op,
        not = (o.retainPath===true) ? o.$path : '';
      o.retainPath = false;
      var $ul = $(['li.',o.hoverClass].join(''),this).add(this).not(not).removeClass(o.hoverClass)
          .find('>ul').hide().css('visibility','hidden');
      o.onHide.call($ul);
      return this;
    },
    showSuperfishUl : function(){
      var o = sf.op,
        sh = sf.c.shadowClass+'-off',
        $ul = this.addClass(o.hoverClass)
          .find('>ul:hidden').css('visibility','visible');
      sf.IE7fix.call($ul);
      o.onBeforeShow.call($ul);
      $ul.animate(o.animation,o.speed,function(){ sf.IE7fix.call($ul); o.onShow.call($ul); });
      return this;
    }
  });

})(jQuery);




/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 *
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 *
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function($) {
  var tmp, loading, overlay, wrap, outer, content, close, title, nav_left, nav_right,

    selectedIndex = 0, selectedOpts = {}, selectedArray = [], currentIndex = 0, currentOpts = {}, currentArray = [],

    ajaxLoader = null, imgPreloader = new Image(), imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i, swfRegExp = /[^\.]\.(swf)\s*$/i,

    loadingTimer, loadingFrame = 1,

    titleHeight = 0, titleStr = '', start_pos, final_pos, busy = false, fx = $.extend($('<div/>')[0], { prop: 0 }),

    isIE6 = $.browser.msie && $.browser.version < 7 && !window.XMLHttpRequest,

    /*
     * Private methods 
     */

    _abort = function() {
      loading.hide();

      imgPreloader.onerror = imgPreloader.onload = null;

      if (ajaxLoader) {
        ajaxLoader.abort();
      }

      tmp.empty();
    },

    _error = function() {
      if (false === selectedOpts.onError(selectedArray, selectedIndex, selectedOpts)) {
        loading.hide();
        busy = false;
        return;
      }

      selectedOpts.titleShow = false;

      selectedOpts.width = 'auto';
      selectedOpts.height = 'auto';

      tmp.html( '<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>' );

      _process_inline();
    },

    _start = function() {
      var obj = selectedArray[ selectedIndex ],
        href, 
        type, 
        title,
        str,
        emb,
        ret;

      _abort();

      selectedOpts = $.extend({}, $.fn.fancybox.defaults, (typeof $(obj).data('fancybox') == 'undefined' ? selectedOpts : $(obj).data('fancybox')));

      ret = selectedOpts.onStart(selectedArray, selectedIndex, selectedOpts);

      if (ret === false) {
        busy = false;
        return;
      } else if (typeof ret == 'object') {
        selectedOpts = $.extend(selectedOpts, ret);
      }

      title = selectedOpts.title || (obj.nodeName ? $(obj).attr('title') : obj.title) || '';

      if (obj.nodeName && !selectedOpts.orig) {
        selectedOpts.orig = $(obj).children("img:first").length ? $(obj).children("img:first") : $(obj);
      }

      if (title === '' && selectedOpts.orig && selectedOpts.titleFromAlt) {
        title = selectedOpts.orig.attr('alt');
      }

      href = selectedOpts.href || (obj.nodeName ? $(obj).attr('href') : obj.href) || null;

      if ((/^(?:javascript)/i).test(href) || href == '#') {
        href = null;
      }

      if (selectedOpts.type) {
        type = selectedOpts.type;

        if (!href) {
          href = selectedOpts.content;
        }

      } else if (selectedOpts.content) {
        type = 'html';

      } else if (href) {
        if (href.match(imgRegExp)) {
          type = 'image';

        } else if (href.match(swfRegExp)) {
          type = 'swf';

        } else if ($(obj).hasClass("iframe")) {
          type = 'iframe';

        } else if (href.indexOf("#") === 0) {
          type = 'inline';

        } else {
          type = 'ajax';
        }
      }

      if (!type) {
        _error();
        return;
      }

      if (type == 'inline') {
        obj = href.substr(href.indexOf("#"));
        type = $(obj).length > 0 ? 'inline' : 'ajax';
      }

      selectedOpts.type = type;
      selectedOpts.href = href;
      selectedOpts.title = title;

      if (selectedOpts.autoDimensions) {
        if (selectedOpts.type == 'html' || selectedOpts.type == 'inline' || selectedOpts.type == 'ajax') {
          selectedOpts.width = 'auto';
          selectedOpts.height = 'auto';
        } else {
          selectedOpts.autoDimensions = false;  
        }
      }

      if (selectedOpts.modal) {
        selectedOpts.overlayShow = true;
        selectedOpts.hideOnOverlayClick = false;
        selectedOpts.hideOnContentClick = false;
        selectedOpts.enableEscapeButton = false;
        selectedOpts.showCloseButton = false;
      }

      selectedOpts.padding = parseInt(selectedOpts.padding, 10);
      selectedOpts.margin = parseInt(selectedOpts.margin, 10);

      tmp.css('padding', (selectedOpts.padding + selectedOpts.margin));

      $('.fancybox-inline-tmp').unbind('fancybox-cancel').bind('fancybox-change', function() {
        $(this).replaceWith(content.children());        
      });

      switch (type) {
        case 'html' :
          tmp.html( selectedOpts.content );
          _process_inline();
        break;

        case 'inline' :
          if ( $(obj).parent().is('#fancybox-content') === true) {
            busy = false;
            return;
          }

          $('<div class="fancybox-inline-tmp" />')
            .hide()
            .insertBefore( $(obj) )
            .bind('fancybox-cleanup', function() {
              $(this).replaceWith(content.children());
            }).bind('fancybox-cancel', function() {
              $(this).replaceWith(tmp.children());
            });

          $(obj).appendTo(tmp);

          _process_inline();
        break;

        case 'image':
          busy = false;

          $.fancybox.showActivity();

          imgPreloader = new Image();

          imgPreloader.onerror = function() {
            _error();
          };

          imgPreloader.onload = function() {
            busy = true;

            imgPreloader.onerror = imgPreloader.onload = null;

            _process_image();
          };

          imgPreloader.src = href;
        break;

        case 'swf':
          selectedOpts.scrolling = 'no';

          str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"><param name="movie" value="' + href + '"></param>';
          emb = '';

          $.each(selectedOpts.swf, function(name, val) {
            str += '<param name="' + name + '" value="' + val + '"></param>';
            emb += ' ' + name + '="' + val + '"';
          });

          str += '<embed src="' + href + '" type="application/x-shockwave-flash" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"' + emb + '></embed></object>';

          tmp.html(str);

          _process_inline();
        break;

        case 'ajax':
          busy = false;

          $.fancybox.showActivity();

          selectedOpts.ajax.win = selectedOpts.ajax.success;

          ajaxLoader = $.ajax($.extend({}, selectedOpts.ajax, {
            url : href,
            data : selectedOpts.ajax.data || {},
            error : function(XMLHttpRequest, textStatus, errorThrown) {
              if ( XMLHttpRequest.status > 0 ) {
                _error();
              }
            },
            success : function(data, textStatus, XMLHttpRequest) {
              var o = typeof XMLHttpRequest == 'object' ? XMLHttpRequest : ajaxLoader;
              if (o.status == 200) {
                if ( typeof selectedOpts.ajax.win == 'function' ) {
                  ret = selectedOpts.ajax.win(href, data, textStatus, XMLHttpRequest);

                  if (ret === false) {
                    loading.hide();
                    return;
                  } else if (typeof ret == 'string' || typeof ret == 'object') {
                    data = ret;
                  }
                }

                tmp.html( data );
                _process_inline();
              }
            }
          }));

        break;

        case 'iframe':
          _show();
        break;
      }
    },

    _process_inline = function() {
      var
        w = selectedOpts.width,
        h = selectedOpts.height;

      if (w.toString().indexOf('%') > -1) {
        w = parseInt( ($(window).width() - (selectedOpts.margin * 2)) * parseFloat(w) / 100, 10) + 'px';

      } else {
        w = w == 'auto' ? 'auto' : w + 'px';  
      }

      if (h.toString().indexOf('%') > -1) {
        h = parseInt( ($(window).height() - (selectedOpts.margin * 2)) * parseFloat(h) / 100, 10) + 'px';

      } else {
        h = h == 'auto' ? 'auto' : h + 'px';  
      }

      tmp.wrapInner('<div style="width:' + w + ';height:' + h + ';overflow: ' + (selectedOpts.scrolling == 'auto' ? 'auto' : (selectedOpts.scrolling == 'yes' ? 'scroll' : 'hidden')) + ';position:relative;"></div>');

      selectedOpts.width = tmp.width();
      selectedOpts.height = tmp.height();

      _show();
    },

    _process_image = function() {
      selectedOpts.width = imgPreloader.width;
      selectedOpts.height = imgPreloader.height;

      $("<img />").attr({
        'id' : 'fancybox-img',
        'src' : imgPreloader.src,
        'alt' : selectedOpts.title
      }).appendTo( tmp );

      _show();
    },

    _show = function() {
      var pos, equal;

      loading.hide();

      if (wrap.is(":visible") && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
        $.event.trigger('fancybox-cancel');

        busy = false;
        return;
      }

      busy = true;

      $(content.add( overlay )).unbind();

      $(window).unbind("resize.fb scroll.fb");
      $(document).unbind('keydown.fb');

      if (wrap.is(":visible") && currentOpts.titlePosition !== 'outside') {
        wrap.css('height', wrap.height());
      }

      currentArray = selectedArray;
      currentIndex = selectedIndex;
      currentOpts = selectedOpts;

      if (currentOpts.overlayShow) {
        overlay.css({
          'background-color' : currentOpts.overlayColor,
          'opacity' : currentOpts.overlayOpacity,
          'cursor' : currentOpts.hideOnOverlayClick ? 'pointer' : 'auto',
          'height' : $(document).height()
        });

        if (!overlay.is(':visible')) {
          if (isIE6) {
            $('select:not(#fancybox-tmp select)').filter(function() {
              return this.style.visibility !== 'hidden';
            }).css({'visibility' : 'hidden'}).one('fancybox-cleanup', function() {
              this.style.visibility = 'inherit';
            });
          }

          overlay.show();
        }
      } else {
        overlay.hide();
      }

      final_pos = _get_zoom_to();

      _process_title();

      if (wrap.is(":visible")) {
        $( close.add( nav_left ).add( nav_right ) ).hide();

        pos = wrap.position(),

        start_pos = {
          top  : pos.top,
          left : pos.left,
          width : wrap.width(),
          height : wrap.height()
        };

        equal = (start_pos.width == final_pos.width && start_pos.height == final_pos.height);

        content.fadeTo(currentOpts.changeFade, 0.3, function() {
          var finish_resizing = function() {
            content.html( tmp.contents() ).fadeTo(currentOpts.changeFade, 1, _finish);
          };

          $.event.trigger('fancybox-change');

          content
            .empty()
            .removeAttr('filter')
            .css({
              'border-width' : currentOpts.padding,
              'width' : final_pos.width - currentOpts.padding * 2,
              'height' : selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
            });

          if (equal) {
            finish_resizing();

          } else {
            fx.prop = 0;

            $(fx).animate({prop: 1}, {
               duration : currentOpts.changeSpeed,
               easing : currentOpts.easingChange,
               step : _draw,
               complete : finish_resizing
            });
          }
        });

        return;
      }

      wrap.removeAttr("style");

      content.css('border-width', currentOpts.padding);

      if (currentOpts.transitionIn == 'elastic') {
        start_pos = _get_zoom_from();

        content.html( tmp.contents() );

        wrap.show();

        if (currentOpts.opacity) {
          final_pos.opacity = 0;
        }

        fx.prop = 0;

        $(fx).animate({prop: 1}, {
           duration : currentOpts.speedIn,
           easing : currentOpts.easingIn,
           step : _draw,
           complete : _finish
        });

        return;
      }

      if (currentOpts.titlePosition == 'inside' && titleHeight > 0) { 
        title.show(); 
      }

      content
        .css({
          'width' : final_pos.width - currentOpts.padding * 2,
          'height' : selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
        })
        .html( tmp.contents() );

      wrap
        .css(final_pos)
        .fadeIn( currentOpts.transitionIn == 'none' ? 0 : currentOpts.speedIn, _finish );
    },

    _format_title = function(title) {
      if (title && title.length) {
        if (currentOpts.titlePosition == 'float') {
          return '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' + title + '</td><td id="fancybox-title-float-right"></td></tr></table>';
        }

        return '<div id="fancybox-title-' + currentOpts.titlePosition + '">' + title + '</div>';
      }

      return false;
    },

    _process_title = function() {
      titleStr = currentOpts.title || '';
      titleHeight = 0;

      title
        .empty()
        .removeAttr('style')
        .removeClass();

      if (currentOpts.titleShow === false) {
        title.hide();
        return;
      }

      titleStr = $.isFunction(currentOpts.titleFormat) ? currentOpts.titleFormat(titleStr, currentArray, currentIndex, currentOpts) : _format_title(titleStr);

      if (!titleStr || titleStr === '') {
        title.hide();
        return;
      }

      title
        .addClass('fancybox-title-' + currentOpts.titlePosition)
        .html( titleStr )
        .appendTo( 'body' )
        .show();

      switch (currentOpts.titlePosition) {
        case 'inside':
          title
            .css({
              'width' : final_pos.width - (currentOpts.padding * 2),
              'marginLeft' : currentOpts.padding,
              'marginRight' : currentOpts.padding
            });

          titleHeight = title.outerHeight(true);

          title.appendTo( outer );

          final_pos.height += titleHeight;
        break;

        case 'over':
          title
            .css({
              'marginLeft' : currentOpts.padding,
              'width' : final_pos.width - (currentOpts.padding * 2),
              'bottom' : currentOpts.padding
            })
            .appendTo( outer );
        break;

        case 'float':
          title
            .css('left', parseInt((title.width() - final_pos.width - 40)/ 2, 10) * -1)
            .appendTo( wrap );
        break;

        default:
          title
            .css({
              'width' : final_pos.width - (currentOpts.padding * 2),
              'paddingLeft' : currentOpts.padding,
              'paddingRight' : currentOpts.padding
            })
            .appendTo( wrap );
        break;
      }

      title.hide();
    },

    _set_navigation = function() {
      if (currentOpts.enableEscapeButton || currentOpts.enableKeyboardNav) {
        $(document).bind('keydown.fb', function(e) {
          if (e.keyCode == 27 && currentOpts.enableEscapeButton) {
            e.preventDefault();
            $.fancybox.close();

          } else if ((e.keyCode == 37 || e.keyCode == 39) && currentOpts.enableKeyboardNav && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
            $.fancybox[ e.keyCode == 37 ? 'prev' : 'next']();
          }
        });
      }

      if (!currentOpts.showNavArrows) { 
        nav_left.hide();
        nav_right.hide();
        return;
      }

      if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex !== 0) {
        nav_left.show();
      }

      if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex != (currentArray.length -1)) {
        nav_right.show();
      }
    },

    _finish = function () {
      if (!$.support.opacity) {
        content.get(0).style.removeAttribute('filter');
        wrap.get(0).style.removeAttribute('filter');
      }

      if (selectedOpts.autoDimensions) {
        content.css('height', 'auto');
      }

      wrap.css('height', 'auto');

      if (titleStr && titleStr.length) {
        title.show();
      }

      if (currentOpts.showCloseButton) {
        close.show();
      }

      _set_navigation();
  
      if (currentOpts.hideOnContentClick) {
        content.bind('click', $.fancybox.close);
      }

      if (currentOpts.hideOnOverlayClick) {
        overlay.bind('click', $.fancybox.close);
      }

      $(window).bind("resize.fb", $.fancybox.resize);

      if (currentOpts.centerOnScroll) {
        $(window).bind("scroll.fb", $.fancybox.center);
      }

      if (currentOpts.type == 'iframe') {
        $('<iframe id="fancybox-frame" name="fancybox-frame' + new Date().getTime() + '" frameborder="0" hspace="0" ' + ($.browser.msie ? 'allowtransparency="true""' : '') + ' scrolling="' + selectedOpts.scrolling + '" src="' + currentOpts.href + '"></iframe>').appendTo(content);
      }

      wrap.show();

      busy = false;

      $.fancybox.center();

      currentOpts.onComplete(currentArray, currentIndex, currentOpts);

      _preload_images();
    },

    _preload_images = function() {
      var href, 
        objNext;

      if ((currentArray.length -1) > currentIndex) {
        href = currentArray[ currentIndex + 1 ].href;

        if (typeof href !== 'undefined' && href.match(imgRegExp)) {
          objNext = new Image();
          objNext.src = href;
        }
      }

      if (currentIndex > 0) {
        href = currentArray[ currentIndex - 1 ].href;

        if (typeof href !== 'undefined' && href.match(imgRegExp)) {
          objNext = new Image();
          objNext.src = href;
        }
      }
    },

    _draw = function(pos) {
      var dim = {
        width : parseInt(start_pos.width + (final_pos.width - start_pos.width) * pos, 10),
        height : parseInt(start_pos.height + (final_pos.height - start_pos.height) * pos, 10),

        top : parseInt(start_pos.top + (final_pos.top - start_pos.top) * pos, 10),
        left : parseInt(start_pos.left + (final_pos.left - start_pos.left) * pos, 10)
      };

      if (typeof final_pos.opacity !== 'undefined') {
        dim.opacity = pos < 0.5 ? 0.5 : pos;
      }

      wrap.css(dim);

      content.css({
        'width' : dim.width - currentOpts.padding * 2,
        'height' : dim.height - (titleHeight * pos) - currentOpts.padding * 2
      });
    },

    _get_viewport = function() {
      return [
        $(window).width() - (currentOpts.margin * 2),
        $(window).height() - (currentOpts.margin * 2),
        $(document).scrollLeft() + currentOpts.margin,
        $(document).scrollTop() + currentOpts.margin
      ];
    },

    _get_zoom_to = function () {
      var view = _get_viewport(),
        to = {},
        resize = currentOpts.autoScale,
        double_padding = currentOpts.padding * 2,
        ratio;

      if (currentOpts.width.toString().indexOf('%') > -1) {
        to.width = parseInt((view[0] * parseFloat(currentOpts.width)) / 100, 10);
      } else {
        to.width = currentOpts.width + double_padding;
      }

      if (currentOpts.height.toString().indexOf('%') > -1) {
        to.height = parseInt((view[1] * parseFloat(currentOpts.height)) / 100, 10);
      } else {
        to.height = currentOpts.height + double_padding;
      }

      if (resize && (to.width > view[0] || to.height > view[1])) {
        if (selectedOpts.type == 'image' || selectedOpts.type == 'swf') {
          ratio = (currentOpts.width ) / (currentOpts.height );

          if ((to.width ) > view[0]) {
            to.width = view[0];
            to.height = parseInt(((to.width - double_padding) / ratio) + double_padding, 10);
          }

          if ((to.height) > view[1]) {
            to.height = view[1];
            to.width = parseInt(((to.height - double_padding) * ratio) + double_padding, 10);
          }

        } else {
          to.width = Math.min(to.width, view[0]);
          to.height = Math.min(to.height, view[1]);
        }
      }

      to.top = parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - to.height - 40) * 0.5)), 10);
      to.left = parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - to.width - 40) * 0.5)), 10);

      return to;
    },

    _get_obj_pos = function(obj) {
      var pos = obj.offset();

      pos.top += parseInt( obj.css('paddingTop'), 10 ) || 0;
      pos.left += parseInt( obj.css('paddingLeft'), 10 ) || 0;

      pos.top += parseInt( obj.css('border-top-width'), 10 ) || 0;
      pos.left += parseInt( obj.css('border-left-width'), 10 ) || 0;

      pos.width = obj.width();
      pos.height = obj.height();

      return pos;
    },

    _get_zoom_from = function() {
      var orig = selectedOpts.orig ? $(selectedOpts.orig) : false,
        from = {},
        pos,
        view;

      if (orig && orig.length) {
        pos = _get_obj_pos(orig);

        from = {
          width : pos.width + (currentOpts.padding * 2),
          height : pos.height + (currentOpts.padding * 2),
          top : pos.top - currentOpts.padding - 20,
          left : pos.left - currentOpts.padding - 20
        };

      } else {
        view = _get_viewport();

        from = {
          width : currentOpts.padding * 2,
          height : currentOpts.padding * 2,
          top : parseInt(view[3] + view[1] * 0.5, 10),
          left : parseInt(view[2] + view[0] * 0.5, 10)
        };
      }

      return from;
    },

    _animate_loading = function() {
      if (!loading.is(':visible')){
        clearInterval(loadingTimer);
        return;
      }

      $('div', loading).css('top', (loadingFrame * -40) + 'px');

      loadingFrame = (loadingFrame + 1) % 12;
    };

  /*
   * Public methods 
   */

  $.fn.fancybox = function(options) {
    if (!$(this).length) {
      return this;
    }

    $(this)
      .data('fancybox', $.extend({}, options, ($.metadata ? $(this).metadata() : {})))
      .unbind('click.fb')
      .bind('click.fb', function(e) {
        e.preventDefault();

        if (busy) {
          return;
        }

        busy = true;

        $(this).blur();

        selectedArray = [];
        selectedIndex = 0;

        var rel = $(this).attr('rel') || '';

        if (!rel || rel == '' || rel === 'nofollow') {
          selectedArray.push(this);

        } else {
          selectedArray = $("a[rel=" + rel + "], area[rel=" + rel + "]");
          selectedIndex = selectedArray.index( this );
        }

        _start();

        return;
      });

    return this;
  };

  $.fancybox = function(obj) {
    var opts;

    if (busy) {
      return;
    }

    busy = true;
    opts = typeof arguments[1] !== 'undefined' ? arguments[1] : {};

    selectedArray = [];
    selectedIndex = parseInt(opts.index, 10) || 0;

    if ($.isArray(obj)) {
      for (var i = 0, j = obj.length; i < j; i++) {
        if (typeof obj[i] == 'object') {
          $(obj[i]).data('fancybox', $.extend({}, opts, obj[i]));
        } else {
          obj[i] = $({}).data('fancybox', $.extend({content : obj[i]}, opts));
        }
      }

      selectedArray = jQuery.merge(selectedArray, obj);

    } else {
      if (typeof obj == 'object') {
        $(obj).data('fancybox', $.extend({}, opts, obj));
      } else {
        obj = $({}).data('fancybox', $.extend({content : obj}, opts));
      }

      selectedArray.push(obj);
    }

    if (selectedIndex > selectedArray.length || selectedIndex < 0) {
      selectedIndex = 0;
    }

    _start();
  };

  $.fancybox.showActivity = function() {
    clearInterval(loadingTimer);

    loading.show();
    loadingTimer = setInterval(_animate_loading, 66);
  };

  $.fancybox.hideActivity = function() {
    loading.hide();
  };

  $.fancybox.next = function() {
    return $.fancybox.pos( currentIndex + 1);
  };

  $.fancybox.prev = function() {
    return $.fancybox.pos( currentIndex - 1);
  };

  $.fancybox.pos = function(pos) {
    if (busy) {
      return;
    }

    pos = parseInt(pos);

    selectedArray = currentArray;

    if (pos > -1 && pos < currentArray.length) {
      selectedIndex = pos;
      _start();

    } else if (currentOpts.cyclic && currentArray.length > 1) {
      selectedIndex = pos >= currentArray.length ? 0 : currentArray.length - 1;
      _start();
    }

    return;
  };

  $.fancybox.cancel = function() {
    if (busy) {
      return;
    }

    busy = true;

    $.event.trigger('fancybox-cancel');

    _abort();

    selectedOpts.onCancel(selectedArray, selectedIndex, selectedOpts);

    busy = false;
  };

  // Note: within an iframe use - parent.$.fancybox.close();
  $.fancybox.close = function() {
    if (busy || wrap.is(':hidden')) {
      return;
    }

    busy = true;

    if (currentOpts && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
      busy = false;
      return;
    }

    _abort();

    $(close.add( nav_left ).add( nav_right )).hide();

    $(content.add( overlay )).unbind();

    $(window).unbind("resize.fb scroll.fb");
    $(document).unbind('keydown.fb');

    content.find('iframe').attr('src', isIE6 && /^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank');

    if (currentOpts.titlePosition !== 'inside') {
      title.empty();
    }

    wrap.stop();

    function _cleanup() {
      overlay.fadeOut('fast');

      title.empty().hide();
      wrap.hide();

      $.event.trigger('fancybox-cleanup');

      content.empty();

      currentOpts.onClosed(currentArray, currentIndex, currentOpts);

      currentArray = selectedOpts = [];
      currentIndex = selectedIndex = 0;
      currentOpts = selectedOpts  = {};

      busy = false;
    }

    if (currentOpts.transitionOut == 'elastic') {
      start_pos = _get_zoom_from();

      var pos = wrap.position();

      final_pos = {
        top  : pos.top ,
        left : pos.left,
        width : wrap.width(),
        height : wrap.height()
      };

      if (currentOpts.opacity) {
        final_pos.opacity = 1;
      }

      title.empty().hide();

      fx.prop = 1;

      $(fx).animate({ prop: 0 }, {
         duration : currentOpts.speedOut,
         easing : currentOpts.easingOut,
         step : _draw,
         complete : _cleanup
      });

    } else {
      wrap.fadeOut( currentOpts.transitionOut == 'none' ? 0 : currentOpts.speedOut, _cleanup);
    }
  };

  $.fancybox.resize = function() {
    if (overlay.is(':visible')) {
      overlay.css('height', $(document).height());
    }

    $.fancybox.center(true);
  };

  $.fancybox.center = function() {
    var view, align;

    if (busy) {
      return; 
    }

    align = arguments[0] === true ? 1 : 0;
    view = _get_viewport();

    if (!align && (wrap.width() > view[0] || wrap.height() > view[1])) {
      return; 
    }

    wrap
      .stop()
      .animate({
        'top' : parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - content.height() - 40) * 0.5) - currentOpts.padding)),
        'left' : parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - content.width() - 40) * 0.5) - currentOpts.padding))
      }, typeof arguments[0] == 'number' ? arguments[0] : 200);
  };

  $.fancybox.init = function() {
    if ($("#fancybox-wrap").length) {
      return;
    }

    $('body').append(
      tmp = $('<div id="fancybox-tmp"></div>'),
      loading = $('<div id="fancybox-loading"><div></div></div>'),
      overlay = $('<div id="fancybox-overlay"></div>'),
      wrap = $('<div id="fancybox-wrap"></div>')
    );

    outer = $('<div id="fancybox-outer"></div>')
      .append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>')
      .appendTo( wrap );

    outer.append(
      content = $('<div id="fancybox-content"></div>'),
      close = $('<a id="fancybox-close"></a>'),
      title = $('<div id="fancybox-title"></div>'),

      nav_left = $('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),
      nav_right = $('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>')
    );

    close.click($.fancybox.close);
    loading.click($.fancybox.cancel);

    nav_left.click(function(e) {
      e.preventDefault();
      $.fancybox.prev();
    });

    nav_right.click(function(e) {
      e.preventDefault();
      $.fancybox.next();
    });

    if ($.fn.mousewheel) {
      wrap.bind('mousewheel.fb', function(e, delta) {
        if (busy) {
          e.preventDefault();

        } else if ($(e.target).get(0).clientHeight == 0 || $(e.target).get(0).scrollHeight === $(e.target).get(0).clientHeight) {
          e.preventDefault();
          $.fancybox[ delta > 0 ? 'prev' : 'next']();
        }
      });
    }

    if (!$.support.opacity) {
      wrap.addClass('fancybox-ie');
    }

    if (isIE6) {
      loading.addClass('fancybox-ie6');
      wrap.addClass('fancybox-ie6');

      $('<iframe id="fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(outer);
    }
  };

  $.fn.fancybox.defaults = {
    padding : 10,
    margin : 40,
    opacity : false,
    modal : false,
    cyclic : false,
    scrolling : 'auto', // 'auto', 'yes' or 'no'

    width : 560,
    height : 340,

    autoScale : true,
    autoDimensions : true,
    centerOnScroll : false,

    ajax : {},
    swf : { wmode: 'transparent' },

    hideOnOverlayClick : true,
    hideOnContentClick : false,

    overlayShow : true,
    overlayOpacity : 0.7,
    overlayColor : '#777',

    titleShow : true,
    titlePosition : 'float', // 'float', 'outside', 'inside' or 'over'
    titleFormat : null,
    titleFromAlt : false,

    transitionIn : 'fade', // 'elastic', 'fade' or 'none'
    transitionOut : 'fade', // 'elastic', 'fade' or 'none'

    speedIn : 300,
    speedOut : 300,

    changeSpeed : 300,
    changeFade : 'fast',

    easingIn : 'swing',
    easingOut : 'swing',

    showCloseButton  : true,
    showNavArrows : true,
    enableEscapeButton : true,
    enableKeyboardNav : true,

    onStart : function(){},
    onCancel : function(){},
    onComplete : function(){},
    onCleanup : function(){},
    onClosed : function(){},
    onError : function(){}
  };

  $(document).ready(function() {
    $.fancybox.init();
  });

})(jQuery);



/*
* touchSwipe - jQuery Plugin
* https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
* http://labs.skinkers.com/touchSwipe/
* http://plugins.jquery.com/project/touchSwipe
*
* Copyright (c) 2010 Matt Bryson (www.skinkers.com)
* Dual licensed under the MIT or GPL Version 2 licenses.
*
* $version: 1.5.1
*
* Changelog
* $Date: 2010-12-12 (Wed, 12 Dec 2010) $
* $version: 1.0.0 
* $version: 1.0.1 - removed multibyte comments
*
* $Date: 2011-21-02 (Mon, 21 Feb 2011) $
* $version: 1.1.0   - added allowPageScroll property to allow swiping and scrolling of page
*         - changed handler signatures so one handler can be used for multiple events
* $Date: 2011-23-02 (Wed, 23 Feb 2011) $
* $version: 1.2.0   - added click handler. This is fired if the user simply clicks and does not swipe. The event object and click target are passed to handler.
*         - If you use the http://code.google.com/p/jquery-ui-for-ipad-and-iphone/ plugin, you can also assign jQuery mouse events to children of a touchSwipe object.
* $version: 1.2.1   - removed console log!
*
* $version: 1.2.2   - Fixed bug where scope was not preserved in callback methods. 
*
* $Date: 2011-28-04 (Thurs, 28 April 2011) $
* $version: 1.2.4   - Changed licence terms to be MIT or GPL inline with jQuery. Added check for support of touch events to stop non compatible browsers erroring.
*
* $Date: 2011-27-09 (Tues, 27 September 2011) $
* $version: 1.2.5   - Added support for testing swipes with mouse on desktop browser (thanks to https://github.com/joelhy)
*
* $Date: 2012-14-05 (Mon, 14 May 2012) $
* $version: 1.2.6   - Added timeThreshold between start and end touch, so user can ignore slow swipes (thanks to Mark Chase). Default is null, all swipes are detected
* 
* $Date: 2012-05-06 (Tues, 05 June 2012) $
* $version: 1.2.7   - Changed time threshold to have null default for backwards compatibility. Added duration param passed back in events, and refactored how time is handled.
*
* $Date: 2012-05-06 (Tues, 05 June 2012) $
* $version: 1.2.8   - Added the possibility to return a value like null or false in the trigger callback. In that way we can control when the touch start/move should take effect or not (simply by returning in some cases return null; or return false;) This effects the ontouchstart/ontouchmove event.
*
* $Date: 2012-06-06 (Wed, 06 June 2012) $
* $version: 1.3.0   - Refactored whole plugin to allow for methods to be executed, as well as exposed defaults for user override. Added 'enable', 'disable', and 'destroy' methods
*
* $Date: 2012-05-06 (Fri, 05 June 2012) $
* $version: 1.3.1   - Bug fixes  - bind() with false as last argument is no longer supported in jQuery 1.6, also, if you just click, the duration is now returned correctly.
*
* $Date: 2012-29-07 (Sun, 29 July 2012) $
* $version: 1.3.2 - Added fallbackToMouseEvents option to NOT capture mouse events on non touch devices.
*       - Added "all" fingers value to the fingers property, so any combinatin of fingers triggers the swipe, allowing event handlers to check the finger count
*
* $Date: 2012-09-08 (Thurs, 9 Aug 2012) $
* $version: 1.3.3 - Code tidy prep for minified version
*
* $Date: 2012-04-10 (wed, 4 Oct 2012) $
* $version: 1.4.0 - Added pinch support, pinchIn and pinchOut
*
* $Date: 2012-11-10 (Thurs, 11 Oct 2012) $
* $version: 1.5.0 - Added excludedElements, a jquery selector that specifies child elements that do NOT trigger swipes. By default, this is one select that removes all form, input select, button and anchor elements.
*
* $Date: 2012-22-10 (Mon, 22 Oct 2012) $
* $version: 1.5.1 - Fixed bug with jQuery 1.8 and trailing comma in excludedElements
*
* A jQuery plugin to capture left, right, up and down swipes on touch devices.
* You can capture 2 finger or 1 finger swipes, set the threshold and define either a catch all handler, or individual direction handlers.
* Options: The defaults can be overridden by setting them in $.fn.swipe.defaults
*     swipe       Function  A catch all handler that is triggered for all swipe directions. Handler is passed 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down" , the distance of the swipe, the duration of the swipe and the finger count.
*     swipeLeft   Function  A handler that is triggered for "left" swipes. Handler is passed 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down"  , the distance of the swipe, the duration of the swipe and the finger count.
*     swipeRight    Function  A handler that is triggered for "right" swipes. Handler is passed 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down"  , the distance of the swipe, the duration of the swipe and the finger count.
*     swipeUp     Function  A handler that is triggered for "up" swipes. Handler is passed 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down" , the distance of the swipe, the duration of the swipe and the finger count.
*     swipeDown   Function  A handler that is triggered for "down" swipes. Handler is passed 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down"  , the distance of the swipe, the duration of the swipe and the finger count.
*   swipeStatus   Function  A handler triggered for every phase of the swipe. Handler is passed 4 arguments: event : The original event object, phase:The current swipe phase, either "start", "move", "end" or "cancel". direction : The swipe direction, either "up?, "down?, "left " or "right?.distance : The distance of the swipe.Duration : The duration of the swipe :  The finger count
*   
*     pinchIn     Function  A handler triggered when the user pinch zooms inward. Handler is passed 
*     pinchOut    Function  A handler triggered when the user pinch zooms outward. Handler is passed
*     pinchStatus   Function  A handler triggered for every phase of a pinch. Handler is passed 4 arguments: event : The original event object, phase:The current swipe face, either "start", "move", "end" or "cancel". direction : The swipe direction, either "in" or "out". distance : The distance of the pinch, zoom: the pinch zoom level
*     
*     click     Function  A handler triggered when a user just clicks on the item, rather than swipes it. If they do not move, click is triggered, if they do move, it is not.
*
*     fingers     int     Default 1.  The number of fingers to trigger the swipe, 1 or 2.
*     threshold     int     Default 75. The number of pixels that the user must move their finger by before it is considered a swipe.
*     maxTimeThreshold  int     Default null. Time, in milliseconds, between touchStart and touchEnd must NOT exceed in order to be considered a swipe.
*   triggerOnTouchEnd Boolean Default true If true, the swipe events are triggered when the touch end event is received (user releases finger).  If false, it will be triggered on reaching the threshold, and then cancel the touch event automatically.
*   allowPageScroll String Default "auto". How the browser handles page scrolls when the user is swiping on a touchSwipe object. 
*                   "auto" : all undefined swipes will cause the page to scroll in that direction.
*                   "none" : the page will not scroll when user swipes.
*                   "horizontal" : will force page to scroll on horizontal swipes.
*                   "vertical" : will force page to scroll on vertical swipes.
*   fallbackToMouseEvents   Boolean   Default true  if true mouse events are used when run on a non touch device, false will stop swipes being triggered by mouse events on non tocuh devices
*
*   excludedElements  String  jquery selector that specifies child elements that do NOT trigger swipes. By default, this is one select that removes all input, select, textarea, button and anchor elements as well as any .noSwipe classes.
*
* Methods: To be executed as strings, $el.swipe('disable');
*   disable   Will disable all touch events until enabled again
*   enable    Will re-enable the touch events
*   destroy   Will kill the plugin, and it must be re-instantiated if it needs to be used again
*
* This jQuery plugin will only run on devices running Mobile Webkit based browsers (iOS 2.0+, android 2.2+)
*/
(function ($) {

  //Constants
  var LEFT = "left",
    RIGHT = "right",
    UP = "up",
    DOWN = "down",
    IN = "in",
    OUT = "out",

    NONE = "none",
    AUTO = "auto",

    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",

    ALL_FINGERS = "all",

    PHASE_START = "start",
    PHASE_MOVE = "move",
    PHASE_END = "end",
    PHASE_CANCEL = "cancel",

    SUPPORTS_TOUCH = 'ontouchstart' in window,

    PLUGIN_NS = 'TouchSwipe';



  // Default thresholds & swipe functions
  var defaults = {

    fingers: 1,     // int - The number of fingers to trigger the swipe, 1 or 2. Default is 1.
    threshold: 75,    // int - The number of pixels that the user must move their finger by before it is considered a swipe. Default is 75.

    maxTimeThreshold: null, // int - Time, in milliseconds, between touchStart and touchEnd must NOT exceed in order to be considered a swipe.

    swipe: null,    // Function - A catch all handler that is triggered for all swipe directions. Accepts 2 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down", and the finger count.
    swipeLeft: null,  // Function - A handler that is triggered for "left" swipes. Accepts 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down", the distance of the swipe, and the finger count.
    swipeRight: null,   // Function - A handler that is triggered for "right" swipes. Accepts 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down", the distance of the swipe, and the finger count.
    swipeUp: null,    // Function - A handler that is triggered for "up" swipes. Accepts 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down", the distance of the swipe, and the finger count.
    swipeDown: null,  // Function - A handler that is triggered for "down" swipes. Accepts 3 arguments, the original event object, the direction of the swipe : "left", "right", "up", "down", the distance of the swipe, and the finger count.
    swipeStatus: null,  // Function - A handler triggered for every phase of the swipe. Handler is passed 4 arguments: event : The original event object, phase:The current swipe phase, either "start, "move, "end or "cancel. direction : The swipe direction, either "up", "down", "left" or "right". distance : The distance of the swipe, fingerCount: The finger count.
    
    pinchIn:null,   // Function - A handler triggered for pinch in events. Handler is passed 4 arguments: event : The original event object, direction : The swipe direction, either "in" or "out". distance : The distance of the pinch, zoom: the pinch zoom level
    pinchOut:null,    // Function - A handler triggered for pinch in events. Handler is passed 4 arguments: event : The original event object, direction : The swipe direction, either "in" or "out". distance : The distance of the pinch, zoom: the pinch zoom level
    pinchStatus:null, // Function - A handler triggered for every phase of a pinch. Handler is passed 4 arguments: event : The original event object, phase:The current swipe face, either "start", "move", "end" or "cancel". direction : The swipe direction, either "in" or "out". distance : The distance of the pinch, zoom: the pinch zoom level
    
    
    
    click: null,    // Function - A handler triggered when a user just clicks on the item, rather than swipes it. If they do not move, click is triggered, if they do move, it is not.
    
    
    triggerOnTouchEnd: true, // Boolean, if true, the swipe events are triggered when the touch end event is received (user releases finger).  If false, it will be triggered on reaching the threshold, and then cancel the touch event automatically.
    allowPageScroll: "auto",  /* How the browser handles page scrolls when the user is swiping on a touchSwipe object. 
                    "auto" : all undefined swipes will cause the page to scroll in that direction.
                    "none" : the page will not scroll when user swipes.
                    "horizontal" : will force page to scroll on horizontal swipes.
                    "vertical" : will force page to scroll on vertical swipes.
                  */
    fallbackToMouseEvents: true,  //Boolean, if true mouse events are used when run on a non touch device, false will stop swipes being triggered by mouse events on non tocuh devices
    
    excludedElements:"button, input, select, textarea, a, .noSwipe" //a jquery selector that specifies child elements that do NOT trigger swipes. By default, this is one select that removes all form, input select, button and anchor elements.
  };



  /**
  * Main plugin entry point for jQuery
  * This allows us to pass options object for instantiation,
  * as well as execute methods by name as per jQuery plugin architecture
  */
  $.fn.swipe = function (method) {
    var $this = $(this),
      plugin = $this.data(PLUGIN_NS);

    //Check if we are already instantiated and trying to execute a method 
    if (plugin && typeof method === 'string') {
      if (plugin[method]) {
        return plugin[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.swipe');
      }
    }
    //Else not instantiated and trying to pass init object (or nothing)
    else if (!plugin && (typeof method === 'object' || !method)) {
      return init.apply(this, arguments);
    }

    return $this;
  };

  //Expose our defaults so a user could override the plugin defaults
  $.fn.swipe.defaults = defaults;

  //Expose our phase constants - READ ONLY
  $.fn.swipe.phases = {
    PHASE_START: PHASE_START,
    PHASE_MOVE: PHASE_MOVE,
    PHASE_END: PHASE_END,
    PHASE_CANCEL: PHASE_CANCEL
  };

  //Expose our direction constants - READ ONLY
  $.fn.swipe.directions = {
    LEFT: LEFT,
    RIGHT: RIGHT,
    UP: UP,
    DOWN: DOWN,
    IN : IN,
    OUT: OUT
  };
  
  //Expose our page scroll directions - READ ONLY
  $.fn.swipe.pageScroll = {
    NONE: NONE,
    HORIZONTAL: HORIZONTAL,
    VERTICAL: VERTICAL,
    AUTO: AUTO
  };

  //EXPOSE our fingers values - READ ONLY
  $.fn.swipe.fingers = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    ALL: ALL_FINGERS
  };

  /**
  * Initialise the plugin for each DOM element matched
  * This creates a new instance of the main TouchSwipe class for each DOM element, and then 
  * saves a reference to that instance in the elements data property.
  */
  function init(options) {
    //Prep and extend the options
    if (options && (options.allowPageScroll === undefined && (options.swipe !== undefined || options.swipeStatus !== undefined))) {
      options.allowPageScroll = NONE;
    }

    if (!options) {
      options = {};
    }

    //pass empty object so we dont modify the defaults
    options = $.extend({}, $.fn.swipe.defaults, options);

    //For each element instantiate the plugin
    return this.each(function () {
      var $this = $(this);

      //Check we havent already initialised the plugin
      var plugin = $this.data(PLUGIN_NS);

      if (!plugin) {
        plugin = new touchSwipe(this, options);
        $this.data(PLUGIN_NS, plugin);
      }
    });
  }

  /**
  * Main TouchSwipe Plugin Class
  */
  function touchSwipe(element, options) {
    var useTouchEvents = (SUPPORTS_TOUCH || !options.fallbackToMouseEvents),
      START_EV = useTouchEvents ? 'touchstart' : 'mousedown',
      MOVE_EV = useTouchEvents ? 'touchmove' : 'mousemove',
      END_EV = useTouchEvents ? 'touchend' : 'mouseup',
      CANCEL_EV = 'touchcancel';

    var distance = 0;
    var direction = null;
    var duration = 0;
    var startTouchesDistance=0;
    var endTouchesDistance=0;
    var pinchZoom = 1;
    var pinchDirection=0;
    
    
    //jQuery wrapped element for this instance
    var $element = $(element);

    var phase = "start";

    var fingerCount = 0;    // the current number of fingers being used.  

    //track mouse points / delta
    var fingerData=null;

    //track times
    var startTime = 0;
    var endTime = 0;

    // Add gestures to all swipable areas if supported
    try {
      $element.bind(START_EV, touchStart);
      $element.bind(CANCEL_EV, touchCancel);
    }
    catch (e) {
      $.error('events not supported ' + START_EV + ',' + CANCEL_EV + ' on jQuery.swipe');
    }

    //Public methods
    /**
    * re-enables the swipe plugin with the previous configuration
    */
    this.enable = function () {
      $element.bind(START_EV, touchStart);
      $element.bind(CANCEL_EV, touchCancel);

      return $element;
    };

    /**
    * disables the swipe plugin
    */
    this.disable = function () {
      removeListeners();
      return $element;
    };

    /**
    * Destroy the swipe plugin completely. To use any swipe methods, you must re initialise the plugin.
    */
    this.destroy = function () {
      removeListeners();
      $element.data(PLUGIN_NS, null);
      return $element;
    };


    //Private methods
    /**
    * Event handler for a touch start event. 
    * Stops the default click event from triggering and stores where we touched
    */
    function touchStart(event) {
      //If we already in a touch event (a finger already in use) then ignore subsequent ones..
      if( getTouchInProgress() )
        return;
      
      //Check if this element matches any in the excluded elements selectors,  or its parent is excluded, if so, DONT swipe
      if( $(event.target).closest( options.excludedElements, $element ).length>0 ) 
        return;
        
      //As we use Jquery bind for events, we need to target the original event object
      event = event.originalEvent;
      
      var ret,
        evt = SUPPORTS_TOUCH ? event.touches[0] : event;

      phase = PHASE_START;

      //If we support touches, get the finger count
      if (SUPPORTS_TOUCH) {
        // get the total number of fingers touching the screen
        fingerCount = event.touches.length;
      }
      //Else this is the desktop, so stop the browser from dragging the image
      else {
        event.preventDefault();
      }

      //clear vars..
      distance = 0;
      direction = null;
      pinchDirection=null;
      duration = 0;
      startTouchesDistance=0;
      endTouchesDistance=0;
      pinchZoom = 1;
      fingerData=createFingerData();

      
      // check the number of fingers is what we are looking for, or we are capturing pinches
      if (!SUPPORTS_TOUCH || (fingerCount === options.fingers || options.fingers === ALL_FINGERS) || hasPinches()) {
        // get the coordinates of the touch
        fingerData[0].start.x = fingerData[0].end.x = evt.pageX;
        fingerData[0].start.y = fingerData[0].end.y = evt.pageY;
        startTime = getTimeStamp();
        
        if(fingerCount==2) {
          //Keep track of the initial pinch distance, so we can calculate the diff later
          //Store second finger data as start
          fingerData[1].start.x = fingerData[1].end.x = event.touches[1].pageX;
          fingerData[1].start.y = fingerData[1].end.y = event.touches[1].pageY;
          
          startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start);
        }
        
        if (options.swipeStatus || options.pinchStatus) {
          ret = triggerHandler(event, phase);
        }
      }
      else {
        //A touch with more or less than the fingers we are looking for, so cancel
        touchCancel(event);
        ret = false; // actualy cancel so we dont register event...
      }

      //If we have a return value from the users handler, then return and cancel
      if (ret === false) {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
        return ret;
      }
      else {
        setTouchInProgress(true);
        $element.bind(MOVE_EV, touchMove);
        $element.bind(END_EV, touchEnd);
        
      }
    };

    /**
    * Event handler for a touch move event. 
    * If we change fingers during move, then cancel the event
    */
    function touchMove(event) {
      //As we use Jquery bind for events, we need to target the original event object
      event = event.originalEvent;

      if (phase === PHASE_END || phase === PHASE_CANCEL)
        return;

      var ret,
        evt = SUPPORTS_TOUCH ? event.touches[0] : event;

      //Save the first finger data
      fingerData[0].end.x = SUPPORTS_TOUCH ? event.touches[0].pageX : evt.pageX;
      fingerData[0].end.y = SUPPORTS_TOUCH ? event.touches[0].pageY : evt.pageY;
      
      endTime = getTimeStamp();

      direction = calculateDirection(fingerData[0].start, fingerData[0].end);
      if (SUPPORTS_TOUCH) {
        fingerCount = event.touches.length;
      }

      phase = PHASE_MOVE;

      //If we have 2 fingers get Touches distance as well
      if(fingerCount==2) {
        //Keep track of the initial pinch distance, so we can calculate the diff later
        //We do this here as well as the start event, incase they start with 1 finger, and the press 2 fingers
        if(startTouchesDistance==0) {
          //Store second finger data as start
          fingerData[1].start.x = event.touches[1].pageX;
          fingerData[1].start.y = event.touches[1].pageY;
          
          startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start);
        } else {
          //Store second finger data as end
          fingerData[1].end.x = event.touches[1].pageX;
          fingerData[1].end.y = event.touches[1].pageY;
          
          endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end);
          pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end);
        }
        
        
        pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance);
      }
      
      
      
      if ((fingerCount === options.fingers || options.fingers === ALL_FINGERS) || !SUPPORTS_TOUCH) {
        
        //Check if we need to prevent default evnet (page scroll / pinch zoom) or not
        validateDefaultEvent(event, direction);

        //Distance and duration are all off the main finger
        distance = calculateDistance(fingerData[0].start, fingerData[0].end);
        duration = calculateDuration(fingerData[0].start, fingerData[0].end);

        if (options.swipeStatus || options.pinchStatus) {
          ret = triggerHandler(event, phase);
        }

        //If we trigger whilst dragging, not on touch end, then calculate now...
        if (!options.triggerOnTouchEnd) {
          var cancel = !validateSwipeTime();

          // if the user swiped more than the minimum length, perform the appropriate action
          if (validateSwipeDistance() === true) {
            phase = PHASE_END;
            ret = triggerHandler(event, phase);
          } else if (cancel) {
            phase = PHASE_CANCEL;
            triggerHandler(event, phase);
          }
        }
      }
      else {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
      }

      if (ret === false) {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
      }
    }

    /**
    * Event handler for a touch end event. 
    * Calculate the direction and trigger events
    */
    function touchEnd(event) {
      //As we use Jquery bind for events, we need to target the original event object
      event = event.originalEvent;

      //If we are still in a touch another finger is down, then dont cancel
      if(event.touches && event.touches.length>0)
        return true;
         
      event.preventDefault();

      endTime = getTimeStamp();
      
      //If we have any touches distance data (they pinched at some point) get Touches distance as well
      if(startTouchesDistance!=0) {
        endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end);
        pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance);
        pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end); 
      }
      
      distance = calculateDistance(fingerData[0].start, fingerData[0].end);
      direction = calculateDirection(fingerData[0].start, fingerData[0].end);
      duration = calculateDuration();

      //If we trigger handlers at end of swipe OR, we trigger during, but they didnt trigger and we are still in the move phase
      if (options.triggerOnTouchEnd || (options.triggerOnTouchEnd === false && phase === PHASE_MOVE)) {
        phase = PHASE_END;

        // Validate the types of swipe we are looking for
        //Either we are listening for a pinch, and got one, or we are NOT listening so dont care.
        var hasValidPinchResult = didPinch() || !hasPinches();
        
        //The number of fingers we want were matched, or on desktop we ignore
        var hasCorrectFingerCount = ((fingerCount === options.fingers || options.fingers === ALL_FINGERS) || !SUPPORTS_TOUCH);

        //We have an end value for the finger
        var hasEndPoint = fingerData[0].end.x !== 0;
        
        //Check if the above conditions are met to make this swipe count...
        var isSwipe = (hasCorrectFingerCount && hasEndPoint && hasValidPinchResult);
        
        //If we are in a swipe, validate the time and distance...
        if (isSwipe) {
          var hasValidTime = validateSwipeTime();
          
          //Check the distance meets threshold settings
          var hasValidDistance = validateSwipeDistance();
          
          // if the user swiped more than the minimum length, perform the appropriate action
          // hasValidDistance is null when no distance is set 
          if ((hasValidDistance === true || hasValidDistance === null) && hasValidTime) {
            triggerHandler(event, phase);
          }
          else if (!hasValidTime || hasValidDistance === false) {
            phase = PHASE_CANCEL;
            triggerHandler(event, phase);
          }
        }
        else {
          phase = PHASE_CANCEL;
          triggerHandler(event, phase);
        }
      }
      else if (phase === PHASE_MOVE) {
        phase = PHASE_CANCEL;
        triggerHandler(event, phase);
      }

      $element.unbind(MOVE_EV, touchMove, false);
      $element.unbind(END_EV, touchEnd, false);
      
      setTouchInProgress(false);
    }

    /**
    * Event handler for a touch cancel event. 
    * Clears current vars
    */
    function touchCancel() {
      // reset the variables back to default values
      fingerCount = 0;
      endTime = 0;
      startTime = 0;
      startTouchesDistance=0;
      endTouchesDistance=0;
      pinchZoom=1;
      setTouchInProgress(false);
    }


    /**
    * Trigger the relevant event handler
    * The handlers are passed the original event, the element that was swiped, and in the case of the catch all handler, the direction that was swiped, "left", "right", "up", or "down"
    */
    function triggerHandler(event, phase) {
      var ret = undefined;

      //update status
      if (options.swipeStatus) {
        ret = options.swipeStatus.call($element, event, phase, direction || null, distance || 0, duration || 0, fingerCount);
      }
      
      if (options.pinchStatus && didPinch()) {
        ret = options.pinchStatus.call($element, event, phase, pinchDirection || null, endTouchesDistance || 0, duration || 0, fingerCount, pinchZoom);
      }

      if (phase === PHASE_CANCEL) {
        if (options.click && (fingerCount === 1 || !SUPPORTS_TOUCH) && (isNaN(distance) || distance === 0)) {
          ret = options.click.call($element, event, event.target);
        }
      }
      
      if (phase == PHASE_END) {
        //trigger catch all event handler
        if (options.swipe) {
          ret = options.swipe.call($element, event, direction, distance, duration, fingerCount);
        }
        //trigger direction specific event handlers 
        switch (direction) {
          case LEFT:
            if (options.swipeLeft) {
              ret = options.swipeLeft.call($element, event, direction, distance, duration, fingerCount);
            }
            break;

          case RIGHT:
            if (options.swipeRight) {
              ret = options.swipeRight.call($element, event, direction, distance, duration, fingerCount);
            }
            break;

          case UP:
            if (options.swipeUp) {
              ret = options.swipeUp.call($element, event, direction, distance, duration, fingerCount);
            }
            break;

          case DOWN:
            if (options.swipeDown) {
              ret = options.swipeDown.call($element, event, direction, distance, duration, fingerCount);
            }
            break;
        }
        
        
        switch (pinchDirection) {
          case IN:
            if (options.pinchIn) {
              ret = options.pinchIn.call($element, event, pinchDirection || null, endTouchesDistance || 0, duration || 0, fingerCount, pinchZoom);
            }
            break;
          
          case OUT:
            if (options.pinchOut) {
              ret = options.pinchOut.call($element, event, pinchDirection || null, endTouchesDistance || 0, duration || 0, fingerCount, pinchZoom);
            }
            break;  
        }
      }


      if (phase === PHASE_CANCEL || phase === PHASE_END) {
        //Manually trigger the cancel handler to clean up data
        touchCancel(event);
      }

      return ret;
    }


    /**
    * Checks the user has swipe far enough
    */
    function validateSwipeDistance() {
      if (options.threshold !== null) {
        return distance >= options.threshold;
      }
      return null;
    }



    /**
    * Checks that the time taken to swipe meets the minimum / maximum requirements
    */
    function validateSwipeTime() {
      var result;
      //If no time set, then return true

      if (options.maxTimeThreshold) {
        if (duration >= options.maxTimeThreshold) {
          result = false;
        } else {
          result = true;
        }
      }
      else {
        result = true;
      }

      return result;
    }


    /**
    * Checks direction of the swipe and the value allowPageScroll to see if we should allow or prevent the default behaviour from occurring.
    * This will essentially allow page scrolling or not when the user is swiping on a touchSwipe object.
    */
    function validateDefaultEvent(event, direction) {
      if (options.allowPageScroll === NONE || hasPinches()) {
        event.preventDefault();
      } else {
        var auto = options.allowPageScroll === AUTO;

        switch (direction) {
          case LEFT:
            if ((options.swipeLeft && auto) || (!auto && options.allowPageScroll != HORIZONTAL)) {
              event.preventDefault();
            }
            break;

          case RIGHT:
            if ((options.swipeRight && auto) || (!auto && options.allowPageScroll != HORIZONTAL)) {
              event.preventDefault();
            }
            break;

          case UP:
            if ((options.swipeUp && auto) || (!auto && options.allowPageScroll != VERTICAL)) {
              event.preventDefault();
            }
            break;

          case DOWN:
            if ((options.swipeDown && auto) || (!auto && options.allowPageScroll != VERTICAL)) {
              event.preventDefault();
            }
            break;
        }
      }

    }


    /**
    * Calcualte the duration of the swipe
    */
    function calculateDuration() {
      return endTime - startTime;
    }
    
    /**
    * Calculate the distance between 2 touches (pinch)
    */
    function calculateTouchesDistance(startPoint, endPoint) {
      var diffX = Math.abs(startPoint.x - endPoint.x);
      var diffY = Math.abs(startPoint.y - endPoint.y);
        
      return Math.round(Math.sqrt(diffX*diffX+diffY*diffY));
    }
    
    /**
    * Calculate the zoom factor between the start and end distances
    */
    function calculatePinchZoom(startDistance, endDistance) {
      var percent = (endDistance/startDistance) * 1;
      return percent.toFixed(2);
    }
    
    
    /**
    * Returns the pinch direction, either IN or OUT for the given points
    */
    function calculatePinchDirection() {
      if(pinchZoom<1) {
        return OUT;
      }
      else {
        return IN;
      }
    }
    
    
    /**
    * Calculate the length / distance of the swipe
    * @param finger A finger object containing start and end points
    */
    function calculateDistance(startPoint, endPoint) {
      return Math.round(Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)));
    }

    /**
    * Calcualte the angle of the swipe
    * @param finger A finger object containing start and end points
    */
    function caluculateAngle(startPoint, endPoint) {
      var x = startPoint.x - endPoint.x;
      var y = endPoint.y - startPoint.y;
      var r = Math.atan2(y, x); //radians
      var angle = Math.round(r * 180 / Math.PI); //degrees

      //ensure value is positive
      if (angle < 0) {
        angle = 360 - Math.abs(angle);
      }

      return angle;
    }

    /**
    * Calcualte the direction of the swipe
    * This will also call caluculateAngle to get the latest angle of swipe
    * @param finger A finger object containing start and end points
    */
    function calculateDirection(startPoint, endPoint ) {
      var angle = caluculateAngle(startPoint, endPoint);

      if ((angle <= 45) && (angle >= 0)) {
        return LEFT;
      } else if ((angle <= 360) && (angle >= 315)) {
        return LEFT;
      } else if ((angle >= 135) && (angle <= 225)) {
        return RIGHT;
      } else if ((angle > 45) && (angle < 135)) {
        return DOWN;
      } else {
        return UP;
      }
    }
    

    /**
    * Returns a MS time stamp of the current time
    */
    function getTimeStamp() {
      var now = new Date();
      return now.getTime();
    }

    /**
    * Removes all listeners that were associated with the plugin
    */
    function removeListeners() {
      $element.unbind(START_EV, touchStart);
      $element.unbind(CANCEL_EV, touchCancel);
      $element.unbind(MOVE_EV, touchMove);
      $element.unbind(END_EV, touchEnd);
      setTouchInProgress(false);
    }
    
    /**
     * Returns true if any Pinch events have been registered
     */
    function hasPinches() {
      return options.pinchStatus || options.pinchIn || options.pinchOut;
    }
    
    /**
     * Returns true if we are detecting pinches, and have one
     */
    function didPinch() {
      return pinchDirection && hasPinches();
    }
    

    
    /**
    * gets a data flag to indicate that a touch is in progress
    */
    function getTouchInProgress() {
      return $element.data(PLUGIN_NS+'_intouch') === true ? true : false;
    }
    
    /**
    * Sets a data flag to indicate that a touch is in progress
    */
    function setTouchInProgress(val) {
      val = val===true?true:false;
      $element.data(PLUGIN_NS+'_intouch', val);
    }
    
    function createFingerData() {
      var fingerData=[];
      for (var i=0; i<=5; i++) {
        fingerData.push({
          start:{ x: 0, y: 0 },
          end:{ x: 0, y: 0 },
          delta:{ x: 0, y: 0 }
        });
      }
      
      return fingerData;
    }

  }

})(jQuery);


/**
 * jQuery Cookie
 * 
 */
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};





/*
   --------------------------------
   Infinite Scroll
   --------------------------------
   + https://github.com/paulirish/infinite-scroll
   + version 2.0b2.120519
   + Copyright 2011/12 Paul Irish & Luke Shumard
   + Licensed under the MIT license

   + Documentation: http://infinite-scroll.com/
*/

(function (window, $, undefined) {
  "use strict";

    $.infinitescroll = function infscr(options, callback, element) {
        this.element = $(element);

        // Flag the object in the event of a failed creation
        if (!this._create(options, callback)) {
            this.failed = true;
        }
    };

    $.infinitescroll.defaults = {
        loading: {
            finished: undefined,
            finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>",
      img: "data:image/gif;base64,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",
            msg: null,
            msgText: "<em>Loading the next set of posts...</em>",
            selector: null,
            speed: 'fast',
            start: undefined
        },
        state: {
            isDuringAjax: false,
            isInvalidPage: false,
            isDestroyed: false,
            isDone: false, // For when it goes all the way through the archive.
            isPaused: false,
            currPage: 1
        },
        debug: false,
    behavior: undefined,
        binder: $(window), // used to cache the selector
        nextSelector: "div.navigation a:first",
        navSelector: "div.navigation",
        contentSelector: null, // rename to pageFragment
        extraScrollPx: 150,
        itemSelector: "div.post",
        animate: false,
        pathParse: undefined,
        dataType: 'html',
        appendCallback: true,
        bufferPx: 40,
        errorCallback: function () { },
        infid: 0, //Instance ID
        pixelsFromNavToBottom: undefined,
        path: undefined, // Either parts of a URL as an array (e.g. ["/page/", "/"] or a function that takes in the page number and returns a URL
    prefill: false // When the document is smaller than the window, load data until the document is larger or links are exhausted
  };

    $.infinitescroll.prototype = {

        /*  
            ----------------------------
            Private methods
            ----------------------------
            */

        // Bind or unbind from scroll
        _binding: function infscr_binding(binding) {

            var instance = this,
            opts = instance.options;

            opts.v = '2.0b2.120520';

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_binding_'+opts.behavior] !== undefined) {
                this['_binding_'+opts.behavior].call(this);
                return;
            }

            if (binding !== 'bind' && binding !== 'unbind') {
                this._debug('Binding value  ' + binding + ' not valid');
                return false;
            }

            if (binding === 'unbind') {
                (this.options.binder).unbind('smartscroll.infscr.' + instance.options.infid);
            } else {
                (this.options.binder)[binding]('smartscroll.infscr.' + instance.options.infid, function () {
                    instance.scroll();
                });
            }

            this._debug('Binding', binding);
        },

        // Fundamental aspects of the plugin are initialized
        _create: function infscr_create(options, callback) {

            // Add custom options to defaults
            var opts = $.extend(true, {}, $.infinitescroll.defaults, options);
      this.options = opts;
      var $window = $(window);
      var instance = this;

      // Validate selectors
            if (!instance._validate(options)) {
        return false;
      }

            // Validate page fragment path
            var path = $(opts.nextSelector).attr('href');
            if (!path) {
                this._debug('Navigation selector not found');
                return false;
            }

            // Set the path to be a relative URL from root.
            opts.path = opts.path || this._determinepath(path);

            // contentSelector is 'page fragment' option for .load() / .ajax() calls
            opts.contentSelector = opts.contentSelector || this.element;

            // loading.selector - if we want to place the load message in a specific selector, defaulted to the contentSelector
            opts.loading.selector = opts.loading.selector || opts.contentSelector;

            // Define loading.msg
            opts.loading.msg = opts.loading.msg || $('<div id="infscr-loading"><img alt="Loading..." src="' + opts.loading.img + '" /><div>' + opts.loading.msgText + '</div></div>');

            // Preload loading.img
            (new Image()).src = opts.loading.img;

            // distance from nav links to bottom
            // computed as: height of the document + top offset of container - top offset of nav link
            if(opts.pixelsFromNavToBottom === undefined) {
        opts.pixelsFromNavToBottom = $(document).height() - $(opts.navSelector).offset().top;
      }

      var self = this;

            // determine loading.start actions
            opts.loading.start = opts.loading.start || function() {
                $(opts.navSelector).hide();
                opts.loading.msg
                .appendTo(opts.loading.selector)
                .show(opts.loading.speed, $.proxy(function() {
          this.beginAjax(opts);
        }, self));
            };

            // determine loading.finished actions
            opts.loading.finished = opts.loading.finished || function() {
                opts.loading.msg.fadeOut(opts.loading.speed);
            };

      // callback loading
            opts.callback = function(instance, data, url) {
                if (!!opts.behavior && instance['_callback_'+opts.behavior] !== undefined) {
                    instance['_callback_'+opts.behavior].call($(opts.contentSelector)[0], data, url);
                }

                if (callback) {
                    callback.call($(opts.contentSelector)[0], data, opts, url);
                }

        if (opts.prefill) {
          $window.bind("resize.infinite-scroll", instance._prefill);
        }
            };

      if (options.debug) {
        // Tell IE9 to use its built-in console
        if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log === "object") {
          ["log","info","warn","error","assert","dir","clear","profile","profileEnd"]
            .forEach(function (method) {
              console[method] = this.call(console[method], console);
            }, Function.prototype.bind);
        }
      }

            this._setup();

      // Setups the prefill method for use
      if (opts.prefill) {
        this._prefill();
      }

            // Return true to indicate successful creation
            return true;
        },

    _prefill: function infscr_prefill() {
      var instance = this;
      var $document = $(document);
      var $window = $(window);

      function needsPrefill() {
        return ($document.height() <= $window.height());
      }

      this._prefill = function() {
        if (needsPrefill()) {
          instance.scroll();
        }

        $window.bind("resize.infinite-scroll", function() {
          if (needsPrefill()) {
            $window.unbind("resize.infinite-scroll");
            instance.scroll();
          }
        });
      };

      // Call self after setting up the new function
      this._prefill();
    },

        // Console log wrapper
        _debug: function infscr_debug() {
      if (true !== this.options.debug) {
        return;
      }

      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        // Modern browsers
        // Single argument, which is a string
        if ((Array.prototype.slice.call(arguments)).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === 'string') {
          console.log( (Array.prototype.slice.call(arguments)).toString() );
        } else {
          console.log( Array.prototype.slice.call(arguments) );
        }
      } else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === 'object') {
        // IE8
        Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
      }
        },

        // find the number to increment in the path.
        _determinepath: function infscr_determinepath(path) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_determinepath_'+opts.behavior] !== undefined) {
                return this['_determinepath_'+opts.behavior].call(this,path);
            }

            if (!!opts.pathParse) {

                this._debug('pathParse manual');
                return opts.pathParse(path, this.options.state.currPage+1);

            } else if (path.match(/^(.*?)\b2\b(.*?$)/)) {
                path = path.match(/^(.*?)\b2\b(.*?$)/).slice(1);

                // if there is any 2 in the url at all.    
            } else if (path.match(/^(.*?)2(.*?$)/)) {

                // page= is used in django:
                // http://www.infinite-scroll.com/changelog/comment-page-1/#comment-127
                if (path.match(/^(.*?page=)2(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)2(\/.*|$)/).slice(1);
                    return path;
                }

                path = path.match(/^(.*?)2(.*?$)/).slice(1);

            } else {

                // page= is used in drupal too but second page is page=1 not page=2:
                // thx Jerod Fritz, vladikoff
                if (path.match(/^(.*?page=)1(\/.*|$)/)) {
                    path = path.match(/^(.*?page=)1(\/.*|$)/).slice(1);
                    return path;
                } else {
                    this._debug('Sorry, we couldn\'t parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com.');
                    // Get rid of isInvalidPage to allow permalink to state
                    opts.state.isInvalidPage = true;  //prevent it from running on this page.
                }
            }
            this._debug('determinePath', path);
            return path;

        },

        // Custom error
        _error: function infscr_error(xhr) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_error_'+opts.behavior] !== undefined) {
                this['_error_'+opts.behavior].call(this,xhr);
                return;
            }

            if (xhr !== 'destroy' && xhr !== 'end') {
                xhr = 'unknown';
            }

            this._debug('Error', xhr);

            if (xhr === 'end') {
                this._showdonemsg();
            }

            opts.state.isDone = true;
            opts.state.currPage = 1; // if you need to go back to this instance
            opts.state.isPaused = false;
            this._binding('unbind');

        },

        // Load Callback
        _loadcallback: function infscr_loadcallback(box, data, url) {
            var opts = this.options,
            callback = this.options.callback, // GLOBAL OBJECT FOR CALLBACK
            result = (opts.state.isDone) ? 'done' : (!opts.appendCallback) ? 'no-append' : 'append',
            frag;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_loadcallback_'+opts.behavior] !== undefined) {
                this['_loadcallback_'+opts.behavior].call(this,box,data);
                return;
            }

      switch (result) {
        case 'done':
          this._showdonemsg();
          return false;

        case 'no-append':
          if (opts.dataType === 'html') {
            data = '<div>' + data + '</div>';
            data = $(data).find(opts.itemSelector);
          }
          break;

        case 'append':
          var children = box.children();
          // if it didn't return anything
          if (children.length === 0) {
            return this._error('end');
          }

          // use a documentFragment because it works when content is going into a table or UL
          frag = document.createDocumentFragment();
          while (box[0].firstChild) {
            frag.appendChild(box[0].firstChild);
          }

          this._debug('contentSelector', $(opts.contentSelector)[0]);
          $(opts.contentSelector)[0].appendChild(frag);
          // previously, we would pass in the new DOM element as context for the callback
          // however we're now using a documentfragment, which doesn't have parents or children,
          // so the context is the contentContainer guy, and we pass in an array
          // of the elements collected as the first argument.

          data = children.get();
          break;
      }

            // loadingEnd function
            opts.loading.finished.call($(opts.contentSelector)[0],opts);

            // smooth scroll to ease in the new content
            if (opts.animate) {
                var scrollTo = $(window).scrollTop() + $('#infscr-loading').height() + opts.extraScrollPx + 'px';
                $('html,body').animate({ scrollTop: scrollTo }, 800, function () { opts.state.isDuringAjax = false; });
            }

            if (!opts.animate) {
        // once the call is done, we can allow it again.
        opts.state.isDuringAjax = false;
      }

            callback(this, data, url);

      if (opts.prefill) {
        this._prefill();
      }
    },

        _nearbottom: function infscr_nearbottom() {

            var opts = this.options,
            pixelsFromWindowBottomToBottom = 0 + $(document).height() - (opts.binder.scrollTop()) - $(window).height();

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_nearbottom_'+opts.behavior] !== undefined) {
                return this['_nearbottom_'+opts.behavior].call(this);
            }

            this._debug('math:', pixelsFromWindowBottomToBottom, opts.pixelsFromNavToBottom);

            // if distance remaining in the scroll (including buffer) is less than the orignal nav to bottom....
            return (pixelsFromWindowBottomToBottom - opts.bufferPx < opts.pixelsFromNavToBottom);

        },

        // Pause / temporarily disable plugin from firing
        _pausing: function infscr_pausing(pause) {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_pausing_'+opts.behavior] !== undefined) {
                this['_pausing_'+opts.behavior].call(this,pause);
                return;
            }

            // If pause is not 'pause' or 'resume', toggle it's value
            if (pause !== 'pause' && pause !== 'resume' && pause !== null) {
                this._debug('Invalid argument. Toggling pause value instead');
            }

            pause = (pause && (pause === 'pause' || pause === 'resume')) ? pause : 'toggle';

            switch (pause) {
                case 'pause':
                    opts.state.isPaused = true;
                break;

                case 'resume':
                    opts.state.isPaused = false;
                break;

                case 'toggle':
                    opts.state.isPaused = !opts.state.isPaused;
                break;
            }

            this._debug('Paused', opts.state.isPaused);
            return false;

        },

        // Behavior is determined
        // If the behavior option is undefined, it will set to default and bind to scroll
        _setup: function infscr_setup() {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_setup_'+opts.behavior] !== undefined) {
                this['_setup_'+opts.behavior].call(this);
                return;
            }

            this._binding('bind');

            return false;

        },

        // Show done message
        _showdonemsg: function infscr_showdonemsg() {

            var opts = this.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['_showdonemsg_'+opts.behavior] !== undefined) {
                this['_showdonemsg_'+opts.behavior].call(this);
                return;
            }

            opts.loading.msg
            .find('img')
            .hide()
            .parent()
            .find('div').html(opts.loading.finishedMsg).animate({ opacity: 1 }, 2000, function () {
                $(this).parent().fadeOut(opts.loading.speed);
            });

            // user provided callback when done    
            opts.errorCallback.call($(opts.contentSelector)[0],'done');
        },

        // grab each selector option and see if any fail
        _validate: function infscr_validate(opts) {
            for (var key in opts) {
                if (key.indexOf && key.indexOf('Selector') > -1 && $(opts[key]).length === 0) {
                    this._debug('Your ' + key + ' found no elements.');
                    return false;
                }
            }

            return true;
        },

        /*  
            ----------------------------
            Public methods
            ----------------------------
            */

        // Bind to scroll
        bind: function infscr_bind() {
            this._binding('bind');
        },

        // Destroy current instance of plugin
        destroy: function infscr_destroy() {

            this.options.state.isDestroyed = true;
            return this._error('destroy');

        },

        // Set pause value to false
        pause: function infscr_pause() {
            this._pausing('pause');
        },

        // Set pause value to false
        resume: function infscr_resume() {
            this._pausing('resume');
        },

    beginAjax: function infscr_ajax(opts) {
      var instance = this,
        path = opts.path,
        box, desturl, method, condition;

      // increment the URL bit. e.g. /page/3/
      opts.state.currPage++;

      // if we're dealing with a table we can't use DIVs
      box = $(opts.contentSelector).is('table') ? $('<tbody/>') : $('<div/>');

      desturl = (typeof path === 'function') ? path(opts.state.currPage) : path.join(opts.state.currPage);
      instance._debug('heading into ajax', desturl);

      method = (opts.dataType === 'html' || opts.dataType === 'json' ) ? opts.dataType : 'html+callback';
      if (opts.appendCallback && opts.dataType === 'html') {
        method += '+callback';
      }

      switch (method) {
        case 'html+callback':
          instance._debug('Using HTML via .load() method');
          box.load(desturl + ' ' + opts.itemSelector, undefined, function infscr_ajax_callback(responseText) {
            instance._loadcallback(box, responseText, desturl);
          });

          break;

        case 'html':
          instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
          $.ajax({
            // params
            url: desturl,
            dataType: opts.dataType,
            complete: function infscr_ajax_callback(jqXHR, textStatus) {
              condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
              if (condition) {
                instance._loadcallback(box, jqXHR.responseText, desturl);
              } else {
                instance._error('end');
              }
            }
          });

          break;
        case 'json':
          instance._debug('Using ' + (method.toUpperCase()) + ' via $.ajax() method');
          $.ajax({
            dataType: 'json',
            type: 'GET',
            url: desturl,
            success: function (data, textStatus, jqXHR) {
              condition = (typeof (jqXHR.isResolved) !== 'undefined') ? (jqXHR.isResolved()) : (textStatus === "success" || textStatus === "notmodified");
              if (opts.appendCallback) {
                // if appendCallback is true, you must defined template in options.
                // note that data passed into _loadcallback is already an html (after processed in opts.template(data)).
                if (opts.template !== undefined) {
                  var theData = opts.template(data);
                  box.append(theData);
                  if (condition) {
                    instance._loadcallback(box, theData);
                  } else {
                    instance._error('end');
                  }
                } else {
                  instance._debug("template must be defined.");
                  instance._error('end');
                }
              } else {
                // if appendCallback is false, we will pass in the JSON object. you should handle it yourself in your callback.
                if (condition) {
                  instance._loadcallback(box, data, desturl);
                } else {
                  instance._error('end');
                }
              }
            },
            error: function() {
              instance._debug("JSON ajax request failed.");
              instance._error('end');
            }
          });

          break;
      }
    },

        // Retrieve next set of content items
        retrieve: function infscr_retrieve(pageNum) {
      pageNum = pageNum || null;

      var instance = this,
            opts = instance.options;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['retrieve_'+opts.behavior] !== undefined) {
                this['retrieve_'+opts.behavior].call(this,pageNum);
                return;
            }

            // for manual triggers, if destroyed, get out of here
            if (opts.state.isDestroyed) {
                this._debug('Instance is destroyed');
                return false;
            }

            // we dont want to fire the ajax multiple times
            opts.state.isDuringAjax = true;

            opts.loading.start.call($(opts.contentSelector)[0],opts);
        },

        // Check to see next page is needed
        scroll: function infscr_scroll() {

            var opts = this.options,
            state = opts.state;

            // if behavior is defined and this function is extended, call that instead of default
            if (!!opts.behavior && this['scroll_'+opts.behavior] !== undefined) {
                this['scroll_'+opts.behavior].call(this);
                return;
            }

            if (state.isDuringAjax || state.isInvalidPage || state.isDone || state.isDestroyed || state.isPaused) {
        return;
      }

            if (!this._nearbottom()) {
        return;
      }

            this.retrieve();

        },

        // Toggle pause value
        toggle: function infscr_toggle() {
            this._pausing();
        },

        // Unbind from scroll
        unbind: function infscr_unbind() {
            this._binding('unbind');
        },

        // update options
        update: function infscr_options(key) {
            if ($.isPlainObject(key)) {
                this.options = $.extend(true,this.options,key);
            }
        }
    };


    /*  
        ----------------------------
        Infinite Scroll function
        ----------------------------

        Borrowed logic from the following...

        jQuery UI
        - https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js

        jCarousel
        - https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

        Masonry
        - https://github.com/desandro/masonry/blob/master/jquery.masonry.js   

*/

    $.fn.infinitescroll = function infscr_init(options, callback) {


        var thisCall = typeof options;

        switch (thisCall) {

            // method 
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var instance = $.data(this, 'infinitescroll');

          if (!instance) {
            // not setup yet
            // return $.error('Method ' + options + ' cannot be called until Infinite Scroll is setup');
            return false;
          }

          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            // return $.error('No such method ' + options + ' for Infinite Scroll');
            return false;
          }

          // no errors!
          instance[options].apply(instance, args);
        });

            break;

            // creation 
            case 'object':

                this.each(function () {

                var instance = $.data(this, 'infinitescroll');

                if (instance) {

                    // update options of current instance
                    instance.update(options);

                } else {

                    // initialize new instance
                    instance = new $.infinitescroll(options, callback, this);

                    // don't attach if instantiation failed
                    if (!instance.failed) {
                        $.data(this, 'infinitescroll', instance);
                    }

                }

            });

            break;

        }

        return this;
    };



    /* 
     * smartscroll: debounced scroll event for jQuery *
     * https://github.com/lukeshumard/smartscroll
     * Based on smartresize by @louis_remi: https://github.com/lrbabe/jquery.smartresize.js *
     * Copyright 2011 Louis-Remi & Luke Shumard * Licensed under the MIT license. *
     */

    var event = $.event,
    scrollTimeout;

    event.special.smartscroll = {
        setup: function () {
            $(this).bind("scroll", event.special.smartscroll.handler);
        },
        teardown: function () {
            $(this).unbind("scroll", event.special.smartscroll.handler);
        },
        handler: function (event, execAsap) {
            // Save the context
            var context = this,
            args = arguments;

            // set correct event type
            event.type = "smartscroll";

            if (scrollTimeout) { clearTimeout(scrollTimeout); }
            scrollTimeout = setTimeout(function () {
                $.event.handle.apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartscroll = function (fn) {
        return fn ? this.bind("smartscroll", fn) : this.trigger("smartscroll", ["execAsap"]);
    };


})(window, jQuery);