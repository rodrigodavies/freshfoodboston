<?php get_header(); ?>
	
    
    <section class="section-block">
      <h3 class="section-block-title"><span><?php _e("Photographs","colabsthemes"); ?></span></h3>
      <div class="post-list post-masonry">
        
        <?php 
		global $wp_query;
		$args = array_merge( $wp_query->query_vars, array( 'post_type' => 'photograph' ) );
		query_posts( $args );
		
		if ( have_posts() ):		
			while (have_posts()) : the_post();
			
			get_template_part('content','photograph');
				
			endwhile;
			if (  $wp_query->max_num_pages > 1 ) : ?>
					<div class="nav-previous"><?php next_posts_link( __( '<span class="meta-nav">&larr;</span> Older posts', 'colabthemes' ) ); ?></div>
			<?php endif;
		else:
			echo	'<h2>'. __('No posts found. Try a different search?','colabsthemes').'</h2>';
		endif;
		wp_reset_query();
        ?>
      </div><!-- .post-masonry -->
			<?php if (  $wp_query->max_num_pages > 1 ) : ?>
					<div class="nav-previous"><?php next_posts_link( __( '<span class="meta-nav">&larr;</span> Older posts', 'colabthemes' ) ); ?></div>
			<?php endif; ?>
    </section><!-- .section-block -->

<?php get_footer(); ?>
