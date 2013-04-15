<?php
/*
	Template Name: Full width map page
*/
?>
<?php get_header(); ?>
      <div>
		<section class="section-block">
		  <?php	if ( have_posts() ): while ( have_posts() ) : the_post(); ?>
            <div class="entry">							
					<?php the_content(); ?>
            </div><!-- .entry-blog -->
			<?php endwhile;?> 			
			<?php else: ?>
				<h2><?php _e('No posts found. Try a different search?','colabsthemes');?></h2>
			<?php endif;?>
		</section><!-- .section-block -->
      </div>
	<!-- </div> -->
	
<?php get_footer(); ?>