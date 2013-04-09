<?php get_header(); ?>
    
    <div class="main-content-wrapper row">
      <div class="main-content column col12">
        <article <?php post_class('entry-post'); ?>>
		<?php if(have_posts()): while(have_posts()): the_post(); 
		
				$content='';
				$check_src='';
				$meta = get_the_title();
				$single_top = get_post_custom_values("colabs_single_top");
				if (($single_top[0]!='')||($single_top[0]=='none')){ 
					if ($single_top[0]=='single_video'){
						$embed = colabs_get_embed('colabs_embed','626','350','single_video',$post->ID);
						if ($embed!=''){
							$content .= '<div>'.$embed.'</div>'; 
						}
					}elseif($single_top[0]=='single_image'){
						$content .= '
						  <a href="'.colabs_image('link=url&return=true').'" title="'.$meta.'"class="grouped" rel="lightbox">
						    '.colabs_image('width=626&link=img&return=true').'
						  </a>';
					$check_src = colabs_image('link=url&return=true');
					}
				}
				
				$attachments = get_children( array(
				'post_parent' => get_the_ID(),
				'numberposts' => 100,
				'post_type' => 'attachment',
				'post_mime_type' => 'image' )
				);
				if ( !empty($attachments) ) :
                $count = 0;
                foreach ( $attachments as $att_id => $attachment ) {
                    $count++;  
                    
                    $url = wp_get_attachment_image_src($att_id, 'full', true); 
					if($check_src!=$url[0])
			        $content .= '
						<a href="'.$url[0].'" title="'.$meta.'"class="grouped" rel="lightbox">
						  '.colabs_image('width=626&link=img&return=true&src='.$url[0]).'
						</a>';			
                }  
				endif; 
			
		   
		   if($content!=''):	
		  ?>		
          <div class="entry-top">
            <div class="innercontainer">
              <div class="slider">
				<?php echo $content; ?>				
              </div>
              <div class="single-slider-nav">
                <a href="#" class="prev"></a>
                <a href="#" class="next"></a>
              </div>
            </div>
          </div>
		 <?php endif; ?> 
          <div class="entry-content row">
            
            <div class="entry-text">
				<h3 class="entry-title"><?php the_title(); ?></h3>   
				<ul class="entry-meta clearfix">
				  <?php colabs_post_meta(); ?>
				</ul>           
				<?php the_content(); ?>
				<?php wp_link_pages();?>
				<?php $meta = get_post_meta( get_the_ID() ); ?>
            </div>
          </div>
		  <?php
		  endwhile; endif;
		  ?>
        </article><!-- .entry-post -->
		<?php comments_template(); ?> 
      </div><!-- .main-content -->
      
 	</div>  
<?php get_footer(); ?>