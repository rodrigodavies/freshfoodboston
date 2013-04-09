<?php get_header(); ?>

	<div id="content" class="page" role="main">

	<?php if (have_posts()) : ?>
    
    	<div id="feature">
                
            <div class="thumbnail">
                <a href="<?php echo get_option('home'); ?>" title="<?php bloginfo('name'); ?>"><?php the_post_thumbnail(); ?></a>
            </div>
            
            <h1>Search Results</h1>
            
            <div class="excerpt">
            	<p><?php get_search_form(); ?></p>
            </div>
            
            <?php get_footer(); ?>
            
        </div> <!--- #feature --->
        
        <?php get_sidebar(); ?>
        
        <div class="post">

		<?php while (have_posts()) : the_post(); ?>

            <div class="result">
                <div class="thumbnail">
                    <a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><h2 id="post-<?php the_ID(); ?>"><?php the_title(); ?></h2><?php the_post_thumbnail(); ?></a>
                </div>
            </div>

			<?php endwhile; ?>
    
            <div class="navigation">
                <div class="alignleft"><?php next_posts_link('&laquo; Older Entries') ?></div>
                <div class="alignright"><?php previous_posts_link('Newer Entries &raquo;') ?></div>
            </div>
            
       </div> <!-- .post -->

	<?php else : ?>

		<div id="feature">
                
            <div class="thumbnail">
                <a href="<?php echo get_option('home'); ?>" title="<?php bloginfo('name'); ?>"><?php the_post_thumbnail(); ?></a>
            </div>
            
            <h1>Search Results</h1>
            
            <div class="excerpt">
                 <p>Unfortunately no posts were found to match your search term. Would you like to try a different search?</p>
            	<?php get_search_form(); ?>
            </div>
            
            <?php get_footer(); ?>
            
        </div> <!--- #feature --->
        
        <?php get_sidebar(); ?>

	<?php endif; ?>

	</div>
