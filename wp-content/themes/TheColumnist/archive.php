<?php get_header(); ?>

	<div id="content" class="page" role="main">

		<?php if (have_posts()) : ?>

 	  <?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
      
	<div id="feature">
                
        <div class="thumbnail">
            <a href="<?php echo get_option('home'); ?>" title="<?php bloginfo('name'); ?>"><?php the_post_thumbnail(); ?></a>
        </div>
      
		<?php /* If this is a category archive */ if (is_category()) { ?>
        <h1 class="pagetitle">Archive: <?php single_cat_title(); ?></h1>
        
        <?php /* If this is a tag archive */ } elseif( is_tag() ) { ?>
        <h1 class="pagetitle">Posts tagged <?php single_tag_title(); ?></h1>
        
        <?php /* If this is a daily archive */ } elseif (is_day()) { ?>
        <h1 class="pagetitle">Archive: <?php the_time('F jS, Y'); ?></h1>
        
        <?php /* If this is a monthly archive */ } elseif (is_month()) { ?>
        <h1 class="pagetitle">Archive: <?php the_time('F, Y'); ?></h1>
        
        <?php /* If this is a yearly archive */ } elseif (is_year()) { ?>
        <h1 class="pagetitle">Archive: <?php the_time('Y'); ?></h1>
        
        <?php /* If this is an author archive */ } elseif (is_author()) { ?>
        <h1 class="pagetitle">Author Archive</h1>
        
        <?php /* If this is a paged archive */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
        <h1 class="pagetitle">Blog Archives</h1>
        
        <?php } ?>
	
    <?php get_footer(); ?>
          
	</div> <!--- #feature --->
    
    <?php get_sidebar(); ?>
    
    <div class="post">

		<?php while (have_posts()) : the_post(); ?>
        <div class="result">
                <div class="thumbnail">
                    <a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
                        <h2 id="post-<?php the_ID(); ?>"><?php the_title(); ?></h2>
                        <?php //get thumnbnail (custom field) ?>
                        <?php $image = get_post_meta($post->ID, 'thumbnail', true); ?>
                        <img src="<?php echo $image; ?>" title="<?php the_title(); ?>" />
                        <?php the_post_thumbnail(); ?>
                    </a>
                </div>
        </div>
        
        <?php endwhile; ?>
        
        <div class="navigation">
            <div class="alignleft"><?php next_posts_link('&laquo; Older Entries') ?></div>
            <div class="alignright"><?php previous_posts_link('Newer Entries &raquo;') ?></div>
        </div>
        
    </div> <!-- .post -->
    
	<?php else :

		if ( is_category() ) { // If this is a category archive
			printf("<h2 class='center'>Sorry, but there aren't any posts in the %s category yet.</h2>", single_cat_title('',false));
		} else if ( is_date() ) { // If this is a date archive
			echo("<h2>Sorry, but there aren't any posts with this date.</h2>");
		} else if ( is_author() ) { // If this is a category archive
			$userdata = get_userdatabylogin(get_query_var('author_name'));
			printf("<h2 class='center'>Sorry, but there aren't any posts by %s yet.</h2>", $userdata->display_name);
		} else {
			echo("<h2 class='center'>No posts found.</h2>");
		}
		get_search_form();

	endif;
?>

	</div>

<?php include("close.php"); ?>