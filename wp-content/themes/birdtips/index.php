<?php get_header(); ?>

<div id="main">
	<div id="content">

		<?php while ( have_posts() ) : the_post(); ?>

			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

				<header class="entry-header">
					<h2><a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'birdtips' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
					<a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'birdtips' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><time class="postdate" datetime="<?php echo get_the_time('Y-m-d') ?>" pubdate><?php birdtips_the_date(); ?></time></a>
				</header>

				<div class="entry-content">
					<?php the_post_thumbnail('thumbnail'); ?>
					<?php the_content(); ?>
					<?php wp_link_pages( array( 'before' => '<div class="page-link">' . __( 'Pages:', 'birdtips' ), 'after' => '</div>' ) ); ?>
				</div>

					<footer class="entry-meta">
						<span class="author"><a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ) ); ?>"><?php the_author(); ?></a></span><span class="category"><?php the_category(', ') ?></span>
						<?php if ( comments_open() ) : ?>
							<span class="comments"><?php comments_popup_link(__('No Comments', 'birdtips'), __('1 Comment', 'birdtips'), __('% Comments', 'birdtips'), '', __('Comments Closed', 'birdtips') ); ?></span>
						<?php endif; ?>
					</footer>
			</article>

		<?php endwhile; ?>

		<div class="tablenav"><?php birdtips_the_pagenation(); ?></div>

	</div>

	<?php get_sidebar('left'); ?>
</div>

<?php get_sidebar('right'); ?>
<?php get_footer(); ?>
