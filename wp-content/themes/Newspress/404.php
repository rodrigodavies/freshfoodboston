<?php
/**
 * The template for displaying 404 pages (Not Found).
 *
 * @package web2feel
 * @since web2feel 1.0
 */

get_header(); ?>

	<div id="primary" class="content-area grid_6 papr">
		<div id="content" class="site-content" role="main">

			<article id="post-0" class="post error404 hentry not-found">
				<header class="entry-header">
					<h1 class="entry-title"><?php _e( 'Not Found', 'web2feel' ); ?></h1>
				</header><!-- .entry-header -->

				<div class="entry-content">
					<?php _e( 'The page you are looking for is not found! Please try some other search term.', 'web2feel' ); ?>
				</div><!-- .entry-content -->
			</article><!-- #post-0 .post .error404 .not-found -->

		</div><!-- #content .site-content -->
	</div><!-- #primary .content-area -->

<?php get_footer(); ?>