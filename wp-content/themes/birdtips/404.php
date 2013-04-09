<?php get_header(); ?>

<div id="main">
	<div id="content">

		<article>
			<header class="entry-header">
				<h1 class="entry-title"><?php _e('Error 404 - Not Found', 'birdtips'); ?></h1>
			</header>

		   <h2><?php _e( 'Recent Articles', 'birdtips' ); ?></h2>
		   <?php query_posts('cat=&showposts=10'); ?>
		   <ul>
				<?php while (have_posts()) : the_post(); ?>
					<li><span><a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a></span> <em><a href="<?php the_permalink() ?>" rel="bookmark"><?php echo get_post_time(get_option('date_format')); ?></a></em></li>
		   		<?php endwhile; ?>
		    </ul>
		</article>

	</div>

	<?php get_sidebar('left'); ?>
</div>

<?php get_sidebar('right'); ?>
<?php get_footer(); ?>
