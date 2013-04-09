<?php
/* Template Name: Blog */

get_header(); 
?>	
    
    <div class="main-content-wrapper row">
      <div class="main-content column col8">
		<?php 
		$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
		query_posts(array('post_type' => 'post', 
			  'post__not_in' =>get_option('sticky_posts'), 
			  'paged' => $paged,
		)); 
		if(have_posts()): while(have_posts()): the_post();
			get_template_part('content','post');
		endwhile; endif;
		colabs_pagination();
		?>
      </div><!-- .main-content -->
      
      <aside class="primary-sidebar column col4">
        <?php get_sidebar(); ?>
      </aside><!-- .primary-sidebar -->
    </div><!-- .main-content -->
    

<?php get_footer(); ?>