<?php get_header(); ?>
   <div id="content" role="main">
   <?php if (have_posts()) : ?>
   <?php $recent = new WP_Query("showposts=1"); while($recent->have_posts()) : $recent->the_post();?>
    
    <div <?php post_class() ?> id="post-<?php the_ID(); ?>">
     
				<div id="feature">
    	
					<div class="thumbnail">
						<a href="<?php echo get_option('home'); ?>" title="<?php bloginfo('name'); ?>">
							<?php //get thumnbnail (custom field) ?>
                            <?php $image = get_post_meta($post->ID, 'thumbnail', true); ?>
                            <img src="<?php echo $image; ?>" title="<?php the_title(); ?>" />
                            <?php the_post_thumbnail(); ?>
                        </a>
					</div>
     
				<h1><a class="show" href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h1>
				<p class="timestamp">Written by <?php the_author() ?> <?php the_time('F jS, Y') ?></p>
     
				<div class="excerpt">
						<?php the_excerpt(); ?> 
						<a class="more-link show" href="<?php the_permalink() ?>" title="Continue reading">Continue reading &rarr;</a>
				</div>
     
     		<?php get_footer(); ?>

				</div> <!--- #feature --->
                
                <?php get_sidebar(); ?>
                
				<div class="entry">
                    <a class="hide" href="">Close</a>
                    <?php //get large (custom field) 
					$image = get_post_meta($post->ID, 'large-image', true);
					if ($image) {
					echo '<div class="image">';
                    echo "<img src='$image'/>";
					echo '</div>';
					}
					else {
					}?>
                    
                  <div class="text">
                    <?php the_content('Continue reading &rarr;'); ?>
                  </div>
                    
				<?php include("meta.php"); ?>

                <?php comments_template(); ?>
                  
                <div class="navigation">
                	<div class="alignleft"><?php previous_post_link('&larr; %link') ?></div>
                	<div class="alignright"><?php next_post_link('%link &rarr;') ?></div>
                </div>


				</div> <!--- .entry --->


			</div> <!--- #post --->

		<?php endwhile; ?>

	<?php else : ?>

		<h2>Not Found</h2>
		<p>Sorry, but you are looking for something that isn't here.</p>
		<?php get_search_form(); ?>

	<?php endif; ?>
    
					<?php include("older-posts.php"); ?>

   </div> <!--- #content --->
    
<?php include("close.php"); ?>