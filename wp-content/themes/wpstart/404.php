<?php
/*
 * 404 Template
 * This template is used when a 404 page is shown.
 *
 * @package WordPress
 * @subpackage WPstart
 */
get_header(); ?>

<?php do_action('wpstart_before_container'); ?>

	<?php do_action('wpstart_before_content'); ?>
	
		<?php do_action('wpstart_before_page_post'); ?>
	
		<article id="post-0" class="post error404 not-found">
			<div class="entry-content">
				<?php get_search_form(); ?>
			</div>
		</article>
		
		<?php do_action('wpstart_after_page_post'); ?>
	
	<?php do_action('wpstart_after_content'); ?>

<?php do_action('wpstart_after_container'); ?>

<?php get_sidebar(); ?>

<?php get_footer(); ?>