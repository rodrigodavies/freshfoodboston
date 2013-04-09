<?php get_header(); ?>

<div id="main">
	<div id="content">

		<?php if (have_posts()) : ?>

			<article>
			<h1 class="entry-title"><?php birdtips_the_archivetitle(); ?></h1>
			<ul>
			<?php while (have_posts()) : the_post(); ?>
				<li><span><a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a></span> <em><a href="<?php the_permalink() ?>" rel="bookmark"><?php echo get_post_time(get_option('date_format')); ?></a></em></li>

			<?php endwhile; ?>
			</ul>
			</article>
		<?php else: ?>
		
		<p><?php _e( 'Sorry, no posts matched your criteria.', 'birdtips' ); ?></p><?php endif; ?>
		<div class="tablenav"><?php birdtips_the_pagenation(); ?>	</div>

	</div>

	<?php get_sidebar('left'); ?>
</div>

<?php get_sidebar('right'); ?>
<?php get_footer(); ?>
