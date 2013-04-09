<?php
/**
 * BirdTIPS Theme Options
 *
 * @package WordPress
 * @subpackage BirdTIPS
 * @since BirdTIPS 1.0
 */

/**
 * Properly enqueue styles and scripts for our theme options page.
 *
 * This function is attached to the admin_enqueue_scripts action hook.
 *
 * @since BirdTIPS 1.0
 *
 */
function birdtips_admin_enqueue_scripts( $hook_suffix ) {
	wp_enqueue_style( 'birdtips-theme-options', get_template_directory_uri() . '/inc/theme-options.css', false, '2011-04-28' );
	wp_enqueue_script( 'birdtips-theme-options', get_template_directory_uri() . '/inc/theme-options.js', array( 'farbtastic' ), '2011-06-10' );
	wp_enqueue_style( 'farbtastic' );
}
add_action( 'admin_print_styles-appearance_page_theme_options', 'birdtips_admin_enqueue_scripts' );

/**
 * Register the form setting for our birdtips_options array.
 *
 * This function is attached to the admin_init action hook.
 *
 * This call to register_setting() registers a validation callback, birdtips_theme_options_validate(),
 * which is used when the option is saved, to ensure that our option values are complete, properly
 * formatted, and safe.
 *
 * We also use this function to add our theme option if it doesn't already exist.
 *
 * @since BirdTIPS 1.0
 */
function birdtips_theme_options_init() {

	// If we have no options in the database, let's add them now.
	if ( false === birdtips_get_theme_options() )
		add_option( 'birdtips_theme_options', birdtips_get_default_theme_options() );

	register_setting(
		'birdtips_options',       // Options group, see settings_fields() call in theme_options_render_page()
		'birdtips_theme_options', // Database option, see birdtips_get_theme_options()
		'birdtips_theme_options_validate' // The sanitization callback, see birdtips_theme_options_validate()
	);
}
add_action( 'admin_init', 'birdtips_theme_options_init' );

/**
 * Change the capability required to save the 'birdtips_options' options group.
 *
 * @see birdtips_theme_options_init() First parameter to register_setting() is the name of the options group.
 * @see birdtips_theme_options_add_page() The edit_theme_options capability is used for viewing the page.
 *
 * By default, the options groups for all registered settings require the manage_options capability.
 * This filter is required to change our theme options page to edit_theme_options instead.
 * By default, only administrators have either of these capabilities, but the desire here is
 * to allow for finer-grained control for roles and users.
 *
 * @param string $capability The capability used for the page, which is manage_options by default.
 * @return string The capability to actually use.
 */
function birdtips_option_page_capability( $capability ) {
	return 'edit_theme_options';
}
add_filter( 'option_page_capability_birdtips_options', 'birdtips_option_page_capability' );

/**
 * Add our theme options page to the admin menu, including some help documentation.
 *
 * This function is attached to the admin_menu action hook.
 *
 * @since BirdTIPS 1.0
 */
function birdtips_theme_options_add_page() {
	$theme_page = add_theme_page(
		__( 'Theme Options', 'birdtips' ), // Name of page
		__( 'Theme Options', 'birdtips' ), // Label in menu
		'edit_theme_options',                  // Capability required
		'theme_options',                       // Menu slug, used to uniquely identify the page
		'theme_options_render_page'            // Function that renders the options page
	);

	if ( ! $theme_page )
		return;

	add_action( "load-$theme_page", 'birdtips_theme_options_help' );
}

function birdtips_theme_options_help() {

	$help = '<p>' . __( 'Some themes provide customization options that are grouped together on a Theme Options screen. If you change themes, options may change or disappear, as they are theme-specific. Your current theme, BirdTIPS, provides the following Theme Options:', 'birdtips' ) . '</p>' .
			'<ol>' .
				'<li>' . __( '<strong>Link Color</strong>: You can choose the color used for text links on your site. You can enter the HTML color or hex code, or you can choose visually by clicking the "Select a Color" button to pick from a color wheel.', 'birdtips' ) . '</li>' .
				'<li>' . __( '<strong>Article Title Color</strong>: You can choose the color used for article titles on your site. You can enter the HTML color or hex code, or you can choose visually by clicking the "Select a Color" button to pick from a color wheel.', 'birdtips' ) . '</li>' .
				'<li>' . __( '<strong>Navigation Menu Color</strong>: You can choose the color used for navigation menu on your site. You can enter the HTML color or hex code, or you can choose visually by clicking the "Select a Color" button to pick from a color wheel.', 'birdtips' ) . '</li>' .
			'</ol>' .
			'<p>' . __( 'Remember to click "Save Changes" to save any changes you have made to the theme options.', 'birdtips' ) . '</p>';

	$sidebar = '<p><strong>' . __( 'For more information:', 'birdtips' ) . '</strong></p>' .
		'<p><a href="http://codex.wordpress.org/Appearance_Theme_Options_Screen" target="_blank">' . __( 'Documentation on Theme Options', 'birdtips' ) . '</a></p>' .
		'<p><a href="http://wordpress.org/support/" target="_blank">' . __( 'Support Forums', 'birdtips' ) . '</a></p>';

	$screen = get_current_screen();
	if ( method_exists( $screen, 'add_help_tab' ) ) {
		// WordPress 3.3
		$screen->add_help_tab( array(
			'title' => __( 'Overview', 'birdtips' ),
			'id' => 'theme-options-help',
			'content' => $help,
			)
		);

		$screen->set_help_sidebar( $sidebar );
	} else {
		// WordPress 3.2
		add_contextual_help( $screen, $help . $sidebar );
	}

}
add_action( 'admin_menu', 'birdtips_theme_options_add_page' );


/**
 * Returns an array of color schemes registered for Twenty Eleven.
 *
 * @since Twenty Eleven 1.0
 */
function birdtips_color_schemes() {
	$color_scheme_options = array(
		'default_link_color' => '#0066aa',
		'default_article_title_color' => '#dd6633',
		'default_navigation_color' => '#cccccc'
	);

	return apply_filters( 'birdtips_color_schemes', $color_scheme_options );
}

/**
 * Returns the default options for BirdTIPS.
 *
 * @since BirdTIPS 1.0
 */
function birdtips_get_default_theme_options() {
	$default_theme_options = array(
		'link_color'   => birdtips_get_default_link_color(),
		'article_title_color'   => birdtips_get_default_article_title_color(),
		'navigation_color'   => birdtips_get_default_navigation_color()
	);

	return apply_filters( 'birdtips_default_theme_options', $default_theme_options );
}

/**
 * Returns the default link color for BirdTIPS, based on color scheme.
 *
 * @since BirdTIPS 1.0
 *
 * @param $string $color_scheme Color scheme. Defaults to the active color scheme.
 * @return $string Color.
*/
function birdtips_get_default_link_color() {

	$color_schemes = birdtips_color_schemes();
	return $color_schemes['default_link_color'];
}

/**
 * Returns the default navigation menu color for BirdTIPS, based on color scheme.
 *
 * @since BirdTIPS 1.0
 *
 * @param $string $color_scheme Color scheme. Defaults to the active color scheme.
 * @return $string Color.
*/
function birdtips_get_default_navigation_color() {

	$color_schemes = birdtips_color_schemes();
	return $color_schemes['default_navigation_color'];
}

/**
 * Returns the default article title color for BirdTIPS, based on color scheme.
 *
 * @since BirdTIPS 1.0
 *
 * @param $string $color_scheme Color scheme. Defaults to the active color scheme.
 * @return $string Color.
*/
function birdtips_get_default_article_title_color() {

	$color_schemes = birdtips_color_schemes();
	return $color_schemes['default_article_title_color'];
}

/**
 * Returns the options array for BirdTIPS.
 *
 * @since BirdTIPS 1.0
 */
function birdtips_get_theme_options() {
	return get_option( 'birdtips_theme_options', birdtips_get_default_theme_options() );
}

/**
 * Returns the options array for BirdTIPS.
 *
 * @since BirdTIPS 1.0
 */
function theme_options_render_page() {
	?>
	<div class="wrap">
		<?php screen_icon(); ?>
		<h2><?php printf( __( '%s Theme Options', 'birdtips' ), get_current_theme() ); ?></h2>
		<?php settings_errors(); ?>

		<form method="post" action="options.php">
			<?php
				settings_fields( 'birdtips_options' );
				$options = birdtips_get_theme_options();
				$default_options = birdtips_get_default_theme_options();
			?>

			<table class="form-table">
				<tr valign="top"><th scope="row"><?php _e( 'Link Color', 'birdtips' ); ?></th>
					<td>
						<fieldset><legend class="screen-reader-text"><span><?php _e( 'Link Color', 'birdtips' ); ?></span></legend>
							<input type="text" name="birdtips_theme_options[link_color]" id="link-color" class="colorwell" value="<?php echo esc_attr( $options['link_color'] ); ?>" />
							<input type="button" class="pickcolor button hide-if-no-js" value="<?php esc_attr_e( 'Select a Color', 'birdtips' ); ?>" />
							<?php _e( 'Default color:', 'birdtips' ); ?> <a href="#" class="default-color"><?php echo birdtips_get_default_link_color(); ?></a>
						</fieldset>
					</td>
				</tr>

				<tr valign="top"><th scope="row"><?php _e( 'Article Title Color', 'birdtips' ); ?></th>
					<td>
						<fieldset><legend class="screen-reader-text"><span><?php _e( 'Article Title Color', 'birdtips' ); ?></span></legend>
							<input type="text" name="birdtips_theme_options[article_title_color]" id="article-title-color" class="colorwell" value="<?php echo esc_attr( $options['article_title_color'] ); ?>" />
							<input type="button" class="pickcolor button hide-if-no-js" value="<?php esc_attr_e( 'Select a Color', 'birdtips' ); ?>" />
							<?php _e( 'Default color:', 'birdtips' ); ?> <a href="#" class="default-color"><?php echo birdtips_get_default_article_title_color(); ?></a>
						</fieldset>
					</td>
				</tr>

				<tr valign="top"><th scope="row"><?php _e( 'Navigation Menu Color', 'birdtips' ); ?></th>
					<td>
						<fieldset><legend class="screen-reader-text"><span><?php _e( 'Navigation Menu Color', 'birdtips' ); ?></span></legend>
							<input type="text" name="birdtips_theme_options[navigation_color]" id="navigation-color" class="colorwell" value="<?php echo esc_attr( $options['navigation_color'] ); ?>" />
							<input type="button" class="pickcolor button hide-if-no-js" value="<?php esc_attr_e( 'Select a Color', 'birdtips' ); ?>" />
							<?php _e( 'Default color:', 'birdtips' ); ?> <a href="#" class="default-color"><?php echo birdtips_get_default_navigation_color(); ?></a>
						</fieldset>
					</td>
				</tr>
			</table>
			<div id="colorPickerDiv" style="z-index: 100; background:#eee; border:1px solid #ccc; position:absolute; display:none;"></div>

			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

/**
 * Sanitize and validate form input. Accepts an array, return a sanitized array.
 *
 * @see birdtips_theme_options_init()
 * @todo set up Reset Options action
 *
 * @since BirdTIPS 1.0
 */
function birdtips_theme_options_validate( $input ) {
	$output = $defaults = birdtips_get_default_theme_options();

	// Our defaults for the link color may have changed, based on the color scheme.
	$output['link_color'] = $defaults['link_color'] = birdtips_get_default_link_color();
	$output['article_title_color'] = $defaults['article_title_color'] = birdtips_get_default_article_title_color();

	// Link color must be 3 or 6 hexadecimal characters
	if ( isset( $input['link_color'] ) && preg_match( '/^#?([a-f0-9]{3}){1,2}$/i', $input['link_color'] ) )
		$output['link_color'] = '#' . strtolower( ltrim( $input['link_color'], '#' ) );

	if ( isset( $input['article_title_color'] ) && preg_match( '/^#?([a-f0-9]{3}){1,2}$/i', $input['link_color'] ) )
		$output['article_title_color'] = '#' . strtolower( ltrim( $input['article_title_color'], '#' ) );

	if ( isset( $input['navigation_color'] ) && preg_match( '/^#?([a-f0-9]{3}){1,2}$/i', $input['navigation_color'] ) )
		$output['navigation_color'] = '#' . strtolower( ltrim( $input['navigation_color'], '#' ) );

	return apply_filters( 'birdtips_theme_options_validate', $output, $input, $defaults );
}

/**
 * Add a style block to the theme for the current link color.
 *
 * This function is attached to the wp_head action hook.
 *
 * @since BirdTIPS 1.0
 */
function birdtips_print_link_color_style() {
	$options = birdtips_get_theme_options();
	$link_color = $options['link_color'];
	$article_title_color = $options['article_title_color'];
	$navigation_color = $options['navigation_color'];

	$default_options = birdtips_get_default_theme_options();
	// Don't do anything if the current link color is the default.
	if ( $default_options['link_color'] == $link_color &&
		$default_options['article_title_color'] == $article_title_color &&
		$default_options['navigation_color'] == $navigation_color )
		return;

?>
	<style>
		a,
		.widget #calendar_wrap a,
		#content .tablenav a.page-numbers,
		#content .hentry .entry-content a {
			color: <?php echo $link_color; ?>;
			}

		#content .hentry .entry-content a,
		#content .hentry .entry-content a:hover,
		#content .tablenav a.page-numbers,
		#content article .page-link a {
			border-color: <?php echo $link_color;?>;
			}

		h1.entry-title,
		h1.entry-title a,
		.home #content .hentry .entry-header h2,
		.home #content .hentry .entry-header h2 a {
			color: <?php echo $article_title_color; ?>;
			}

		#content .hentry .entry-header .postdate {
			background: <?php echo $article_title_color; ?>;
			}

		#content .hentry.sticky .entry-header .postdate {
			background: <?php echo $link_color;?>
			}

		.home #content .hentry.sticky .entry-header h2,
		.home #content .hentry.sticky .entry-header h2 a {
			color: <?php echo $link_color;?>;
			}

		.menu ul li a {
			color: <?php echo $navigation_color;?>;
			border-color: <?php echo $navigation_color;?>;
			}

		#content #comments li.bypostauthor .comment_meta .author {
			color: <?php echo $article_title_color; ?>;
			}

		/* --- Smartphones and small Tablet PCs --- */
		@media screen and (max-width : 650px) {
			#content .hentry .entry-header .postdate,
			#content .hentry.sticky .entry-header .postdate {
				background: none;
				color: #000;
				}

			#small-menu {
				color: <?php echo $navigation_color;?>;
				}
		}
	</style>
<?php
}
add_action( 'wp_head', 'birdtips_print_link_color_style' );

