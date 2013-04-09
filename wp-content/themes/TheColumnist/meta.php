<div class="meta">
  <ul>  
	<?php //get meta custom fields
    $date = get_post_meta($post->ID, 'date', true); 
    $time = get_post_meta($post->ID, 'time', true); 
    $price = get_post_meta($post->ID, 'price', true); 
    $rsvp = get_post_meta($post->ID, 'rsvp', true); 
    $photo = get_post_meta($post->ID, 'photo', true); 
    if ($date) {
    echo "<li><span>Date:</span> $date </li>";
    }
    if ($time) {
    echo "<li><span>Time:</span> $time </li>";
    }
    if ($price) {
    echo "<li><span>Price:</span> $price </li>";
    }
    if ($rsvp) {
    echo "<li><span>RSVP:</span> $rsvp </li>";
    }
    if ($photo) {
    echo "<li><span>Photo:</span> $photo </li>";
    }
    else {
    } ?>
  </ul>
</div>

<div class="meta">
  <p>Posted in <?php the_category(', ') ?></p>
  <p><?php comments_popup_link('No Comments', '1 Comment', '% Comments'); ?></p>
  <p><?php the_tags('Tagged with ', ', ', ''); ?></p>
  <p><?php edit_post_link('Edit this post', '', ' &rarr;'); ?></p>
</div>