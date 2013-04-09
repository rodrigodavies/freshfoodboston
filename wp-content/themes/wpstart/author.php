<?php
/*
 * Author Template
 * This template is used when an author page is shown.
 *
 * @package WordPress
 * @subpackage WPstart
 */
get_header(); ?>

<?php do_action('wpstart_before_container'); ?>

	<?php do_action('wpstart_before_content'); ?>
	
		<?php the_post(); ?>			
			<?php do_action('wpstart_page_title'); ?>
		<?php rewind_posts(); ?>
		
		<?php do_action('wpstart_before_post_loop'); ?>
				
		<?php if ( have_posts() ) : ?>
			
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part('content', get_post_format()); ?>
			<?php endwhile; ?>

		<?php else : ?>
			
			<?php do_action('wpstart_post_no_results_not_found'); ?>

		<?php endif; ?>
				
		<?php do_action('wpstart_after_post_loop'); ?>

	<?php do_action('wpstart_after_content'); ?>

<?php do_action('wpstart_after_container'); ?>

<?php get_sidebar(); ?>

<?php get_footer(); ?>