<?php

//////////////////////////////////////////
// Set the content width based on the theme's design and stylesheet.
if ( ! isset( $content_width ) )
	$content_width = 550;

//////////////////////////////////////////
// Set Widgets
function birdtips_widgets_init() {

	if ( function_exists('register_sidebar') ){

		register_sidebar( array (
			'name' => __('Widget Area for left sidebar', 'birdtips'),
			'id' => 'widget-area-left',
			'description' => __('Widget Area for left sidebar', 'birdtips'),
			'before_widget' => '<div class="widget">',
			'after_widget' => '</div>',
			'before_title' => '<h3>',
			'after_title' => '</h3>',
			) );

		register_sidebar( array (
			'name' => __('Widget Area for right sidebar', 'birdtips'),
			'id' => 'widget-area-right',
			'description' => __('Widget Area for right sidebar', 'birdtips'),
			'before_widget' => '<div class="widget">',
			'after_widget' => '</div>',
			'before_title' => '<h3>',
			'after_title' => '</h3>',
			) );
	}
}

//////////////////////////////////////////
// SinglePage Comment callback
function birdtips_custom_comments( $comment, $args, $depth ) {

	$GLOBALS['comment'] = $comment;

?>
	<li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">

	<?php if('pingback' == $comment->comment_type || 'trackback' == $comment->comment_type):
		$birstips_url    = get_comment_author_url();
		$birstips_author = get_comment_author();
	 ?> 

		<div class="posted"><strong><?php _e( 'Pingback', 'birdtips' ); ?> : </strong><a href="<?php echo $birstips_url; ?>" target="_blank"><?php echo $birstips_author ?></a><?php edit_comment_link( __('(Edit)', 'birdtips'), ' ' ); ?></div>

	<?php else: ?>

		<div class="comment_meta">
			<?php echo get_avatar( $comment, 40 ); ?>
			<span class="author"><?php comment_author(); ?></span>
			<span class="time"><?php echo get_comment_time(get_option('date_format') .' ' .get_option('time_format')); ?></span>
			<span class="reply"><?php comment_reply_link( array_merge( $args, array( 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?></span>
		</div>
		<?php if ( $comment->comment_approved == '0' ) : ?>
			<em><?php _e( 'Your comment is awaiting moderation.', 'birdtips' ); ?></em><br>
		<?php endif; ?>

		<div class="comment_text">
			<?php comment_text(); ?>

			<?php $birdtips_web = get_comment_author_url(); ?>
			<?php if(!empty($birdtips_web)): ?>
				<p class="web"><a href="<?php echo $birdtips_web; ?>" target="_blank"><?php echo $birdtips_web; ?></a></p>
			<?php endif; ?>
		</div>

	<?php endif; ?>
<?php
	// no "</li>" conform WORDPRESS
}

//////////////////////////////////////////////////////
// Pagenation
function birdtips_the_pagenation() {

	global $wp_rewrite;
	global $wp_query;
	global $paged;

	$birdtips_paginate_base = get_pagenum_link(1);
	if (strpos($birdtips_paginate_base, '?') || ! $wp_rewrite->using_permalinks()) {
		$birdtips_paginate_format = '';
		$birdtips_paginate_base = add_query_arg('paged', '%#%');
	} else {
		$birdtips_paginate_format = (substr($birdtips_paginate_base, -1 ,1) == '/' ? '' : '/') .
		user_trailingslashit('page/%#%/', 'paged');;
		$birdtips_paginate_base .= '%_%';
	}
	echo paginate_links( array(
		'base' => $birdtips_paginate_base,
		'format' => $birdtips_paginate_format,
		'total' => $wp_query->max_num_pages,
		'mid_size' => 3,
		'current' => ($paged ? $paged : 1),
	));
}

//////////////////////////////////////////////////////
// Search form
function birdtips_search_form( $form ) {

	$birdtips_search_string = '';
	if(is_search()){
		$birdtips_search_string = get_search_query();
	}

	$birdtips_form = '<form method="get" id="searchform" action="' .home_url( '/' ) .'">
			<div id="qsearch">
				<input type="text" name="s" id="s" value="' .$birdtips_search_string .'">
				<input class="btn" alt="' .__('Search', 'birdtips') .'" type="image" src="' .get_template_directory_uri() .'/images/icon_search.png" title="' .__('Search', 'birdtips') .'" id="searchsubmit" value="' . __('Search', 'birdtips') .'" onClick="void(this.form.submit());return false;">
			</div>
	    </form>';

    return $birdtips_form;
}

//////////////////////////////////////////
// Topic Path
function birdtips_the_pankuzu_category() {

	if(is_attachment()){
		global $post;
		$birdtips_parent_id = $post->post_parent;
		$birdtips_parent_post = get_post($birdtips_parent_id);
		echo '<a href="' .get_permalink($birdtips_parent_id) .'">' .$birdtips_parent_post->post_title ,'</a>&raquo;';
	}
	else if(is_single()){
		foreach((get_the_category()) as $birdtips_cat) {
			$birdtips_html = '<a href="' .get_category_link($birdtips_cat->cat_ID) .'">' .$birdtips_cat->cat_name .'</a>&raquo;';
			echo $birdtips_html;
			break;
		}
	}
	elseif(is_archive()){
		birdtips_the_archivetitle();
	}
}

//////////////////////////////////////////
// Archive PageTitle
function birdtips_the_archivetitle() {

	if(is_category()) {
		printf(__('Category Archives: %s', 'birdtips'), single_cat_title('', false));
	}
	elseif( is_tag() ) {
		printf(__('Tag Archives: %s', 'birdtips'), single_tag_title('', false) );
	}
	elseif (is_day()) {
		printf(__('Daily Archives: %s', 'birdtips'), get_post_time(get_option('date_format')));
	}
	elseif (is_month()) {
		printf(__('Monthly Archives: %s', 'birdtips'), get_post_time(__('F, Y', 'birdtips')));
	}
	elseif (is_year()) {
		printf(__('Yearly Archives: %s', 'birdtips'), get_post_time(__('Y', 'birdtips')));
	}
	elseif (is_author()) {
		printf(__('Author Archives: %s', 'birdtips'), get_the_author_meta('display_name', get_query_var('author')) );
	}
	elseif (isset($_GET['paged']) && !empty($_GET['paged'])) {
		_e('Blog Archives', 'birdtips');
	}
}

//////////////////////////////////////////////////////
// Date
function birdtips_the_date() {

	$birdtips_html = '';
	$birdtips_posted = date(__('M. j, Y', 'birdtips'),  strtotime(get_the_time("Y-m-d")));
	$birdtips_date = explode(' ', $birdtips_posted);
	foreach($birdtips_date as $birdtips_d){
		$birdtips_html .= '<span>' .$birdtips_d .'</span>';
	}

	echo $birdtips_html;

}

//////////////////////////////////////////////////////
// Header Style
function birdtips_header_style() {

?>

<style type="text/css">

<?php
	if ( 'blank' == get_header_textcolor() ) { ?>
		#header #site-title,
		#header #site-description {
			position: absolute !important;
			clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
			clip: rect(1px, 1px, 1px, 1px);
			}   
	<?php } else { ?>
		#header h1 a,
		#header #site-title a,
		#header p {
			color: #<?php header_textcolor();?>;
			}
		<?php } ?>

</style>

<?php 

}

//////////////////////////////////////////////////////
// Admin Header Style
function birdtips_admin_header_style() {
?>

<style type="text/css">

	#birdtips_header {
		position: relative;
	    height: 200px;
		}

	#birdtips_header.no-image {
		position: static;
		height: auto;
		}

	#birdtips_header img {
		width: <?php echo HEADER_IMAGE_WIDTH; ?>px;
		height: <?php echo HEADER_IMAGE_HEIGHT; ?>px;
		}

	#birdtips_header #hgroup {
		position: absolute;
		left: 75px;
		top: 0;
		width: 90%;
		}

	#birdtips_header.no-image #hgroup {
		position: static;
		margin-left: 75px;
		}

	#birdtips_header #site-title {
		margin: 0;
		padding: 0.8em 0 0 0;
		color: #<?php header_textcolor();?>;
		font-size: 220%;
		line-height: 1;
		}

	#birdtips_header #site-title a {
		color: #<?php header_textcolor();?>;
	    font-weight: bold;
	    text-decoration: none;
		}

	#birdtips_header #site-description {
		color: #<?php header_textcolor();?>;
		}

</style>

<?php

} 

//////////////////////////////////////////////////////
// Admin Header Image
function birdtips_admin_header_image() {

	$header_image = get_header_image();
	$birdtips_image_tag = '';
	if ( empty( $header_image ) ){
		$birdtips_image_tag = ' class="no-image"'; 
	}

?>
	<div id="birdtips_header"<?php echo $birdtips_image_tag; ?>>

<?php
	$header_image = get_header_image();
	if ( ! empty( $header_image ) ) : ?>

		<img src="<?php echo esc_url( $header_image ); ?>" alt="" />

	<?php endif; ?>

		<div id="hgroup">

<?php
	$style = '';
	if ( 'blank' == get_theme_mod( 'header_textcolor', HEADER_TEXTCOLOR ) || '' == get_theme_mod( 'header_textcolor', HEADER_TEXTCOLOR ) ){
		$style = ' style="display:none;"';
	}
?>
			<div id="site-title"><a <?php echo $style; ?> onclick="return false;" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a></div>
			<div id="site-description" <?php echo $style; ?>><?php bloginfo( 'description' ); ?></div>

		</div>
	</div>
	<?php
}

//////////////////////////////////////////////////////
// Setup Theme
function birdtips_setup() {

	// Set languages
	load_theme_textdomain( 'birdtips', get_template_directory() . '/languages' );

	// This theme styles the visual editor with editor-style.css to match the theme style.
	add_editor_style();

	// Load up our theme options page and related code.
	require( dirname( __FILE__ ) . '/inc/theme-options.php' );

	// Set feed
	add_theme_support( 'automatic-feed-links' );

	// This theme uses post thumbnails
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => __( 'Primary Navigation', 'birdtips' ),
	) );

	// This theme allows users to set a custom background
	add_custom_background();

	// Add a way for the custom header
	define( 'HEADER_TEXTCOLOR', 'CCC' );
	define( 'HEADER_IMAGE', '%s/images/headers/green.jpg' );
	define( 'HEADER_IMAGE_WIDTH', apply_filters( 'my_header_image_width', 1075 ) );
	define( 'HEADER_IMAGE_HEIGHT', apply_filters( 'my_header_image_height', 200 ) );
	add_custom_image_header( 'birdtips_header_style', 'birdtips_admin_header_style', 'birdtips_admin_header_image' );

	register_default_headers( array(
		'green' => array(
			'url' => '%s/images/headers/green.jpg',
			'thumbnail_url' => '%s/images/headers/green-thumbnail.jpg',
			'description' => 'Green'
		),
		'blue' => array(
			'url' => '%s/images/headers/blue.jpg',
			'thumbnail_url' => '%s/images/headers/blue-thumbnail.jpg',
			'description' => 'Blue'
		),
		'yellow' => array(
			'url' => '%s/images/headers/yellow.jpg',
			'thumbnail_url' => '%s/images/headers/yellow-thumbnail.jpg',
			'description' => 'Yellow'
		),
		'red' => array(
			'url' => '%s/images/headers/red.jpg',
			'thumbnail_url' => '%s/images/headers/red-thumbnail.jpg',
			'description' => 'Red'
		),
		'white' => array(
			'url' => '%s/images/headers/white.jpg',
			'thumbnail_url' => '%s/images/headers/white-thumbnail.jpg',
			'description' => 'White'
		),
		'orange' => array(
			'url' => '%s/images/headers/orange.jpg',
			'thumbnail_url' => '%s/images/headers/orange-thumbnail.jpg',
			'description' => 'Orange'
		),
		'pink' => array(
			'url' => '%s/images/headers/pink.jpg',
			'thumbnail_url' => '%s/images/headers/pink-thumbnail.jpg',
			'description' => 'Pink'
		),
		'purple' => array(
			'url' => '%s/images/headers/purple.jpg',
			'thumbnail_url' => '%s/images/headers/purple-thumbnail.jpg',
			'description' => 'Purple'
		),
	) );
}

//////////////////////////////////////////////////////
// Document Title
function birdtips_title( $title ) {
	global $page, $paged;

	$title .= get_bloginfo( 'name' );
	$site_description = get_bloginfo( 'description', 'display' );

	if ( $site_description && ( is_home() || is_front_page() ) )
		$title .= " | $site_description";

	if ( $paged >= 2 || $page >= 2 )
		$title .= ' | ' . sprintf( __( 'Page %s', 'birdtips' ), max( $paged, $page ) );

	return $title;
}

//////////////////////////////////////////////////////
// Enqueue Acripts
function birdtips_scripts() {

	if ( is_singular() && comments_open() && get_option('thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	wp_enqueue_script('jquery');  
	wp_enqueue_script( 'birdtips', get_template_directory_uri() .'/js/birdtips.js', 'jquery', '1.03' );
}

//////////////////////////////////////////////////////
// Action Hook
add_action( 'widgets_init', 'birdtips_widgets_init' );  
add_action( 'after_setup_theme', 'birdtips_setup' );  
add_action( 'wp_enqueue_scripts', 'birdtips_scripts' );
add_filter( 'get_search_form', 'birdtips_search_form' );
add_filter( 'wp_title', 'birdtips_title' );
add_theme_support( 'automatic-feed-links' );
