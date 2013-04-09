<div id="feature-stories" class="papr cf">
	<h2 class="sec-title"> <?php _e( 'Featured news', 'web2feel' ); ?> </h2>
			<div class="stripe"></div>
<div class="grid_2 omega fleft">

<?php

	$slidecategory = of_get_option('w2f_feature_category');
	
	$args = array( 'numberposts' =>1, 'category'=> $slidecategory);
	$postslist = get_posts( $args );
	foreach ($postslist as $post) :  setup_postdata($post); 
?> 


<div class="high-first-item cf">
	<?php
		$thumb = get_post_thumbnail_id();
		$img_url = wp_get_attachment_url( $thumb,'full' ); //get full URL to image (use "large" or "medium" if the images too big)
		$image = aq_resize( $img_url, 280, 200, true ); //resize & crop the image
	?>
			
	<?php if($image) : ?>		
		<a href="<?php the_permalink(); ?>"><img class="firstim" src="<?php echo $image ?>"/></a>	
	<?php endif; ?>
	
<h2 class="tabh"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h2>
<div class="entry-meta">	<?php web2feel_posted_on(); ?>	</div><!-- .entry-meta -->
		<div class="entry-summary">
	<?php wpe_excerpt('wpe_excerptlength_index', ''); ?>
		</div>
</div>

<?php endforeach; ?>

</div>

<div class="grid_2 omega fright">
<?php

	$slidecategory = of_get_option('w2f_feature_category');
	
	$args = array( 'numberposts' =>4, 'offset'=>1, 'category'=> $slidecategory);
	$postslist = get_posts( $args );
	foreach ($postslist as $post) :  setup_postdata($post); 
?> 
<div class="high-rest-item cf">


	<h2 class="tabh"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h2>
	<div class="entry-meta">	<?php web2feel_posted_on(); ?>	</div><!-- .entry-meta -->

	<div class="entry-summary">
	 <?php wpe_excerpt('wpe_excerptlength_aside', ''); ?>
	</div>
</div>

<?php endforeach; ?>
<div class="clear"></div>
</div>

</div>			

