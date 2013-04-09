<div id="older-posts">
	<?php
  $catQuery = $wpdb->get_results("SELECT * FROM $wpdb->terms AS wterms INNER JOIN $wpdb->term_taxonomy AS wtaxonomy ON ( wterms.term_id = wtaxonomy.term_id ) WHERE wtaxonomy.taxonomy = 'category' AND wtaxonomy.parent = 0 AND wtaxonomy.count > 0");
  
  $catCounter = 0;
  
  foreach ($catQuery as $category) {
  
  $catCounter++;
  
  $catStyle = '';
  if (is_int($catCounter / 2)) $catStyle = ' class="catAlt"';
  
  $catLink = get_category_link($category->term_id);
  
  
  echo '<div class="category">';
		echo '<h2><a href="'.$catLink.'" title="'.$category->name.'">'.$category->name.'</a></h2>';
		
		query_posts('cat='.$category->term_id.'&showposts=1');?>
		
		<?php while (have_posts()) : the_post(); ?>
		<div class="thumbnail">
				<a href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title(); ?>">
                    <h3><?php the_title(); ?></h3>
                    <?php //get thumnbnail (custom field) ?>
					<?php $image = get_post_meta($post->ID, 'thumbnail', true); ?>
                    <img src="<?php echo $image; ?>" title="<?php the_title(); ?>" />
                    <?php the_post_thumbnail(); ?>
                </a>
		</div>
		<div class="excerpt">
				<?php the_excerpt(); ?> 
        <a class="more-link" href="<?php the_permalink() ?>" title="Continue reading">Continue reading &rarr;</a>
		</div> 
		<p class="view-all"><a href="<?php echo $catLink; ?>" title="<?php echo $category->name; ?>">View all</a></p>
  </div>
  <?php endwhile; ?>
  
  <?php }	?>
</div><!--- #older-posts --->