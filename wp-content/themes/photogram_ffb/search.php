<?php get_header(); ?>	
    
    <div class="main-content-wrapper row">
      <div class="main-content column col8">
	  <?php 
	  if(have_posts()): while(have_posts()): the_post(); ?>
        <article class="entry-post">		 
          <div class="entry-content row">
            
            <div class="entry-text">
				<h3 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
				<ul class="entry-meta clearfix">
				  <?php colabs_post_meta(); ?>
				</ul>
				<?php echo home_excerpt(); ?>
            </div>
          </div>
        </article><!-- .entry-post -->
	  <?php	
	  endwhile; endif;
	  ?>
        <?php colabs_pagination();?>
      </div><!-- .main-content -->
      
      <aside class="primary-sidebar column col4">
        <?php get_sidebar(); ?>
      </aside><!-- .primary-sidebar -->
    </div><!-- .main-content -->
    

<?php get_footer(); ?>