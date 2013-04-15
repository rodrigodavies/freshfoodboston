<?php get_header(); ?>


<?php if (have_posts()) : ?>
<div id="post-area">
<?php while (have_posts()) : the_post(); ?>	

   		<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		 <?php if ( has_post_thumbnail() ) { ?>
         <div class="gridly-image"><a href="<?php the_permalink() ?>"><?php the_post_thumbnail( 'summary-image' );  ?></a></div>
        
       
		  <?php } else { ?> 

         <div class="gridly-image"><a href="<?php the_permalink() ?>"><img src="<?php 
        $images = get_children( array( 'post_parent' => $post->ID, 'post_type' => 'attachment', 'post_mime_type' => 'image', 'orderby' => 'menu_order', 'order' => 'ASC', 'numberposts' => 999 ) );
      if ( $images ) {
        $image = array_shift( $images );
        $image = wp_get_attachment_image_src( $image->ID, 'mixfolio-featured-thumbnail' );
        echo $image[0]; ?>" /></a></div>
      <?php } ?>        			
              <div class="gridly-copy"><h2><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h2>
                <p class="gridly-date"><?php the_time(get_option('date_format')); ?>  </p>

<?php the_excerpt(); ?> 

               <p class="gridly-link"><a href="<?php the_permalink() ?>">View more &rarr;</a></p>
         </div>
       </div>
       
       

<?php endwhile; ?>
</div>
<?php else : ?>
<?php endif; ?>
    
<?php next_posts_link('<p class="view-older">View Older Entries</p>') ?>
    
 
<?php get_footer(); ?>
