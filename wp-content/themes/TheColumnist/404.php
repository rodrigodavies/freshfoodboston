<?php get_header(); ?>

	<div id="content" class="single">

        <div id="feature">
                
            <div class="thumbnail">
            <a href="<?php echo get_option('home'); ?>" title="<?php bloginfo('name'); ?>"><?php the_post_thumbnail(); ?></a>
            </div>
            
            <h1>Error 404 Not Found</h1>
            
            <div class="excerpt">
            	<p>Unfortunately no posts were found. Would you like to search for something?</p>
				<p><?php get_search_form(); ?></p>
            </div>
            
			<?php get_footer(); ?>
        
        </div> <!--- #feature --->
        
        <?php get_sidebar(); ?>

	</div>

<?php include("close.php"); ?>