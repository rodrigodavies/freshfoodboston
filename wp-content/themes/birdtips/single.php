<?php get_header(); ?>

<div id="main">
	<div id="content">

	<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>

		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<header class="entry-header">
				<h1 class="entry-title"><?php the_title(); ?></h1>
				<time class="postdate" datetime="<?php echo get_the_time('Y-m-d') ?>" pubdate><?php birdtips_the_date(); ?></time>
			</header>

			<div class="entry-content">
				<?php the_content(); ?>
				<?php wp_link_pages( array( 'before' => '<div class="page-link">' . __( 'Pages:', 'birdtips' ), 'after' => '</div>' ) ); ?>
			</div>

			<footer class="entry-meta">
				<span class="author"><a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ) ); ?>"><?php the_author(); ?></a></span><span class="category"><?php _e( 'Posted in', 'birdtips' ); ?>: <?php the_category(', ') ?></span><?php the_tags('<span class="tag">' .__( 'Tagged', 'birdtips' ) .': ', ', ', '</span>') ?>
				
			</footer>

		</article>

		<?php comments_template( '', true ); ?>

		<nav id="nav-below">
			<span class="nav-next"><?php next_post_link('%link', '&laquo; %title'); ?></span>
			<span class="nav-previous"><?php previous_post_link('%link', '%title &raquo;'); ?></span>
		</nav>

	<?php endwhile; ?>

	</div>

	<?php get_sidebar('left'); ?>
</div>

<?php get_sidebar('right'); ?>
<?php get_footer(); ?>
