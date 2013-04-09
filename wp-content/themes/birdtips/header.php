<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" >
<meta name="viewport" content="width=device-width" >
<title><?php wp_title('|', true, 'right'); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" >
<link rel="stylesheet" type="text/css" media="all" href="<?php echo get_stylesheet_uri() ?>" >
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" >
<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri() ?>/js/html5.js" type="text/javascript"></script>
<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
<![endif]-->

<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<div id="container">

<?php
	// The header image
	$header_image = get_header_image();
	$image_tag = '';
	if ( empty( $header_image ) ){
		$image_tag = ' class="no-image"'; 
	}
?>

	<header id="header"<?php echo $image_tag; ?>>

<?php if ( ! empty( $header_image ) ) : ?>
	<?php if ( 'blank' == get_header_textcolor() ): ?>
		<a href="<?php echo home_url( '/' ); ?>"><img src="<?php header_image(); ?>" alt="<?php bloginfo( 'name' ); ?>" ></a>
	<?php else: ?>
		<img src="<?php header_image(); ?>" alt="<?php bloginfo( 'name' ); ?>" >
	<?php endif; ?>
<?php endif; ?>

	<hgroup id="hgroup">
		<?php $heading_tag = ( is_home() || is_front_page() ) ? 'h1' : 'div'; ?>
		<<?php echo $heading_tag; ?> id="site-title">
			<a href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
		</<?php echo $heading_tag; ?>>
		<p id="site-description"><?php bloginfo( 'description' ); ?></p>
	</hgroup>

		<nav id="menu-wrapper">
			<div id="small-menu">&raquo;Menu</div>
			<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
		</nav>

	</header>

<?php if(!is_home()): ?>
	<ul id="pankuzu">
		<li><a href="<?php echo home_url('/'); ?>"><?php _e('Home', 'birdtips'); ?></a>&raquo;</li>

		<?php if(is_archive()): ?>
			<li><?php birdtips_the_pankuzu_category(); ?></li>
		<?php elseif(is_page()):  ?>
			<li><?php the_title(); ?></li>
		<?php elseif(is_singular()): ?>
			<li><?php birdtips_the_pankuzu_category(); ?></li>
			<li><?php the_title(); ?></li>
		<?php elseif(is_search()):  ?>
			<li><?php printf(__('Search Results: %s', 'birdtips'), esc_html($s) ); ?></li>
		<?php elseif(is_404()):  ?>
			<li><?php _e('Error 404 - Not Found', 'birdtips'); ?></li>
		<?php endif; ?>
	</ul>
<?php endif; ?>

	<div id="wrapper">
	