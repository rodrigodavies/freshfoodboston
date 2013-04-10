		<article class="entry-post">
		  <?php 
				$single_top = get_post_custom_values("colabs_single_top");
					if (($single_top[0]!='')||($single_top[0]=='none')){ 
						if ($single_top[0]=='single_video'){
							$embed = colabs_get_embed('photogram_embed','626','200','single_video',$post->ID);
							if ($embed!=''){
								echo '<div class="entry-top"><div class="innercontainer">'.$embed.'</div></div>'; 
							}
						}elseif($single_top[0]=='single_image'){
							 colabs_image('width=626&height=200&link=img&before=<div class=entry-top><div class=innercontainer>&after=</div></div>'); 
						}
					}else{
					 colabs_image('width=626&height=200&link=img&before=<div class=entry-top><div class=innercontainer>&after=</div></div>'); 
					}
		 
		  ?>      
          <div class="entry-content row">
            
            <div class="entry-text">
				<h3 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
				<ul class="entry-meta clearfix">
				  <?php colabs_post_meta(); ?>
				</ul>
				<?php the_excerpt(); ?>
            </div>
          </div>
        </article><!-- .entry-post -->