<?php
/*
 * Content Template
 * This template is used for displaying content.
 *
 * @package WordPress
 * @subpackage WPstart
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php do_action('wpstart_post_before_entry_content'); ?>

	<?php do_action('wpstart_post_entry_summary'); ?>
					
	<?php do_action('wpstart_post_after_entry_content'); ?>
</article>