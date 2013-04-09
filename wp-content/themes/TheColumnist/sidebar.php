<div id="sidebar" role="complementary">
    <ul class="menu">
        <?php 	/* Widgetized sidebar, if you have the plugin installed. */
                if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar() ) : ?>
        
        <!--
        <?php if ( is_404() || is_category() || is_day() || is_month() ||
                    is_year() || is_search() || is_paged() ) {
        ?> <li>
        
        <?php /* If this is a 404 page */ if (is_404()) { ?>
        <?php /* If this is a category archive */ } elseif (is_category()) { ?>
        <p>The Archives for the <?php single_cat_title(''); ?> category.</p>

        <?php /* If this is a daily archive */ } elseif (is_day()) { ?>
        <p>You are currently browsing the <a href="<?php bloginfo('url'); ?>/"><?php bloginfo('name'); ?></a> blog archives
        for the day <?php the_time('l, F jS, Y'); ?>.</p>

        <?php /* If this is a monthly archive */ } elseif (is_month()) { ?>
        <p>You are currently browsing the <a href="<?php bloginfo('url'); ?>/"><?php bloginfo('name'); ?></a> blog archives
        for <?php the_time('F, Y'); ?>.</p>

        <?php /* If this is a yearly archive */ } elseif (is_year()) { ?>
        <p>You are currently browsing the <a href="<?php bloginfo('url'); ?>/"><?php bloginfo('name'); ?></a> blog archives
        for the year <?php the_time('Y'); ?>.</p>

        <?php /* If this is a search result */ } elseif (is_search()) { ?>
        <p>You have searched the <a href="<?php bloginfo('url'); ?>/"><?php bloginfo('name'); ?></a> blog archives
        for <strong>'<?php the_search_query(); ?>'</strong>. If you are unable to find anything in these search results, you can try one of these links.</p>

        <?php /* If this set is paginated */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
        <p>You are currently browsing the <a href="<?php bloginfo('url'); ?>/"><?php bloginfo('name'); ?></a> blog archives.</p>

        <?php } ?>

        </li>
    <?php }?>
        -->
        
    </ul>
    <ul class="menu" role="navigation">
        <?php wp_list_pages('limit=7&title_li=<h3>Index</h3>&limit=7' ); ?>
  
  		<?php wp_list_categories('limit=7&title_li=<h3>Categories</h3>'); ?>

        <li class="widget"><h3>Archives</h3>
            <ul>
            <?php wp_get_archives('limit=7&type=monthly'); ?>
            </ul>
        </li>
        
        <li class="widget"><h3>Search</h3>
            <?php get_search_form(); ?>
            <?php endif; ?>
        </li>
    </ul>
    
</div> <!-- #sidebar -->

