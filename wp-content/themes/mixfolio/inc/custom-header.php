<?php
/**
 * Sample implementation of the Custom Header feature
 * http://codex.wordpress.org/Custom_Headers
 *
 * You can add an optional custom header image to header.php like so ...

	<?php $header_image = get_header_image();
	if ( ! empty( $header_image ) ) { ?>
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
			<img src="<?php header_image(); ?>" width="<?php echo get_custom_header()->width; ?>" height="<?php echo get_custom_header()->height; ?>" alt="" />
		</a>
	<?php } // if ( ! empty( $header_image ) ) ?>

 *
 * @package Mixfolio
 * @since Mixfolio 1.1
 */

/**
 * Setup the WordPress core custom header feature.
 *
 * Use add_theme_support to register support for WordPress 3.4+
 * as well as provide backward compatibility for previous versions.
 * Use feature detection of wp_get_theme() which was introduced
 * in WordPress 3.4.
 *
 * @uses mixfolio_header_style()
 * @uses mixfolio_admin_header_style()
 * @uses mixfolio_admin_header_image()
 *
 * @package Mixfolio
 */
function mixfolio_custom_header_setup() {
	$args = array(
		'width'                  => 980,
		'height'                 => 275,
		'header-text'			 => false,
		'flex-height'            => true,
		'flex-width'			 => true,
		'wp-head-callback'       => 'mixfolio_header_style',
		'admin-head-callback'    => 'mixfolio_admin_header_style',
		'admin-preview-callback' => 'mixfolio_admin_header_image',
	);

	$args = apply_filters( 'mixfolio_custom_header_args', $args );

	if ( function_exists( 'wp_get_theme' ) ) {
		add_theme_support( 'custom-header', $args );
	} else {
		// Compat: Versions of WordPress prior to 3.4.
		define( 'HEADER_TEXTCOLOR', '' );
		define( 'NO_HEADER_TEXT', true );
		define( 'HEADER_IMAGE', '' );
		define( 'HEADER_IMAGE_WIDTH', $args[ 'width' ] );
		define( 'HEADER_IMAGE_HEIGHT', $args[ 'height' ] );
		add_custom_image_header( $args[ 'wp-head-callback' ], $args[ 'admin-head-callback' ], $args[ 'admin-preview-callback' ] );
	}
}
add_action( 'after_setup_theme', 'mixfolio_custom_header_setup' );

/**
 * Shiv for get_custom_header().
 *
 * get_custom_header() was introduced to WordPress
 * in version 3.4. To provide backward compatibility
 * with previous versions, we will define our own version
 * of this function.
 *
 * @return stdClass All properties represent attributes of the curent header image.
 *
 * @package Mixfolio
 * @since Mixfolio 1.1
 */

if ( ! function_exists( 'get_custom_header' ) ) {
	function get_custom_header() {
		return (object) array(
			'url'           => get_header_image(),
			'thumbnail_url' => get_header_image(),
			'width'         => HEADER_IMAGE_WIDTH,
			'height'        => HEADER_IMAGE_HEIGHT,
		);
	}
}

if ( ! function_exists( 'mixfolio_header_style' ) ) :
/**
 * Styles the header image and text displayed on the blog
 *
 * @see mixfolio_custom_header_setup().
 *
 * @since Mixfolio 1.1
 */
function mixfolio_header_style() {

	// If no custom options for text are set, let's bail
	// get_header_textcolor() options: HEADER_TEXTCOLOR is default, hide text (returns 'blank') or any hex value
	$header_image = get_header_image();
	if ( false === $header_image )
		return;
	// If we get this far, we have custom styles. Let's do this.
	?>
	<style type="text/css">
		.header-image img {
			-webkit-border-radius: 3px;
			border-radius: 3px;
			display: block;
			margin: 0 auto 20px;
		}
	</style>
	<?php
}
endif; // mixfolio_header_style

if ( ! function_exists( 'mixfolio_admin_header_style' ) ) :
/**
 * Styles the header image displayed on the Appearance > Header admin panel.
 *
 * @see mixfolio_custom_header_setup().
 *
 * @since Mixfolio 1.1
 */
function mixfolio_admin_header_style() {
?>
	<style type="text/css">
		.appearance_page_custom-header #headimg {
			border: none;
			width: 980px;
		}
		#headimg img {
			-webkit-border-radius: 3px;
			border-radius: 3px;
			display: block;
		}
	</style>
<?php
}
endif; // mixfolio_admin_header_style

if ( ! function_exists( 'mixfolio_admin_header_image' ) ) :
/**
 * Custom header image markup displayed on the Appearance > Header admin panel.
 *
 * @see mixfolio_custom_header_setup().
 *
 * @since Mixfolio 1.1
 */
function mixfolio_admin_header_image() { ?>
	<div id="headimg">
		<?php $header_image = get_header_image();
			if ( ! empty( $header_image ) ) : ?>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
					<img src="<?php echo esc_url( $header_image ); ?>" alt="" />
				</a>
		<?php endif; ?>
	</div><!-- #headimg -->
<?php }
endif; // mixfolio_admin_header_image