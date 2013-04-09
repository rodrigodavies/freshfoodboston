<div id="ticker">
<ul>
<?php

$flashcount =  of_get_option('w2f_flash_count');
$flashcategory = of_get_option('w2f_flash_category');

$args = array( 'numberposts' => $flashcount, 'category'=> $flashcategory);
$postslist = get_posts( $args );
foreach ($postslist as $post) :  setup_postdata($post); ?> 
	<li> <a href="<?php the_permalink(); ?>"> <?php the_title(); ?> </a>	</li>
<?php endforeach; ?>
</ul>
</div>