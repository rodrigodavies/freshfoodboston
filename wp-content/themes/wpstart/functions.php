<?php
/*
 * WPstart functions and definitions.
 *
 * @package WordPress
 * @subpackage WPstart
 */

/* WPstart setup */
function wpstart_setup() {
	/* Background */
	add_theme_support( 'custom-background', array() );

	/* Editor styling */
	add_editor_style();

	/* Feed links and comments RSS to head */
	add_theme_support( 'automatic-feed-links' );

	/* Header management */
	add_theme_support( 'custom-header', array(
		'default-image' => get_template_directory_uri() . '/images/headers/header-image.jpg',
		'width' => apply_filters( 'wpstart_header_image_width', 940 ),
		'height' => apply_filters( 'wpstart_header_image_height', 300 ),
		'default-text-color' => '000',
		'uploads' => true,
		'wp-head-callback' => 'wpstart_header_style',
		'admin-head-callback' => 'wpstart_admin_header_style',
		'admin-preview-callback' => 'wpstart_admin_header_image',
		) );
		
	/* Navigation menu */
	register_nav_menu( 'navigation', __( 'Navigation Menu', 'wpstart' ) );

	/* Post formats */
	add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );

	/* Post thumbnails */
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 150, 150, true ); // default post thumbnails: 150 pixels wide by 150 pixels tall, crop mode
	
	/* Translation */
	load_theme_textdomain( 'wpstart', get_template_directory() . '/languages' );
	$locale = get_locale();
	$locale_file = get_template_directory() . "/languages/$locale.php";
	if ( is_readable( $locale_file ) )
		require_once( $locale_file );
}
add_action( 'after_setup_theme', 'wpstart_setup' );

/* Content width */
if ( ! isset( $content_width ) )
	$content_width = 700;
	
/* Header management: style for site-title and site-description */
if ( !function_exists( 'wpstart_header_style' ) ) :
function wpstart_header_style() {
	if ( HEADER_TEXTCOLOR == get_header_textcolor() )
		return; ?>
	<style type="text/css">
	<?php if ( 'blank' == get_header_textcolor() ) : ?>
		.site-title, .site-description { display:none!important; visibility:hidden!important; }
	<?php else : ?>
		.site-title a, .site-description { color:#<?php echo get_header_textcolor(); ?>!important; }
	<?php endif; ?>
	</style>
<?php } endif;

if ( !function_exists( 'wpstart_admin_header_style' ) ) :
	function wpstart_admin_header_style() { ?>
		<style type="text/css">
		#header { clear:both; padding:20px 0 0; padding:2rem 0 0; }

		#header hgroup { display:inline; float:left; margin-left:10px; margin-right:10px; position:relative; width:940px; }
		h1.site-title { color:#000; font-size:32px; /*font-size:3.2rem;*/ font-weight:bold; line-height:0.75; margin:0 0 0.5rem; }
		h1.site-title a { color:#000; font-size:32px; /*font-size:3.2rem;*/ line-height:0.75; text-decoration:none; }
		h1.site-title a:hover { color:#000; text-decoration:none; }
		h2.site-description { font-size:12px; /*font-size:1.2rem;*/ font-weight:bold; line-height:2; margin:0 0 10px; /*margin:0 0 1rem;*/ padding:0; }

		/* Header image */
		.header-image { display:inline; float:left; margin-left:10px; margin-right:10px; position:relative; width:940px; }
		</style>
	<?php } endif;

/* Header management: appearance page for custom header */	
if ( !function_exists( 'wpstart_admin_header_image' ) ) :
	function wpstart_admin_header_image() { ?>
		<header id="header">
			<hgroup>
				<h1 class="site-title">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
				</h1>
				<h2 class="site-description"><span><?php bloginfo('description'); ?></span></h2>
			</hgroup>		
		
			<?php $header_image = get_header_image();
			if ( ! empty( $header_image ) ) : ?>
				<img src="<?php echo esc_url( $header_image ); ?>" width="<?php echo HEADER_IMAGE_WIDTH; ?>" height="<?php echo HEADER_IMAGE_HEIGHT; ?>" alt="" class="header-image" />
			<?php endif; ?>
		</header>
	<?php } endif;

/* Load content extensions */
require_once( get_template_directory() . '/includes/content-extensions.php');

/* Navigation menu: add home link */
function wpstart_page_menu_args( $args ) {
	$args['show_home'] = true;
	return $args;
}
add_filter( 'wp_page_menu_args', 'wpstart_page_menu_args' );

/* "Read more" link */
if ( !function_exists( 'wpstart_read_more_link' ) ) {
	function wpstart_read_more_link() {
		return ' <a href="'. esc_url( get_permalink() ) . '" class="read-more"><span>' . __( 'More &raquo;', 'wpstart' ) . '</span></a>';
	}
}

/* "Read more" link: replace "[...]" with "..." in automatically generated excerpts */
if ( !function_exists( 'wpstart_auto_excerpt_more' ) ) {
	function wpstart_auto_excerpt_more( $more ) {
		return '&hellip;' . wpstart_read_more_link();
	}
}
add_filter( 'excerpt_more', 'wpstart_auto_excerpt_more' );

/* "Read more" link: add "Read more" link to custom post excerpts. */
if ( !function_exists( 'wpstart_custom_excerpt_more' ) ) {
	function wpstart_custom_excerpt_more( $output ) {
		if ( has_excerpt() && ! is_attachment() ) {
			$output .= wpstart_read_more_link();
		}
		return $output;
	}
}
add_filter( 'get_the_excerpt', 'wpstart_custom_excerpt_more' );

/* Widgetized areas */
function wpstart_widgets_init() {
	// Sidebar 1
	register_sidebar( array(
		'name' => __( 'Sidebar 1', 'wpstart' ),
		'id' => 'sidebar-1',
		'description' => __( 'Sidebar 1', 'wpstart' ),
		'before_widget' => '<aside id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
	
	// Sidebar 2
	register_sidebar( array(
		'name' => __( 'Sidebar 2', 'wpstart' ),
		'id' => 'sidebar-2',
		'description' => __( 'Sidebar 2', 'wpstart' ),
		'before_widget' => '<aside id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
		
	// Footer 1
	register_sidebar( array(
		'name' => __( 'Footer 1', 'wpstart' ),
		'id' => 'footer-1',
		'description' => __( 'Footer 1', 'wpstart' ),
		'before_widget' => '<aside id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Footer 2
	register_sidebar( array(
		'name' => __( 'Footer 2', 'wpstart' ),
		'id' => 'footer-2',
		'description' => __( 'Footer 2', 'wpstart' ),
		'before_widget' => '<aside id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Footer 3
	register_sidebar( array(
		'name' => __( 'Footer 3', 'wpstart' ),
		'id' => 'footer-3',
		'description' => __( 'Footer 3', 'wpstart' ),
		'before_widget' => '<aside id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
	
	// Footer 4
	register_sidebar( array(
		'name' => __( 'Footer 4', 'wpstart' ),
		'id' => 'footer-4',
		'description' => __( 'Footer 4', 'wpstart' ),
		'before_widget' => '<aside id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
	
	// Colophon
	register_sidebar( array(
		'name' => __( 'Colophon', 'wpstart' ),
		'id' => 'colophon',
		'description' => __( 'Colophon', 'wpstart' ),
		'before_widget' => '<aside id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
}
add_action( 'widgets_init', 'wpstart_widgets_init' );


/**
 * WPstart actions.
 */

/* Head */
add_action( 'wpstart_head', 'wpstart_head', 10 );

/* Before header */
add_action( 'wpstart_before_header', 'wpstart_before_header', 10 );

/* Header */
add_action( 'wpstart_header', 'wpstart_header_content', 10 );
add_action( 'wpstart_header', 'wpstart_header_image', 20 );

/* After header */
add_action( 'wpstart_after_header', 'wpstart_after_header', 10 );
add_action( 'wpstart_after_header', 'wpstart_nav', 20 );

/* Before main */
add_action( 'wpstart_before_main', 'wpstart_before_main', 10 );

/* Before container */
add_action( 'wpstart_before_container', 'wpstart_before_container', 10 );

/* Before content */
add_action ( 'wpstart_before_content', 'wpstart_before_content', 10 );

/* Posts */
// wpstart_before_post_loop
add_action( 'wpstart_post_before_entry_content', 'wpstart_post_entry_header', 10 );
add_action( 'wpstart_post_entry_summary', 'wpstart_post_entry_summary', 10 );
add_action( 'wpstart_post_after_entry_content', 'wpstart_post_entry_footer', 10 );
add_action( 'wpstart_after_post_loop', 'wpstart_post_pagination', 10 );
add_action( 'wpstart_post_no_results_not_found', 'wpstart_post_no_results_not_found', 10 );

/* Single */
add_action( 'wpstart_before_single_post', 'wpstart_before_single_post', 10 );
add_action( 'wpstart_single_before_entry_content', 'wpstart_single_entry_header', 10 );
add_action( 'wpstart_single_entry_content', 'wpstart_single_entry_content', 10 );
add_action( 'wpstart_single_after_entry_content', 'wpstart_single_entry_footer', 10 );
add_action( 'wpstart_after_single_post', 'wpstart_after_single_post', 10 );
add_action( 'wpstart_after_single_post', 'wpstart_single_entry_navigation', 20 );

/* Attachment */
add_action( 'wpstart_before_attachment_post', 'wpstart_before_attachment_post', 10 );
add_action( 'wpstart_attachment_before_entry_content', 'wpstart_attachment_entry_header', 10 );
add_action( 'wpstart_attachment_entry_content', 'wpstart_attachment_entry_content', 10 );
add_action( 'wpstart_attachment_after_entry_content', 'wpstart_attachment_entry_footer', 10 );
add_action( 'wpstart_after_attachment_post', 'wpstart_after_attachment_post', 10 );
add_action( 'wpstart_after_attachment_post', 'wpstart_attachment_navigation', 20 );

/* Page */
add_action( 'wpstart_before_page_post', 'wpstart_before_page_post', 10 );
add_action( 'wpstart_page_before_entry_content', 'wpstart_page_entry_header', 10 );
add_action( 'wpstart_page_entry_content', 'wpstart_page_entry_content', 10 );
// wpstart_page_after_entry_content
add_action( 'wpstart_after_page_post', 'wpstart_after_page_post', 10 );

/* After content */
add_action ( 'wpstart_after_content', 'wpstart_after_content', 10 );

/* After container */
add_action ( 'wpstart_after_container', 'wpstart_after_container', 10 );

/* After main */
add_action( 'wpstart_after_main', 'wpstart_after_main', 10 );

/* Before footer */
add_action( 'wpstart_before_footer', 'wpstart_before_footer', 10 );

/* Footer */
add_action( 'wpstart_footer', 'wpstart_footer_content', 10 );

/* After footer */
add_action( 'wpstart_after_footer', 'wpstart_after_footer', 10 );

/* General */
add_action( 'wpstart_page_title', 'wpstart_page_title', 10 );
add_action( 'wpstart_search_form', 'wpstart_search_form', 10 );
add_action( 'wpstart_search_no_results_not_found', 'wpstart_search_no_results_not_found', 10 );

?>