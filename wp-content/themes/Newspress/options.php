<?php
/**
 * A unique identifier is defined to store the options in the database and reference them from the theme.
 * By default it uses the theme name, in lowercase and without spaces, but this can be changed if needed.
 * If the identifier changes, it'll appear as if the options have been reset.
 * 
 */

function optionsframework_option_name() {

	// This gets the theme name from the stylesheet (lowercase and without spaces)
	$themename = get_option( 'stylesheet' );
	$themename = preg_replace("/\W/", "_", strtolower($themename) );
	
	$optionsframework_settings = get_option('optionsframework');
	$optionsframework_settings['id'] = $themename;
	update_option('optionsframework', $optionsframework_settings);
	
	// echo $themename;
}

/**
 * Defines an array of options that will be used to generate the settings page and be saved in the database.
 * When creating the "id" fields, make sure to use all lowercase and no spaces.
 *  
 */

function optionsframework_options() {
	
	$timezones = array(
    'Pacific/Midway'    => "(GMT-11:00) Midway Island",
    'US/Samoa'          => "(GMT-11:00) Samoa",
    'US/Hawaii'         => "(GMT-10:00) Hawaii",
    'US/Alaska'         => "(GMT-09:00) Alaska",
    'US/Pacific'        => "(GMT-08:00) Pacific Time (US &amp; Canada)",
    'America/Tijuana'   => "(GMT-08:00) Tijuana",
    'US/Arizona'        => "(GMT-07:00) Arizona",
    'US/Mountain'       => "(GMT-07:00) Mountain Time (US &amp; Canada)",
    'America/Chihuahua' => "(GMT-07:00) Chihuahua",
    'America/Mazatlan'  => "(GMT-07:00) Mazatlan",
    'America/Mexico_City' => "(GMT-06:00) Mexico City",
    'America/Monterrey' => "(GMT-06:00) Monterrey",
    'Canada/Saskatchewan' => "(GMT-06:00) Saskatchewan",
    'US/Central'        => "(GMT-06:00) Central Time (US &amp; Canada)",
    'US/Eastern'        => "(GMT-05:00) Eastern Time (US &amp; Canada)",
    'US/East-Indiana'   => "(GMT-05:00) Indiana (East)",
    'America/Bogota'    => "(GMT-05:00) Bogota",
    'America/Lima'      => "(GMT-05:00) Lima",
    'America/Caracas'   => "(GMT-04:30) Caracas",
    'Canada/Atlantic'   => "(GMT-04:00) Atlantic Time (Canada)",
    'America/La_Paz'    => "(GMT-04:00) La Paz",
    'America/Santiago'  => "(GMT-04:00) Santiago",
    'Canada/Newfoundland'  => "(GMT-03:30) Newfoundland",
    'America/Buenos_Aires' => "(GMT-03:00) Buenos Aires",
    'Greenland'         => "(GMT-03:00) Greenland",
    'Atlantic/Stanley'  => "(GMT-02:00) Stanley",
    'Atlantic/Azores'   => "(GMT-01:00) Azores",
    'Atlantic/Cape_Verde' => "(GMT-01:00) Cape Verde Is.",
    'Africa/Casablanca' => "(GMT) Casablanca",
    'Europe/Dublin'     => "(GMT) Dublin",
    'Europe/Lisbon'     => "(GMT) Lisbon",
    'Europe/London'     => "(GMT) London",
    'Africa/Monrovia'   => "(GMT) Monrovia",
    'Europe/Amsterdam'  => "(GMT+01:00) Amsterdam",
    'Europe/Belgrade'   => "(GMT+01:00) Belgrade",
    'Europe/Berlin'     => "(GMT+01:00) Berlin",
    'Europe/Bratislava' => "(GMT+01:00) Bratislava",
    'Europe/Brussels'   => "(GMT+01:00) Brussels",
    'Europe/Budapest'   => "(GMT+01:00) Budapest",
    'Europe/Copenhagen' => "(GMT+01:00) Copenhagen",
    'Europe/Ljubljana'  => "(GMT+01:00) Ljubljana",
    'Europe/Madrid'     => "(GMT+01:00) Madrid",
    'Europe/Paris'      => "(GMT+01:00) Paris",
    'Europe/Prague'     => "(GMT+01:00) Prague",
    'Europe/Rome'       => "(GMT+01:00) Rome",
    'Europe/Sarajevo'   => "(GMT+01:00) Sarajevo",
    'Europe/Skopje'     => "(GMT+01:00) Skopje",
    'Europe/Stockholm'  => "(GMT+01:00) Stockholm",
    'Europe/Vienna'     => "(GMT+01:00) Vienna",
    'Europe/Warsaw'     => "(GMT+01:00) Warsaw",
    'Europe/Zagreb'     => "(GMT+01:00) Zagreb",
    'Europe/Athens'     => "(GMT+02:00) Athens",
    'Europe/Bucharest'  => "(GMT+02:00) Bucharest",
    'Africa/Cairo'      => "(GMT+02:00) Cairo",
    'Africa/Harare'     => "(GMT+02:00) Harare",
    'Europe/Helsinki'   => "(GMT+02:00) Helsinki",
    'Europe/Istanbul'   => "(GMT+02:00) Istanbul",
    'Asia/Jerusalem'    => "(GMT+02:00) Jerusalem",
    'Europe/Kiev'       => "(GMT+02:00) Kyiv",
    'Europe/Minsk'      => "(GMT+02:00) Minsk",
    'Europe/Riga'       => "(GMT+02:00) Riga",
    'Europe/Sofia'      => "(GMT+02:00) Sofia",
    'Europe/Tallinn'    => "(GMT+02:00) Tallinn",
    'Europe/Vilnius'    => "(GMT+02:00) Vilnius",
    'Asia/Baghdad'      => "(GMT+03:00) Baghdad",
    'Asia/Kuwait'       => "(GMT+03:00) Kuwait",
    'Europe/Moscow'     => "(GMT+03:00) Moscow",
    'Africa/Nairobi'    => "(GMT+03:00) Nairobi",
    'Asia/Riyadh'       => "(GMT+03:00) Riyadh",
    'Europe/Volgograd'  => "(GMT+03:00) Volgograd",
    'Asia/Tehran'       => "(GMT+03:30) Tehran",
    'Asia/Baku'         => "(GMT+04:00) Baku",
    'Asia/Muscat'       => "(GMT+04:00) Muscat",
    'Asia/Tbilisi'      => "(GMT+04:00) Tbilisi",
    'Asia/Yerevan'      => "(GMT+04:00) Yerevan",
    'Asia/Kabul'        => "(GMT+04:30) Kabul",
    'Asia/Yekaterinburg' => "(GMT+05:00) Ekaterinburg",
    'Asia/Karachi'      => "(GMT+05:00) Karachi",
    'Asia/Tashkent'     => "(GMT+05:00) Tashkent",
    'Asia/Kolkata'      => "(GMT+05:30) Kolkata",
    'Asia/Kathmandu'    => "(GMT+05:45) Kathmandu",
    'Asia/Almaty'       => "(GMT+06:00) Almaty",
    'Asia/Dhaka'        => "(GMT+06:00) Dhaka",
    'Asia/Novosibirsk'  => "(GMT+06:00) Novosibirsk",
    'Asia/Bangkok'      => "(GMT+07:00) Bangkok",
    'Asia/Jakarta'      => "(GMT+07:00) Jakarta",
    'Asia/Krasnoyarsk'  => "(GMT+07:00) Krasnoyarsk",
    'Asia/Chongqing'    => "(GMT+08:00) Chongqing",
    'Asia/Hong_Kong'    => "(GMT+08:00) Hong Kong",
    'Asia/Irkutsk'      => "(GMT+08:00) Irkutsk",
    'Asia/Kuala_Lumpur' => "(GMT+08:00) Kuala Lumpur",
    'Australia/Perth'   => "(GMT+08:00) Perth",
    'Asia/Singapore'    => "(GMT+08:00) Singapore",
    'Asia/Taipei'       => "(GMT+08:00) Taipei",
    'Asia/Ulaanbaatar'  => "(GMT+08:00) Ulaan Bataar",
    'Asia/Urumqi'       => "(GMT+08:00) Urumqi",
    'Asia/Seoul'        => "(GMT+09:00) Seoul",
    'Asia/Tokyo'        => "(GMT+09:00) Tokyo",
    'Asia/Yakutsk'      => "(GMT+09:00) Yakutsk",
    'Australia/Adelaide' => "(GMT+09:30) Adelaide",
    'Australia/Darwin'  => "(GMT+09:30) Darwin",
    'Australia/Brisbane' => "(GMT+10:00) Brisbane",
    'Australia/Canberra' => "(GMT+10:00) Canberra",
    'Pacific/Guam'      => "(GMT+10:00) Guam",
    'Australia/Hobart'  => "(GMT+10:00) Hobart",
    'Australia/Melbourne' => "(GMT+10:00) Melbourne",
    'Pacific/Port_Moresby' => "(GMT+10:00) Port Moresby",
    'Australia/Sydney'  => "(GMT+10:00) Sydney",
    'Asia/Vladivostok'  => "(GMT+10:00) Vladivostok",
    'Asia/Magadan'      => "(GMT+11:00) Magadan",
    'Pacific/Auckland'  => "(GMT+12:00) Auckland",
    'Pacific/Fiji'      => "(GMT+12:00) Fiji",
    'Asia/Kamchatka'    => "(GMT+12:00) Kamchatka",
);

	
	
	// Test data
	$test_array = array("1" => "Tutorials","2" => "Posts");
	
	// Multicheck Array
	$multicheck_array = array("one" => "French Toast", "two" => "Pancake", "three" => "Omelette", "four" => "Crepe", "five" => "Waffle");
	
	// Multicheck Defaults
	$multicheck_defaults = array("one" => "1","five" => "1");
	
	// Background Defaults
	
	$background_defaults = array('color' => '', 'image' => '', 'repeat' => 'repeat','position' => 'top center','attachment'=>'scroll');
	
	
	// Pull all the categories into an array
	$options_categories = array();  
	$options_categories_obj = get_categories();
	foreach ($options_categories_obj as $category) {
    	$options_categories[$category->cat_ID] = $category->cat_name;
	}
	
	
/*
	$genre_tax = array();
$genre_args = array( 'hide_empty' => '0' );
$genre_terms = get_terms('genre', $genre_args);

foreach ( $genre_terms as $genre_term) {
    $genre_tax[$genre_term->slug] = $genre_term->slug;
}
$genre_tax_tmp = array_unshift($genre_tax, "Select a genre:");
*/
	
	
	// Pull all the pages into an array
	$options_pages = array();  
	$options_pages_obj = get_pages('sort_column=post_parent,menu_order');
	$options_pages[''] = 'Select a page:';
	foreach ($options_pages_obj as $page) {
    	$options_pages[$page->ID] = $page->post_title;
	}
		
	// If using image radio buttons, define a directory path
	$imagepath =  get_bloginfo('stylesheet_directory') . '/images/';
		
	$options = array();
	
	
		

	$options[] = array( "name" => "Homepage",
						"type" => "heading");	
						
						
	$options[] = array( "name" => "Timezone",
						"desc" => "Select your timezone",
						"id" => "w2f_timezone",
						"std" => "Europe/Dublin",
						"type" => "select",
						"options" => $timezones);			
						
						
	$options[] = array( "name" => "Flash Category",
						"desc" => "Select a category for the flash news ticker",
						"id" => "w2f_flash_category",
						"type" => "select",
						"options" => $options_categories);						
						
	$options[] = array( "name" => "Number of flash news items",
						"desc" => "Enter the number of posts",
						"id" => "w2f_flash_count",
						"std" => "",
						"type" => "text");								
						
						
	$options[] = array( "name" => "Featured news Category",
						"desc" => "Select a category for the Featured news section",
						"id" => "w2f_feature_category",
						"type" => "select",
						"options" => $options_categories);								
						
						
	$options[] = array( "name" => "Banner Settings",
						"type" => "heading");		
						
						
						
	$options[] = array( "name" => "Banner 1 Image",
						"desc" => "Enter your 125 x 125 banner image url here..",
						"id" => "w2f_banner1",
						"std" => "http://web2feel.com/images/webhostinghub.png",
						"type" => "text");		
						
	$options[] = array( "name" => "Banner 1 Image alt tag",
						"desc" => "Enter your banner alt tag.",
						"id" => "w2f_alt1",
						"std" => "Cheap reliable web hosting from WebHostingHub.com",
						"type" => "text");		
						
	$options[] = array( "name" => "Banner 1 Url",
						"desc" => "Enter your banner-1 url here.",
						"id" => "w2f_url1",
						"std" => "http://www.webhostinghub.com/",
						"type" => "text");						
						
	$options[] = array( "name" => "Banner 1 link title",
						"desc" => "Enter your banner-1 title here.",
						"id" => "w2f_lab1",
						"std" => "Web Hosting Hub - Cheap reliable web hosting.",
						"type" => "text");						
						


	$options[] = array( "name" => "Banner 2 Image",
						"desc" => "Enter your 125 x 125 banner image url here..",
						"id" => "w2f_banner2",
						"std" => "http://web2feel.com/images/pcnames.png",
						"type" => "text");		

	$options[] = array( "name" => "Banner 2 Image alt tag",
						"desc" => "Enter your banner alt tag.",
						"id" => "w2f_alt2",
						"std" => "Domain name search and availability check by PCNames.com",
						"type" => "text");		

	$options[] = array( "name" => "Banner 2 Url",
						"desc" => "Enter your banner-2 url here.",
						"id" => "w2f_url2",
						"std" => "http://www.pcnames.com/",
						"type" => "text");						

	$options[] = array( "name" => "Banner 2 link title",
						"desc" => "Enter your banner-2 title here.",
						"id" => "w2f_lab2",
						"std" => "PC Names - Domain name search and availability check.",
						"type" => "text");
										
										
																
	$options[] = array( "name" => "Banner 3 Image",
						"desc" => "Enter your 125 x 125 banner image url here..",
						"id" => "w2f_banner3",
						"std" => "http://web2feel.com/images/designcontest.png",
						"type" => "text");		

	$options[] = array( "name" => "Banner 3 Image alt tag",
						"desc" => "Enter your banner alt tag.",
						"id" => "w2f_alt3",
						"std" => "Website and logo design contests at DesignContest.com.",
						"type" => "text");		

	$options[] = array( "name" => "Banner 3 Url",
						"desc" => "Enter your banner-1 url here.",
						"id" => "w2f_url3",
						"std" => "http://www.designcontest.com/",
						"type" => "text");						

	$options[] = array( "name" => "Banner 3 link title",
						"desc" => "Enter your banner-3 title here.",
						"id" => "w2f_lab3",
						"std" => "Design Contest - Logo and website design contests.",
						"type" => "text");
								
								
														
																				
	$options[] = array( "name" => "Banner 4 Image",
						"desc" => "Enter your 125 x 125 banner image url here..",
						"id" => "w2f_banner4",
						"std" => "http://web2feel.com/images/webhostingrating.png",
						"type" => "text");		

	$options[] = array( "name" => "Banner 4 Image alt tag",
						"desc" => "Enter your banner alt tag.",
						"id" => "w2f_alt4",
						"std" => "Reviews of the best cheap web hosting providers at WebHostingRating.com",
						"type" => "text");		

	$options[] = array( "name" => "Banner 4 Url",
						"desc" => "Enter your banner-4 url here.",
						"id" => "w2f_url4",
						"std" => "http://webhostingrating.com",
						"type" => "text");						

	$options[] = array( "name" => "Banner 4 link title",
						"desc" => "Enter your banner-4 title here.",
						"id" => "w2f_lab4",
						"std" => "Web Hosting Rating - Customer reviews of the best web hosts",
						"type" => "text");						
						
						
						
						
								// 					
								// 					
								// 					
								// 					
								// 					
								// 	
								// $options[] = array( "name" => "Basic Settings",
								// 					"type" => "heading");
								// 						
								// $options[] = array( "name" => "Input Text Mini",
								// 					"desc" => "A mini text input field.",
								// 					"id" => "example_text_mini",
								// 					"std" => "Default",
								// 					"class" => "mini",
								// 					"type" => "text");
								// 							
								// $options[] = array( "name" => "Input Text",
								// 					"desc" => "A text input field.",
								// 					"id" => "example_text",
								// 					"std" => "Default Value",
								// 					"type" => "text");
								// 						
								// $options[] = array( "name" => "Textarea",
								// 					"desc" => "Textarea description.",
								// 					"id" => "example_textarea",
								// 					"std" => "Default Text",
								// 					"type" => "textarea"); 
								// 					
								// $options[] = array( "name" => "Input Select Small",
								// 					"desc" => "Small Select Box.",
								// 					"id" => "example_select",
								// 					"std" => "three",
								// 					"type" => "select",
								// 					"class" => "mini", //mini, tiny, small
								// 					"options" => $test_array);			 
								// 					
								// $options[] = array( "name" => "Input Select Wide",
								// 					"desc" => "A wider select box.",
								// 					"id" => "example_select_wide",
								// 					"std" => "two",
								// 					"type" => "select",
								// 					"options" => $test_array);
								// 					
								// $options[] = array( "name" => "Select a Category",
								// 					"desc" => "Passed an array of categories with cat_ID and cat_name",
								// 					"id" => "example_select_categories",
								// 					"type" => "select",
								// 					"options" => $options_categories);
								// 					
								// $options[] = array( "name" => "Select a Page",
								// 					"desc" => "Passed an pages with ID and post_title",
								// 					"id" => "example_select_pages",
								// 					"type" => "select",
								// 					"options" => $options_pages);
								// 					
								// $options[] = array( "name" => "Input Radio (one)",
								// 					"desc" => "Radio select with default options 'one'.",
								// 					"id" => "example_radio",
								// 					"std" => "one",
								// 					"type" => "radio",
								// 					"options" => $test_array);
								// 						
								// $options[] = array( "name" => "Example Info",
								// 					"desc" => "This is just some example information you can put in the panel.",
								// 					"type" => "info");
								// 										
								// $options[] = array( "name" => "Input Checkbox",
								// 					"desc" => "Example checkbox, defaults to true.",
								// 					"id" => "example_checkbox",
								// 					"std" => "1",
								// 					"type" => "checkbox");
								// 					
								// $options[] = array( "name" => "Advanced Settings",
								// 					"type" => "heading");
								// 					
								// $options[] = array( "name" => "Check to Show a Hidden Text Input",
								// 					"desc" => "Click here and see what happens.",
								// 					"id" => "example_showhidden",
								// 					"type" => "checkbox");
								// 
								// $options[] = array( "name" => "Hidden Text Input",
								// 					"desc" => "This option is hidden unless activated by a checkbox click.",
								// 					"id" => "example_text_hidden",
								// 					"std" => "Hello",
								// 					"class" => "hidden",
								// 					"type" => "text");
								// 					
								// $options[] = array( "name" => "Uploader Test",
								// 					"desc" => "This creates a full size uploader that previews the image.",
								// 					"id" => "example_uploader",
								// 					"type" => "upload");
								// 					
								// 
								// 					
								// $options[] = array( "name" =>  "Example Background",
								// 					"desc" => "Change the background CSS.",
								// 					"id" => "example_background",
								// 					"std" => $background_defaults, 
								// 					"type" => "background");
								// 							
								// $options[] = array( "name" => "Multicheck",
								// 					"desc" => "Multicheck description.",
								// 					"id" => "example_multicheck",
								// 					"std" => $multicheck_defaults, // These items get checked by default
								// 					"type" => "multicheck",
								// 					"options" => $multicheck_array);
								// 						
								// $options[] = array( "name" => "Colorpicker",
								// 					"desc" => "No color selected by default.",
								// 					"id" => "example_colorpicker",
								// 					"std" => "",
								// 					"type" => "color");
								// 					
								// $options[] = array( "name" => "Typography",
								// 					"desc" => "Example typography.",
								// 					"id" => "example_typography",
								// 					"std" => array('size' => '12px','face' => 'verdana','style' => 'bold italic','color' => '#123456'),
								// 					"type" => "typography");			
	return $options;
}