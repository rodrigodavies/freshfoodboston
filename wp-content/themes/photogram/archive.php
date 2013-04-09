<?php get_header(); ?>	
    
    <div class="main-content-wrapper row">
      <div class="main-content column col8">
	  <?php 
	  if(have_posts()): while(have_posts()): the_post(); 
        get_template_part('content','post');
	  endwhile; endif;
	  ?>
        <?php colabs_pagination();?>
      </div><!-- .main-content -->
      
      <aside class="primary-sidebar column col4">
        <?php get_sidebar(); ?>
      </aside><!-- .primary-sidebar -->
    </div><!-- .main-content -->
    

<?php get_footer(); ?>