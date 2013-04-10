<?php get_header(); if ( ! isset( $content_width ) ) $content_width = 978;?>
    
    <div class="main-content-wrapper row">
      <div class="main-content column col8">
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'entry-post' ); ?>>
		<?php if(have_posts()): while(have_posts()): the_post(); ?>	          
          <div class="entry-content row">            
            <div class="entry-text">
              <h3 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>              
              <?php
				/**
				 * Grab the IDs of all the image attachments in a gallery so we can get the URL of the next adjacent image in a gallery,
				 * or the first image (if we're looking at the last image in a gallery), or, in a gallery of one, just the link to that image file
				 */
				$attachments = array_values( get_children( array( 'post_parent' => $post->post_parent, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => 'ASC', 'orderby' => 'menu_order ID' ) ) );
				foreach ( $attachments as $k => $attachment ) :
					if ( $attachment->ID == $post->ID )
						break;
				endforeach;

				$k++;
				// If there is more than 1 attachment in a gallery
				if ( count( $attachments ) > 1 ) :
					if ( isset( $attachments[ $k ] ) ) :
						// get the URL of the next image attachment
						$next_attachment_url = get_attachment_link( $attachments[ $k ]->ID );
					else :
						// or get the URL of the first image attachment
						$next_attachment_url = get_attachment_link( $attachments[ 0 ]->ID );
					endif;
				else :
					// or, if there's only 1 image, get the URL of the image
					$next_attachment_url = wp_get_attachment_url();
				endif;
				?>
				<a href="<?php echo esc_url( $next_attachment_url ); ?>" title="<?php the_title_attribute(); ?>" rel="attachment"><?php
				$attachment_size = apply_filters( 'photogram_attachment_size', array( 960, 960 ) );
				echo wp_get_attachment_image( $post->ID, $attachment_size );
				?></a>
			  <?php the_content(); ?>
			  <?php wp_link_pages();?>
            </div>
          </div>
		  <?php
		  endwhile; endif;
		  ?>
				
        </article><!-- .entry-post -->

      </div><!-- .main-content -->
      
      <aside class="primary-sidebar column col4">
        <?php get_sidebar(); ?>
      </aside><!-- .primary-sidebar -->
	</div>  
<?php get_footer(); ?>
