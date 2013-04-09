<?php get_header(); ?>

<div id="main">
	<div id="content">

		<article>

		<h1 class="entry-title"><?php printf(__('Search Results: %s', 'birdtips'), esc_html($s) ); ?></h1>

		<?php if (have_posts()) : ?>

			<ul id="archive">
			<?php while (have_posts()) : the_post(); ?>

				<li><span><a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a></span> <em><a href="<?php the_permalink() ?>" rel="bookmark"><?php echo get_post_time(get_option('date_format')); ?></a></em></li>

			<?php endwhile; ?>
			</ul>

		<?php else: ?>
		
			<p><?php printf(__('Sorry, no posts matched &#8216;%s&#8217;', 'birdtips'), esc_html($s) ); ?><?php endif; ?>

		</article>
	
		<div class="tablenav"><?php birdtips_the_pagenation(); ?>	</div>
	</div>

	<?php get_sidebar('left'); ?>
</div>

<?php get_sidebar('right'); ?>
<?php get_footer(); ?>
