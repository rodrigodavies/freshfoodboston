<?php get_header(); ?>
    
    <div class="main-content-wrapper row">
      <div class="main-content column col10">
        <article class="entry-post">
		<?php if(have_posts()): while(have_posts()): the_post(); ?>	          
          <div class="entry-content row">            
            <div class="entry-text">
              <h3 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>              
              <?php the_content(); ?>
			  <?php wp_link_pages();?>
            </div>
          </div>
		  <?php
		  endwhile; endif;
		  ?>
				
        </article><!-- .entry-post -->
      </div><!-- .main-content -->
      
<!--      <aside class="primary-sidebar column col4">
        <?php get_sidebar(); ?>
      </aside> --><!-- .primary-sidebar -->
	</div>  
<?php get_footer(); ?>