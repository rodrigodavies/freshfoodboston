<?php		
			$check_image='';
			
			echo'
			<article class="entry-post">
				<div class="innercontainer">
					<div class="entry-top">
						<a href="'.colabs_image('link=url&return=true').'" title="'.get_the_title().'" rel="lightbox-'.get_the_ID().'">';
					
							$single_top = get_post_custom_values("colabs_single_top");
							if (($single_top[0]!='')||($single_top[0]=='none')){ 
								if ($single_top[0]=='single_video'){
									$embed = colabs_get_embed('photogram_embed','626','200','single_video',$post->ID);
									if ($embed!=''){
										echo $embed; 
									}
								}elseif($single_top[0]=='single_image'){
									$check_image = colabs_image('link=url&return=true');
									echo colabs_image('width=222&link=img&return=true').'<span><i class="icon-search"></i></span><div class="desc">'.get_post_field('post_content', get_post_thumbnail_id()).'</div>';
								}
							}else{
								$check_image = colabs_image('link=url&return=true');
								echo colabs_image('width=222&link=img&return=true').'<span><i class="icon-search"></i></span><div class="desc">'.get_post_field('post_content', get_post_thumbnail_id()).'</div>';
							}
					  
			echo  '		</a>
					</div>
					<h3 class="entry-title"><a href="'.get_permalink().'">'.get_the_title().'</a></h3>
					<p class="entry-likes" data-like="'.get_like(get_the_ID()).'_'.get_the_ID().'"><i class="icon-heart ';
			if(isset($_COOKIE['like_'.get_the_ID()])){
			echo $_COOKIE['like_'.get_the_ID()];
			}
			echo '"></i> <span>'.get_like(get_the_ID()).'</span> Loves</p>
					<p class="entry-tags">
					  <i class="icon-tags"></i>
					  '.get_the_term_list(get_the_ID(), 'photograph-categories', '', ', ','').get_the_term_list(get_the_ID(), 'post_tag', '', ', ','').'  
					</p>
				</div>
			</article>';
			
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
						//if ($count <= $offset) continue;
						$url = wp_get_attachment_image_src($att_id, 'full', true); 
						if($check_image!=$url[0])
							 echo '
							<a style="display:none" href="'.$url[0].'" title="'. get_the_title().'" rel="lightbox-'.get_the_ID().'">
							  '.colabs_image('width=626&link=img&return=true&src='.$url[0]).'<div class="desc">'.$attachment->post_content.'</div>
							</a>'; 			
				}  
			endif; 
?>