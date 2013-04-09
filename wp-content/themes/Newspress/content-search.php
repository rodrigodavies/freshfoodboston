<?php
/**
 * @package web2feel
 * @since web2feel 1.0
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('cf'); ?>>


	<header class="entry-header">
		<h2 class="entry-title"><a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( sprintf( __( 'Permalink to %s', 'web2feel' ), the_title_attribute( 'echo=0' ) ) ); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
	<?php if ( 'post' == get_post_type() ) : ?>
		<div class="entry-meta">
			<?php web2feel_posted_on(); ?>
		</div><!-- .entry-meta -->
		<?php endif; ?>
				
	</header><!-- .entry-header -->

	<div class="entry-summary">
			<?php wpe_excerpt('wpe_excerptlength_archive', ''); ?>
	</div><!-- .entry-summary -->
	
</article><!-- #post-<?php the_ID(); ?> -->
