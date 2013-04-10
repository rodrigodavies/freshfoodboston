<?php

//Enable CoLabsSEO on these custom Post types
//$seo_post_types = array('post','page');
//define("SEOPOSTTYPES", serialize($seo_post_types));

//Global options setup
add_action('init','colabs_global_options');
function colabs_global_options(){
	// Populate CoLabsThemes option in array for use in theme
	global $colabs_options;
	$colabs_options = get_option('colabs_options');
}

add_action('admin_head','colabs_options');  
if (!function_exists('colabs_options')) {
function colabs_options(){
	
// VARIABLES
$themename = "Photogram";
$manualurl = 'http://colorlabsproject.com';
$shortname = "photogram";

	
//More Options
$other_entries = array("Select a number:","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19");

$other_entries_10 = array("Select a number:","1","2","3","4","5","6","7","8","9","10");

$other_entries_4 = array("Select a number:","1","2","3","4");

$other_entries_5 = array("1","2","3","4","5");

$other_entries_65 = array("Select a number:","10","15","20","25","30","35","40","45","50","55","60","65");

// THIS IS THE DIFFERENT FIELDS
$options = array();

// General Settings
$options[] = array( "name" => __("General Settings","colabsthemes"),
					"type" => "heading",
					"icon" => "general");			
					
$options[] = array( "name" => __( "Use for blog title/logo", "colabsthemes" ),
					"desc" => __( "Select title or logo for your blog.", "colabsthemes" ),
					"id" => $shortname."_logotitle",
					"std" => "logo",
					"type" => "select2",
					"options" => array( "logo" => __( "Logo", "colabsthemes" ), "title" => __( "Title", "colabsthemes" ) ) );
                    
$options[] = array( "name" => __("Custom Favicon","colabsthemes"),
					"desc" => __("Upload a 16x16px ico image that will represent your website's favicon. Favicon/bookmark icon will be shown at the left of your blog's address in visitor's internet browsers.","colabsthemes"),
					"id" => $shortname."_custom_favicon",
					"std" => get_template_directory_uri() . "/images/favicon.png",
					"type" => "upload"); 

$options[] = array( "name" => __("Header Custom Logo","colabsthemes"),
					"desc" => __("Upload a logo for your theme, or specify an image URL directly. Best image size in 219x48 px","colabsthemes"),
					"id" => $shortname."_logo",
					"std" => get_template_directory_uri() . "/images/logo.png",
					"type" => "upload");

$options[] = array( "name" => __("Show Content","colabsthemes"),
					"desc" => __("Show The Content in archive.","colabsthemes"),
					"id" => $shortname."_custom_excerpt",
					"std" => "false",
					"type" => "checkbox");

$options[] = array( "name" => "Disable Responsive",
					"desc" => "You can disable responsive module for your site.",
					"id" => $shortname."_disable_mobile",
					"std" => "false",
					"type" => "checkbox");
					
// Posts FrontPage Options						
$options[] = array( "name" => __("FrontPage Settings","colabsthemes"),
					"type" => "heading",
					"icon" => "home");		 				
					
$options[] = array( "name" => __("FrontPage Title", "colabsthemes" ),
					"desc" => __("Entry Title Posts in here.", "colabsthemes" ),
					"id" => $shortname."_title",
					"std" => "Most Popular Photograph",
					"class" => "",
					"type" => "text");
					
$options[] = array( "name" => __( "Home Page Content", "colabsthemes" ),
					"desc" => __( "Select Post, Photographs, Pinterest, Instragram.", "colabsthemes" ),
					"id" => $shortname."_home",
					"std" => "Posts",
					"type" => "select2",
					"options" => array( "Posts" => __("Posts", "colabsthemes"), "Picasa" => __("Picasa", "colabsthemes"), "Photographs" => __("Photographs", "colabsthemes"), "Pinterest" => __("Pinterest", "colabsthemes"), "Dribbble" => __("Dribbble", "colabsthemes") ) );
	
// Picasa FrontPage Options	
$options[] = array( "name" => __("Picasa Settings","colabsthemes"),
					"type" => "heading",
					"icon" => "home");	
					
$options[] = array( "name" => __("Picasa Username", "colabsthemes" ),
					"desc" => __("Entry Picasa Username in here.", "colabsthemes" ),
					"id" => $shortname."_username_picasa",
					"std" => "113539730014413629030",
					"type" => "text");
					
$options[] = array( "name" => __( "Count Picasa", "colabsthemes" ),
					"desc" => __( "Entry the limit for Picasa.", "colabsthemes" ),
					"id" => $shortname."_piccount_picasa",
					"std" => "10",
					"class" => "",
					"type" => "text");	
		
// Pinterest FrontPage Options	
$options[] = array( "name" => __("Pinterest Settings","colabsthemes"),
					"type" => "heading",
					"icon" => "home");							
												
$options[] = array( "name" => __("Pinterest Username", "colabsthemes" ),
					"desc" => __("Entry pinterest username in here.", "colabsthemes" ),
					"id" => $shortname."_username_pinterest",
					"class" => "",
					"std" => "",
					"type" => "text");
					
$options[] = array( "name" => __( "Count Pinterest", "colabsthemes" ),
					"desc" => __( "Entry the limit for pinterest.", "colabsthemes" ),
					"id" => $shortname."_piccount_pinterest",
					"std" => "10",
					"class" => "",
					"type" => "text");
					
$options[] = array( "name" => __("Specific Board (optional):", "colabsthemes" ),
					"desc" => __("Enter the specific board for the pinterest", "colabsthemes" ),
					"id" => $shortname."_board_pinterest",
					"class" => "",
					"std" => "",
					"type" => "text");		
					
// Dribbble FrontPage Options	
$options[] = array( "name" => __("Dribbble Settings","colabsthemes"),
					"type" => "heading",
					"icon" => "home");							
												
$options[] = array( "name" => __("Dribbble Username", "colabsthemes" ),
					"desc" => __("Entry dribbble username in here.", "colabsthemes" ),
					"id" => $shortname."_username_dribbble",
					"class" => "",
					"std" => "",
					"type" => "text");
					
$options[] = array( "name" => __( "Count Dribbble", "colabsthemes" ),
					"desc" => __( "Entry the limit for dribbble.", "colabsthemes" ),
					"id" => $shortname."_piccount_dribbble",
					"std" => "10",
					"class" => "",
					"type" => "text");
					
/* 
/* //Social Settings	 */				
$options[] = array( "name" => __("Social Networking","colabsthemes"),
					"icon" => "misc",
					"type" => "heading");
                    
$options[] = array( "name" => __("Facebook","colabsthemes"),
					"desc" => __("Enter your Facebook profile URL","colabsthemes"),
					"id" => $shortname."_social_facebook",
					"std" => "",
					"type" => "text");  

$options[] = array( "name" => __("Twitter","colabsthemes"),
					"desc" => __("Enter your Twitter URL","colabsthemes"),
					"id" => $shortname."_social_twitter",
					"std" => "",
					"type" => "text");
					
$options[] = array( "name" => __( "Flickr URL", "colabsthemes" ),
					"desc" => __( "Enter your Flickr URL", "colabsthemes" ),
					"id" => $shortname."_social_flickr",
					"std" => "",
					"type" => "text");				

$options[] = array( "name" => __( "Picasa URL", "colabsthemes" ),
					"desc" => __( "Enter your Picasa account", "colabsthemes" ),
					"id" => $shortname."_social_picasa",
					"std" => "",
					"type" => "text");

$options[] = array( "name" => __( "WordPress URL", "colabsthemes" ),
					"desc" => __( "Enter your WordPress account", "colabsthemes" ),
					"id" => $shortname."_social_wordpress",
					"std" => "",
					"type" => "text");
					
$options[] = array( "name" => __( "Google URL", "colabsthemes" ),
					"desc" => __( "Enter your Google URL", "colabsthemes" ),
					"id" => $shortname."_social_google",
					"std" => "",
					"type" => "text");

$options[] = array( "name" => __( "Vimeo URL", "colabsthemes" ),
					"desc" => __( "Enter your Vimeo URL", "colabsthemes" ),
					"id" => $shortname."_social_vimeo",
					"std" => "",
					"type" => "text");					

$options[] = array( "name" => __( "LinkedIn URL", "colabsthemes" ),
					"desc" => __( "Enter your LinkedIn URL", "colabsthemes" ),
					"id" => $shortname."_social_linked",
					"std" => "",
					"type" => "text");
					
$options[] = array( "name" => __("Enable/Disable Social Share Button","colabsthemes" ),
					"desc" => __("Select which social share button you would like to enable.","colabsthemes" ),
					"id" => $shortname."_share",
					"std" => array("fblike","twitter","google_plusone"),
					"type" => "multicheck2",
                    "class" => "",
					"options" => array(
                                    "fblike" => "Facebook Like Button",
                                    "twitter" => "Twitter Share Button",
                                    "google_plusone" => "Google +1 Button",
									"pinterest" => "Pinterest",
									"linkedin" => "Linked In"
                                )
                    );
                    
// Open Graph Settings
$options[] = array( "name" => __("Open Graph Settings","colabsthemes"),
					"type" => "heading",
					"icon" => "graph");

$options[] = array( "name" => __("Open Graph","colabsthemes"),
					"desc" => __("Enable or disable Open Graph Meta tags.","colabsthemes"),
					"id" => $shortname."_og_enable",
					"type" => "select2",
                    "std" => "",
                    "class" => "collapsed",
					"options" => array("" => "Enable", "disable" => "Disable") );

$options[] = array( "name" => __("Site Name","colabsthemes"),
					"desc" => __("Open Graph Site Name ( og:site_name ).","colabsthemes"),
					"id" => $shortname."_og_sitename",
					"std" => "",
                    "class" => "hidden",
					"type" => "text");

$options[] = array( "name" => __("Admin","colabsthemes"),
					"desc" => __("Open Graph Admin ( fb:admins ).","colabsthemes"),
					"id" => $shortname."_og_admins",
					"std" => "",
                    "class" => "hidden",
					"type" => "text");

$options[] = array( "name" => __("Image","colabsthemes"),
					"desc" => __("You can put the url for your Open Graph Image ( og:image ).","colabsthemes"),
					"id" => $shortname."_og_img",
					"std" => "",
                    "class" => "hidden last",
					"type" => "text");
 
//Dynamic Images 					                   
$options[] = array( "name" => __("Thumbnail Settings","colabsthemes"),
					"type" => "heading",
					"icon" => "image");
                    
$options[] = array( "name" => __("WordPress Featured Image","colabsthemes"),
					"desc" => __("Use WordPress Featured Image for post thumbnail.","colabsthemes"),
					"id" => $shortname."_post_image_support",
					"std" => "true",
					"class" => "collapsed",
					"type" => "checkbox");

$options[] = array( "name" => __("WordPress Featured Image - Dynamic Resize","colabsthemes"),
					"desc" => __("Resize post thumbnail dynamically using WordPress native functions (requires PHP 5.2+).","colabsthemes"),
					"id" => $shortname."_pis_resize",
					"std" => "true",
					"class" => "hidden",
					"type" => "checkbox");
                    
$options[] = array( "name" => __("WordPress Featured Image - Hard Crop","colabsthemes"),
					"desc" => __("Original image will be cropped to match the target aspect ratio.","colabsthemes"),
					"id" => $shortname."_pis_hard_crop",
					"std" => "true",
					"class" => "hidden last",
					"type" => "checkbox");
                    
$options[] = array( "name" => __("Automatic Thumbnail","colabsthemes"),
					"desc" => __("Generate post thumbnail from the first image uploaded in post (if there is no image specified through post custom field or WordPress Featured Image feature).","colabsthemes"),
					"id" => $shortname."_auto_img",
					"std" => "true",
					"type" => "checkbox");
                    
$options[] = array( "name" => __("Thumbnail Image in RSS Feed","colabsthemes"),
					"desc" => __("Add post thumbnail to RSS feed article.","colabsthemes"),
					"id" => $shortname."_rss_thumb",
					"std" => "false",
					"type" => "checkbox");

$options[] = array( "name" => __("Thumbnail Image Dimensions","colabsthemes"),
					"desc" => __("Enter an integer value i.e. 250 for the desired size which will be used when dynamically creating the images.","colabsthemes"),
					"id" => $shortname."_image_dimensions",
					"std" => "",
					"type" => array( 
									array(  'id' => $shortname. '_thumb_w',
											'type' => 'text',
											'std' => 100,
											'meta' => 'Width'),
									array(  'id' => $shortname. '_thumb_h',
											'type' => 'text',
											'std' => 100,
											'meta' => 'Height')
								  ));

$options[] = array( "name" => __("Custom Field Image","colabsthemes"),
					"desc" => __("Enter your custom field image name to change the default name (default name: image).","colabsthemes"),
					"id" => $shortname."_custom_field_image",
					"std" => "",
					"type" => "text");
					
// Analytics ID, RSS feed
$options[] = array( "name" => __("Analytics ID, RSS feed","colabsthemes"),
					"type" => "heading",
					"icon" => "statistics");

$options[] = array( "name" => __("Enable PressTrends Tracking","colabsthemes"),
					"desc" => __("PressTrends is a simple usage tracker that allows us to see how our customers are using our themes, so that we can help improve them for you. <strong>None</strong> of your personal data is sent to PressTrends.","colabsthemes"),
					"id" => $shortname."_pt_enable",
					"std" => "true",
					"type" => "checkbox");
					
$options[] = array( "name" => __("GoSquared Token","colabsthemes"),
					"desc" => __("You can use <a href='http://www.gosquared.com/livestats/?ref=11674'>GoSquared</a> real-time web analytics. Enter your <strong>GoSquared Token</strong> here (ex. GSN-893821-D).","colabsthemes"),
					"id" => $shortname."_gosquared_id",
					"std" => "",
					"type" => "text");

$options[] = array( "name" => __("Google Analytics","colabsthemes"),
					"desc" => __("Manage your website statistics with Google Analytics, put your Analytics Code here. ","colabsthemes"),
					"id" => $shortname."_google_analytics",
					"std" => "",
					"type" => "textarea");

$options[] = array( "name" => __("Feedburner ID","colabsthemes"),
					"desc" => __("Enter your Feedburner ID.","colabsthemes"),
					"id" => $shortname."_feedid",
					"std" => "",
					"type" => "text");
					
$options[] = array( "name" => __("Feedburner URL","colabsthemes"),
					"desc" => __("Feedburner URL. This will replace RSS feed link. Start with http://.","colabsthemes"),
					"id" => $shortname."_feedlinkurl",
					"std" => "",
					"type" => "text");

$options[] = array( "name" => __("Feedburner Comments URL","colabsthemes"),
					"desc" => __("Feedburner URL. This will replace RSS comment feed link. Start with http://.","colabsthemes"),
					"id" => $shortname."_feedlinkcomments",
					"std" => "",
					"type" => "text");
					
/* //Contact Form */
$options[] = array( "name" => __("Contact Form","colabsthemes"),
					"type" => "heading",
					"icon" => "general");
                    
$options[] = array( "name" => __("Destination Email Address","colabsthemes"),
					"desc" => __("All inquiries made by your visitors through the Contact Form page will be sent to this email address.","colabsthemes"),
					"id" => $shortname."_contactform_email",
					"std" => "",
					"type" => "text"); 
				

if ( get_option('colabs_template') != $options) update_option('colabs_template',$options);      
if ( get_option('colabs_themename') != $themename) update_option('colabs_themename',$themename);   
if ( get_option('colabs_shortname') != $shortname) update_option('colabs_shortname',$shortname);
if ( get_option('colabs_manual') != $manualurl) update_option('colabs_manual',$manualurl);

//PressTrends
$colabs_pt_auth = "3bkal5czl80s94uurt8ku5rj3riwbtjt7"; 
update_option('colabs_pt_auth',$colabs_pt_auth);

// CoLabs Metabox Options
// Start name with underscore to hide custom key from the user
$colabs_metaboxes = array();
$colabs_metabox_settings = array();
global $post;

    //Metabox Settings
    $colabs_metabox_settings['post'] = array(
                                'id' => 'colabsthemes-settings',
								'title' => 'ColorLabs' . __( ' Post Detail Settings', 'colabsthemes' ),
								'callback' => 'colabsthemes_metabox_create',
								'page' => 'post',
								'context' => 'normal',
								'priority' => 'high',
                                'callback_args' => ''
								);
												
                                   							

if ( ( 'post' == get_post_type()) ) {
	
	$colabs_metaboxes[] = array (  "name"  => $shortname."_single_top",
					            "std"  => "Image",
					            "label" => "Item to Show",
					            "type" => "radio",
								"class" => "",
					            "desc" => "Choose Image/Embed Code to appear at the single top.",
								"options" => array(	"none" => "None",
													"single_image" => "Image",
													"single_video" => "Embed" ));
	$colabs_metaboxes[] = array (	"name" => "image",
								"label" => "Post Custom Image",
								"type" => "upload",
                                "class" => "single_image",
								"desc" => "Upload an image or enter an URL.");
	
	$colabs_metaboxes[] = array (  "name"  => $shortname."_embed",
					            "std"  => "",
					            "label" => "Video Embed Code",
					            "type" => "textarea",
                                "class" => "single_video",
					            "desc" => "Enter the video embed code for your video (YouTube, Vimeo or similar)");
	
								
								
}


if ( get_option('colabs_custom_template') != $colabs_metaboxes){
    update_option('colabs_custom_template',$colabs_metaboxes);
    }
if ( get_option('colabs_metabox_settings') != $colabs_metabox_settings){
    update_option('colabs_metabox_settings',$colabs_metabox_settings);
    }
     
}
}



?>