<?php
/**
 * This is the default template for the info window in Geo Mashup maps. 
 *
 * Don't modify this file! It will be overwritten by upgrades.
 *
 * Instead, copy this file to "geo-mashup-info-window.php" in your theme directory, 
 * or info-window.php in the Geo Mashup Custom plugin directory, if you have that 
 * installed. Those files take precedence over this one.
 *
 * For styling of the info window, see map-style-default.css.
 *
 * @package GeoMashup
 */

// A potentially heavy-handed way to remove shortcode-like content
add_filter( 'the_excerpt', array( 'GeoMashupQuery', 'strip_brackets' ) );

?>
<div class="locationinfo post-location-info">
<?php if (have_posts()) : ?>

	<?php while (have_posts()) : the_post(); ?>

		<h2><a href="<?php the_permalink() ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
		<p class="date"><?php the_time('F jS, Y') ?> </p>
		<?php if ( has_post_thumbnail() ) { the_post_thumbnail('map-thumbnail');} ?>	

		<?php if ($wp_query->post_count == 1) : ?>
			<div>
				<?php the_excerpt(); ?>
			</div>
		<?php endif; ?>

	<?php endwhile; ?>

<?php else : ?>

	<h2 class="center">Not Found</h2>
	<p class="center">Sorry, but you are looking for something that isn't here.</p>

<?php endif; ?>

</div>
