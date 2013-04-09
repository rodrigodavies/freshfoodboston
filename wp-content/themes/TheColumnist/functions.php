<?php
add_theme_support( 'post-thumbnails' );

automatic_feed_links();

if ( function_exists('register_sidebar') ) {
	register_sidebar(array(
		'before_widget' => '<li id="%1$s" class="widget %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widgettitle">',
		'after_title' => '</h3>',
	));
}

// Changing excerpt length
function new_excerpt_length($length) {
	return 30;
}
add_filter('excerpt_length', 'new_excerpt_length');
 
// Changing excerpt more
function new_excerpt_more($more) {
	return '...';
}

// Custom image fields

$new_image_boxes =
  array(
  "large-image" => array(
	  "name" => "large-image",
	  "std" => "",
	  "title" => "Large Image (625x390)",
	  "description" => "Using the \"<em>Add an Image</em>\" button, upload a 625x390 image and paste the URL here."),
  "thumbnail" => array(
	  "name" => "thumbnail",
	  "std" => "",
	  "title" => "Thumbnail Image (140x180)",
	  "description" => "Using the \"<em>Add an Image</em>\" button, upload a 140x180 thumbnail image and paste the URL here."),
);

function new_image_boxes() {
  global $post, $new_image_boxes;
  
  foreach($new_image_boxes as $meta_box) {
    $meta_box_value = get_post_meta($post->ID, $meta_box['name'], true);
    
    if($meta_box_value == "")
      $meta_box_value = $meta_box['std'];
    
    echo'<input type="hidden" name="'.$meta_box['name'].'_noncename" id="'.$meta_box['name'].'_noncename" value="'.wp_create_nonce( plugin_basename(__FILE__) ).'" />';
    
    echo'<label style="font-weight: bold; display: block; padding: 5px 0 2px 2px" for="'.$meta_box['name'].'">'.$meta_box['title'].'</label>';
    
    echo'<input type="text" name="'.$meta_box['name'].'" value="'.$meta_box_value.'" size="55" /><br />';
    
    echo'<p><label for="'.$meta_box['name'].'">'.$meta_box['description'].'</label></p>';
  }
}

function create_meta_box() {
  global $theme_name;
  if ( function_exists('add_meta_box') ) {
    add_meta_box( 'new-meta-boxes', 'Image and Meta post settings', 'new_image_boxes', 'post', 'normal', 'high' );
  }
}

function save_postdata( $post_id ) {
  global $post, $new_image_boxes;
  
  foreach($new_image_boxes as $meta_box) {
  // Verify
  if ( !wp_verify_nonce( $_POST[$meta_box['name'].'_noncename'], plugin_basename(__FILE__) )) {
    return $post_id;
  }
  
  if ( 'page' == $_POST['post_type'] ) {
  if ( !current_user_can( 'edit_page', $post_id ))
    return $post_id;
  } else {
  if ( !current_user_can( 'edit_post', $post_id ))
    return $post_id;
  }
  
  $data = $_POST[$meta_box['name']];
  
  if(get_post_meta($post_id, $meta_box['name']) == "")
    add_post_meta($post_id, $meta_box['name'], $data, true);
  elseif($data != get_post_meta($post_id, $meta_box['name'], true))
    update_post_meta($post_id, $meta_box['name'], $data);
  elseif($data == "")
    delete_post_meta($post_id, $meta_box['name'], get_post_meta($post_id, $meta_box['name'], true));
  }
}


add_action('admin_menu', 'create_meta_box');
add_action('save_post', 'save_postdata');

?>