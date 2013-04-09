<?php get_header(); ?>
	<div id="content" class="single">
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
		<div class="post" id="post-<?php the_ID(); ?>">
    	
      	<div id="feature">
    	
          <div class="thumbnail">
            <a href="<?php echo get_option('home'); ?>" title="<?php bloginfo('name'); ?>"><?php the_post_thumbnail(); ?></a>
          </div>
       
          <h1><?php the_title(); ?></h1>
          <p class="timestamp">Written by <?php the_author() ?> <?php the_time('F jS, Y') ?></p>
       
          <div class="excerpt">
          	<p>This image is from <a href="<?php echo get_permalink($post->post_parent); ?>" rev="attachment"><?php echo get_the_title($post->post_parent); ?></a></p>
          </div>
     
     		<?php get_footer(); ?>

				</div> <!--- #feature --->
        
        	<?php get_sidebar(); ?>
    
        <div class="entry">

          <div class="image">
          	<p class="attachment"><a href="<?php echo wp_get_attachment_url($post->ID); ?>"><?php echo wp_get_attachment_image( $post->ID, 'full' ); ?></a></p>
          </div>
          <div class="caption"><?php if ( !empty($post->post_excerpt) ) the_excerpt(); // this is the "caption" ?></div>
  
          <?php the_content('<p class="serif">Read the rest of this entry &raquo;</p>'); ?>

          <div class="navigation">
            <div class="alignleft"><?php previous_image_link() ?></div>
            <div class="alignright"><?php next_image_link() ?></div>
          </div>
          
          <h2><a href="<?php echo get_permalink($post->post_parent); ?>" rev="attachment"><?php echo get_the_title($post->post_parent); ?></a> | <?php the_title(); ?></h2>

					<?php include("meta.php"); ?>
          
          <?php comments_template(); ?>
  
        </div> <!-- .entry -->

		</div>

	<?php endwhile; else: ?>

		<p>Sorry, no attachments matched your criteria.</p>

<?php endif; ?>

	</div>