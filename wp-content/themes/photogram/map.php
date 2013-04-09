<?php
/*
	Template Name: Google maps / WP Geolocation page
*/
?>
<?php get_header(); ?>
    <div class="main-content-wrapper row">
      <div class="main-content column col12">
		<section class="section-block"> 
            <div class="entry">							
                <div class="blog-post column col12">


<?php 
    $points = '';
    $thePosts = '';

    query_posts('posts_per_page=50'); 

    while ( have_posts() ) : the_post(); 
    
        $points .= '(' . get_post_meta($post->ID, 'geo_latitude', true) . ',' . get_post_meta($post->ID, 'geo_longitude', true) . '),'; 
        $thePosts .= '(' . get_the_title() . '|' . get_permalink() . '|' . get_the_time() . '),';
    endwhile; 
    
    $points = substr($points, 1, -2); // Remove the initial '(' and final '),'
    $thePosts = substr($thePosts, 1, -2);
?>

<div id="canvas"></div>

				</div>
            </div><!-- .entry-blog -->
		</section><!-- .section-block -->
      </div>
	</div>
	
<?php get_footer(); ?>