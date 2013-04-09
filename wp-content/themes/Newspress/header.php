<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package web2feel
 * @since web2feel 1.0
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width" />
<title><?php
	/*
	 * Print the <title> tag based on what is being viewed.
	 */
	global $page, $paged;

	wp_title( '|', true, 'right' );

	// Add the blog name.
	bloginfo( 'name' );

	// Add the blog description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		echo " | $site_description";

	// Add a page number if necessary:
	if ( $paged >= 2 || $page >= 2 )
		echo ' | ' . sprintf( __( 'Page %s', 'web2feel' ), max( $paged, $page ) );

	?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<link href='http://fonts.googleapis.com/css?family=Actor' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Lato:400,300,700,900' rel='stylesheet' type='text/css'>

<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js" type="text/javascript"></script>
<![endif]-->

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="hfeed site container_6">
	<?php //do_action( 'before' ); ?>
	
	<header id="masthead" class="site-header grid_6 papr cf" role="banner">
		<div class="logo grid_3 omega">
			<h1 class="site-title"><a href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
		</div>
		<div class="grid_3 alpha">
			<div class="dtime">
				<?php
					$zone = of_get_option('w2f_timezone','Europe/Dublin');
					$timezone = new DateTimeZone( "$zone" );
					$date = new DateTime();
					$date->setTimezone( $timezone );
					echo  $date->format( 'l: ' );
					echo  $date->format( ' M jS, Y' );
					
					
				?>
			</div>

			<?php get_search_form(); ?> 
		</div>
	</header><!-- #masthead .site-header -->

	<div id="three_tier " class="grid_6 cf">
			<div id="fmenu">
				<?php wp_nav_menu( array( 'container_id' => 'topmenu', 'theme_location' => 'primary','menu_class'=>'sfmenu','fallback_cb'=> 'fallbackfmenu' ) ); ?>
			</div>
			<div id="smenu">
				<?php wp_nav_menu( array( 'container_id' => 'submenu', 'theme_location' => 'secondary','menu_class'=>'sfmenu','fallback_cb'=> 'fallbacksmenu' ) ); ?>
			</div>
			<div id="flashn" class="cf papr">
				<h3><?php _e( 'Flash news:', 'web2feel' ); ?> </h3>	<?php get_template_part( 'ticker', 'index' ); ?>
			</div>
	</div>
	<div class="clear"></div>

	<div id="main" class="site-main cf">