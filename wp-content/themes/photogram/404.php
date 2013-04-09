<?php get_header();?>

	<div class="main-content-wrapper row">
      <div class="main-content column col8">		
		<section class="section-block">
			<h3 class="entry-title"><?php _e("404 Not Found","colabsthemes"); ?></h3>
			<?php _e('No posts found. Try a different search?','colabsthemes');?>
		</section><!-- .section-block -->
	  </div>
      <aside class="primary-sidebar column col4">
        <?php get_sidebar(); ?>
      </aside><!-- .primary-sidebar -->
	</div>    
	
<?php get_footer(); ?>