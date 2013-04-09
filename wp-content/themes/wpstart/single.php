<?php
/*
 * Single Post Template
 * This template is used when a single post page is shown.
 *
 * @package WordPress
 * @subpackage WPstart
 */
get_header(); ?>

<?php do_action('wpstart_before_container'); ?>

	<?php do_action('wpstart_before_content'); ?>
	
		<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>

		<?php do_action('wpstart_before_single_post'); ?>

			<?php do_action('wpstart_single_before_entry_content'); ?>
		
			<?php do_action('wpstart_single_entry_content'); ?>
					
			<?php do_action('wpstart_single_after_entry_content'); ?>
				
		<?php do_action('wpstart_after_single_post'); ?>
									
		<?php comments_template( '', true ); ?>
					
		<?php endwhile; ?>
	
	<?php do_action('wpstart_after_content'); ?>

<?php do_action('wpstart_after_container'); ?>

<?php get_sidebar(); ?>
	
<?php get_footer(); ?>