<?php
/* Template Name: Sitemap */

get_header(); 
?>	
    <div class="main-content-wrapper row">
      <div class="main-content column col8">		
		<section class="section-block">
		  <h3 class="section-block-title"><span><?php _e("Sitemap","colabsthemes"); ?></span></h3>
		  
		  <div class="entry-site">
		    <span class="title"><?php _e('Pages:','colabsthemes');?></span>
			<ul class="page-cat">
				<?php wp_list_pages('title_li='); ?>
			</ul>
		  </div><!-- .post-sitemap -->
		  
		  <div class="entry-site">
		    <span class="title"><?php _e('Categories:','colabsthemes');?></span>
			<ul class="page-cat">
				<?php wp_list_categories('title_li=&hierarchical=0&show_count=1'); ?>
			</ul>
		  </div><!-- .post-sitemap -->
		  
		  <div class="entry-site">
		    <span class="title"><?php _e('Monthly Archives:','colabsthemes');?></span>
			<ul class="page-cat">
				<?php wp_get_archives('type=monthly'); ?>
			</ul>
		  </div><!-- .post-sitemap -->
		  
		  <div class="entry-site">
		    <span class="title"><?php _e('RSS Feed:','colabsthemes');?></span>
			<ul class="page-cat">
				<li><a href="<?php bloginfo('rdf_url'); ?>" title="RDF/RSS 1.0 feed"><acronym title="Resource Description Framework">RDF</acronym>/<acronym title="Really Simple Syndication">RSS</acronym> 1.0 feed</a></li>
				<li><a href="<?php bloginfo('rss_url'); ?>" title="RSS 0.92 feed"><acronym title="Really Simple Syndication">RSS</acronym> 0.92 feed</a></li>
				<li><a href="<?php bloginfo('rss2_url'); ?>" title="RSS 2.0 feed"><acronym title="Really Simple Syndication">RSS</acronym> 2.0 feed</a></li>
				<li><a href="<?php bloginfo('atom_url'); ?>" title="Atom feed">Atom feed</a></li>
			</ul>
		  </div><!-- .post-sitemap -->
		  
		  <div class="entry-site">
		    <span class="title"><?php _e('Photograph Categories:','colabsthemes');?></span>
			<ul class="page-cat">
				<?php 							
				$args = array(
					'taxonomy'     => 'photograph-categories',
					'orderby'      => 'name',
					'show_count'   => 1,
					'pad_counts'   => 1,
					'hierarchical' => 1,
					'title_li'     => ''
				);
				wp_list_categories($args) 
				?>
			</ul>
		  </div><!-- .post-sitemap -->
		  		  
		</section><!-- .section-block -->
	  </div>
      <aside class="primary-sidebar column col4">
        <?php get_sidebar(); ?>
      </aside><!-- .primary-sidebar -->
	</div>
    
<?php get_footer(); ?>