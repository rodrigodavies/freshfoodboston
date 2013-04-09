<?php
/**
 * @package web2feel
 * @since web2feel 1.0
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('cf'); ?>>
	<?php
		$thumb = get_post_thumbnail_id();
		$img_url = wp_get_attachment_url( $thumb,'full' ); //get full URL to image (use "large" or "medium" if the images too big)
		$image = aq_resize( $img_url, 180, 140, true ); //resize & crop the image
	?>
			
	<?php if($image) : ?>		
		<a href="<?php the_permalink(); ?>"><img class="post-image" src="<?php echo $image ?>"/></a>	
	<?php endif; ?>
	
	<div class="summary">
	<header class="entry-header">
		<h2 class="entry-title"><a href="<?php the_permalink(); ?>" title="<?php echo esc_attr( sprintf( __( 'Permalink to %s', 'web2feel' ), the_title_attribute( 'echo=0' ) ) ); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
	<?php if ( 'post' == get_post_type() ) : ?>
		<div class="entry-meta">
			<?php web2feel_posted_on(); ?>
		</div><!-- .entry-meta -->
		<?php endif; ?>
		

			
	</header><!-- .entry-header -->

	<?php if ( is_search() || is_home() || is_archive() ) : // Only display Excerpts for Search ?>
	<div class="entry-summary">
	

		<?php wpe_excerpt('wpe_excerptlength_archive', ''); ?>
	</div><!-- .entry-summary -->
	<?php else : ?>
	<div class="entry-content">
		<?php the_content( __( 'Continue reading <span class="meta-nav">&rarr;</span>', 'web2feel' ) ); ?>
		<?php wp_link_pages( array( 'before' => '<div class="page-links">' . __( 'Pages:', 'web2feel' ), 'after' => '</div>' ) ); ?>
	</div><!-- .entry-content -->
	<?php endif; ?>

		</div>
</article><!-- #post-<?php the_ID(); ?> -->
