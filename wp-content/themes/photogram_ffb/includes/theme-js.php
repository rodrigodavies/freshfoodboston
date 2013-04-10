<?php
global $pagenow;
if ((!is_admin())&&($pagenow != 'wp-login.php')){add_action( 'wp_print_scripts', 'colabsthemes_add_javascript' );}

if (!function_exists('colabsthemes_add_javascript')) {

	function colabsthemes_add_javascript () {
        wp_enqueue_script('jquery');	

		wp_enqueue_style( 'fancybox', trailingslashit( get_template_directory_uri() ) . 'includes/css/fancybox/jquery.fancybox-1.3.4.css');
		wp_enqueue_script( 'plugins', trailingslashit( get_template_directory_uri() ) . 'includes/js/plugins.js', array('jquery') );
		wp_enqueue_script( 'scripts', trailingslashit( get_template_directory_uri() ) . 'includes/js/scripts.js', array('jquery') );
		wp_enqueue_style( 'googlefont', 'http://fonts.googleapis.com/css?family=Fjalla+One|Open+Sans:400,700|Pacifico|PT+Sans:400,700');
		
		$data = array(
			'theme_url' => get_template_directory_uri()
		);
		wp_localize_script('jquery', 'colabs_settings', $data);   
		$data2 = array(
			'ajaxurl' => admin_url('admin-ajax.php')
		);
		wp_localize_script('jquery', 'config', $data2);
		/* We add some JavaScript to pages with the comment form to support sites with threaded comments (when in use). */        
        	if ( is_singular() && get_option( 'thread_comments' ) ) wp_enqueue_script( 'comment-reply' );
        
	} /* // End colabsthemes_add_javascript() */
	
} /* // End IF Statement */

if ( ! isset( $content_width ) ) $content_width = 978;

/*-----------------------------------------------------------------------------------*/
/* Ajax action for set like
/*-----------------------------------------------------------------------------------*/
add_action( 'wp_ajax_nopriv_like', 'like' );
add_action( 'wp_ajax_like', 'like' );

function like() {
	$id = $_POST['id'];
	$votes = 1;
	$response = array();

	create_like( $id, $votes );
	$response['error'] = false;
	echo json_encode($response);
	exit;
}

?>
