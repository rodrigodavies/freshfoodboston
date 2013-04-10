<?php
add_action('init', 'photograph_register');

if ( ! function_exists( 'photograph_register' ) ) {
	function photograph_register() {
		
		$labels = array(
				'name'=> __('Photographs',"colabsthemes"),
				'singular_name' => __('Photograph',"colabsthemes"),
				'add_new' => __('Add New',"colabsthemes"),
				'add_new_item' => __('Add New',"colabsthemes"),
				'edit_item' => __('Edit Photograph',"colabsthemes"),
				'new-item' => __('New Photograph',"colabsthemes"),
				'all_items' => __('All Photographs',"colabsthemes"),
				'view_item' => __('View Photograph',"colabsthemes"),
				'search_items' => __('Search Photograph',"colabsthemes"),
				'not_found' => __('No Photograph Found',"colabsthemes"),
				'not_found_in_trash' => __('No Photograph Found in Trash',"colabsthemes"),
				'parent_item_colon' => __('Parent Photograph',"colabsthemes"),
				'menu_name' => __('Photographs',"colabsthemes")
		  );

		  $args = array(
			'labels' => $labels,
			'public' => true,
			'publicly_queryable' => true,
			'show_ui' => true, 
			'show_in_menu' => true, 
			'query_var' => true,
			'rewrite' => array( 'slug' => 'photograph' ),
			'capability_type' => 'post',
			'has_archive' => true, 
			'hierarchical' => false,
			'menu_position' => 4,
			'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'comments' ),
			'menu_icon' => get_template_directory_uri() .'/images/photograph.png'
		  ); 
		register_post_type( 'photograph' , $args );
		
		 
		register_taxonomy('photograph-categories',
				array ( 'photograph' ),
				array (
				'labels' => array (
						'name' => __('Categories',"colabsthemes"),
						'singular_name' => __('Categoriy',"colabsthemes"),
						'search_items' => __('Search Photograph Categories',"colabsthemes"),
						'popular_items' => __('Popular Photograph Categories',"colabsthemes"),
						'all_items' => __('All Photograph Categories',"colabsthemes"),
						'parent_item' => __('Parent Photograph Categories',"colabsthemes"),
						'parent_item_colon' => __('Parent Photograph Categories:',"colabsthemes"),
						'edit_item' => __('Edit Photograph Categories',"colabsthemes"),
						'update_item' => __('Update Photograph Categories',"colabsthemes"),
						'add_new_item' => __('Add New Photograph Categories',"colabsthemes"),
						'new_item_name' => __('New Photograph Categories',"colabsthemes"),
						),
						'hierarchical' =>true,
						'show_ui' => true,
						'show_tagcloud' => true,
						'query_var' => true,
						'rewrite' => array( 'slug' => 'photograph-categories' ),
				));
		flush_rewrite_rules();
		
	}
}

add_filter("manage_edit-photograph_columns", "photograph_edit_columns");   
  
function photograph_edit_columns($columns){  
        $columns = array(  
            "cb" => "<input type=\"checkbox\" />",  
            "title" => __("Photograph","colabsthemes"), 
            "photograph-categories" => __("Categories","colabsthemes"), 
            "likes" => __("Likes","colabsthemes"),
            "photo" => __("Photo","colabsthemes"),
            "date" => __("Date","colabsthemes"),
              
        );  
  
        return $columns;  
}  

add_action("manage_photograph_posts_custom_column",  "photograph_custom_columns"); 
  
function photograph_custom_columns($column){  
        global $post;  
        switch ($column){    
            case "photograph-categories":  
                echo get_the_term_list($post->ID, 'photograph-categories', '', ', ','');  
                break; 
            case "likes":
				if(function_exists('get_like')){
				if(isset($post->ID))
				echo get_like($post->ID);
				}
				break;
            case "photo":
				if(has_post_thumbnail()) the_post_thumbnail('thumbnail');
				break;	
        }  
}  

?>