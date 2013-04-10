<?php
/*-----------------------------------------------------------------------------------*/
/* Start ColorLabs Functions - Please refrain from editing this section */
/*-----------------------------------------------------------------------------------*/
//error_reporting(1);

// Set path to ColorLabs Framework and theme specific functions
$functions_path = get_template_directory() . '/functions/';
$includes_path = get_template_directory() . '/includes/';

// ColorLabs Admin
require_once ($functions_path . 'admin-init.php');			// Admin Init

// ColorLabs Includes
require_once ($includes_path . 'theme-js.php');
require_once ($includes_path . 'theme-functions.php');
require_once ($includes_path . 'theme-options.php');
require_once ($includes_path . 'theme-widgets.php');
require_once ($includes_path . 'theme-sidebar-init.php');
require_once ($includes_path . 'theme-custom-type.php');
require_once ($includes_path . 'theme-comments.php');

if ( ! isset( $content_width ) ) $content_width = 978;

// Define Theme Colors
if ( ! isset( $themecolors ) ) {
$themecolors = array(
'bg' => 'CCCCCC',
'text' => 'FFFFFF',
'link' => 'FFD400',
'url' => 'FFD400',
);
}

add_action('wp_head', 'add_iestyle', 5); // hook add_framework_style() into wp_head()
function add_iestyle(){
?>
  <!--[if lte IE 8]>
<style type="text/css">
	.widget_colabs_flickr a {
		width: 75px;
		margin-right:0px;
	}
	img{
		max-width:none;
	}
</style>
<![endif]-->
<?php		
global $is_IE;
		
if($is_IE)
	wp_enqueue_script( 'iehtml5', 'http://html5shiv.googlecode.com/svn/trunk/html5.js', array('jquery') );
}
?>
