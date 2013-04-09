<?php
/** 
 * Geo Mashup "core" implementation of location management user interfaces.
 *
 * Theoretically, everything done here could be done in a separate plugin.
 *
 * @package GeoMashup
 */

/**
 * A base class for managing user interfaces for collecting and storing location.
 *
 * This could be extended to make the existing editor work for new objects in a separate plugin.
 *
 * @package GeoMashup
 * @since 1.3
 * @access public
 */
class GeoMashupUIFrontend {
        /**
         * Retrieve a single instaniated subclass by name.
         *
         * @since 1.3
         * @access public
         * @static
         *
         * @param string $name The class name of the manager.
         * @return GeoMashupUIFrontend The singleton object.
         */
        function &get_instance( $name ) {
                static $instances = array();

                if ( ! isset( $instances[$name] ) ) {
                        $instances[$name] = new $name();
                }
                return $instances[$name];
        }

        /**
         * Queue UI styles to match the jQuery version.
         * 
         * @since 1.3
         * @access public
         */
        function enqueue_jquery_styles() {
                wp_enqueue_style( 'jquery-smoothness', trailingslashit( GEO_MASHUP_URL_PATH ) . 'jquery-ui.1.7.smoothness.css', false, GEO_MASHUP_VERSION, 'screen' );
        }

        /**
         * Queue styles and scripts for the location editor form.
         *
         * @since 1.3
         * @access public
         */
        function enqueue_form_client_items() {  

                wp_enqueue_style( 'geo-mashup-edit-form', trailingslashit( GEO_MASHUP_URL_PATH ) . 'edit-form.css', false, GEO_MASHUP_VERSION, 'screen' );

                wp_enqueue_script( 'google-jsapi' );
                wp_enqueue_script( 'geo-mashup-location-editor', 
                        GEO_MASHUP_URL_PATH . '/geo-mashup-location-editor.js', 
                        array( 'jquery', 'google-jsapi' ), 
                        GEO_MASHUP_VERSION );
        }

        /**
         * Determine the appropriate action from posted data.
         * 
         * @since 1.3
         * @access private
         */
        function get_submit_action() {

                $action = null;

                if ( isset( $_POST['geo_mashup_add_location'] ) or isset( $_POST['geo_mashup_update_location'] ) ) {

                        // Clients without javascript may need server side geocoding
                        if ( ! empty( $_POST['geo_mashup_search'] ) and isset( $_POST['geo_mashup_no_js'] ) and 'true' == $_POST['geo_mashup_no_js'] ) {

                                $action = 'geocode';

                        } else {

                                $action = 'save';

                        }

                } else if ( isset( $_POST['geo_mashup_changed'] ) and 'true' == $_POST['geo_mashup_changed'] and ! empty( $_POST['geo_mashup_location'] ) ) {

                        // The geo mashup submit button wasn't used, but a change was made and the post saved
                        $action = 'save';
                                 
                } else if ( isset( $_POST['geo_mashup_delete_location'] ) ) {

                        $action = 'delete';

                } else if ( ! empty( $_POST['geo_mashup_location_id'] ) and empty( $_POST['geo_mashup_location'] ) ) {

                        // There was a location, but it was cleared before this save
                        $action = 'delete';

                }
                return $action;
        }

        /**
         * Save an object location from data posted by the location editor.
         * 
         * @since 1.3
         * @access public
         * @uses GeoMashupDB::set_object_location()
         * @uses GeoMashupDB::delete_location()
         *
         * @param string $object_name The name of the object being edited.
         * @param string $object_id The ID of the object being edited.
         * @return bool|WP_Error True or a WordPress error.
         */
        function save_posted_object_location( $object_name, $object_id ) {

                // Check the nonce
                if ( empty( $_POST['geo_mashup_nonce'] ) || !wp_verify_nonce( $_POST['geo_mashup_nonce'], 'geo-mashup-edit' ) ) {
                        return new WP_Error( 'invalid_request', __( 'Object location not saved - invalid request.', 'GeoMashup' ) );
                }
                
                $action = $this->get_submit_action();

                if ( 'save' == $action or 'geocode' == $action ) {

                        $date_string = $_POST['geo_mashup_date'] . ' ' . $_POST['geo_mashup_hour'] . ':' . 
                                $_POST['geo_mashup_minute'] . ':00';
                        $geo_date = date( 'Y-m-d H:i:s', strtotime( $date_string ) );

                        $post_location = array();
                        // If PHP has added slashes, WP will do it again before saving
                        $post_location['saved_name'] = stripslashes( $_POST['geo_mashup_location_name'] );

                        if ( 'geocode' == $action ) {

                                $status = GeoMashupDB::geocode( $_POST['geo_mashup_search'], $post_location );
                                if ( $status != 200 ) {
                                        $post_location = array();
                                }

                        } else {

                                if ( ! empty( $_POST['geo_mashup_select'] ) ) {
                                        $selected_items = explode( '|', $_POST['geo_mashup_select'] );
                                        $post_location = intval( $selected_items[0] );
                                } else { 
                                        $post_location['id'] = $_POST['geo_mashup_location_id'];
                                        list( $lat, $lng ) = split( ',', $_POST['geo_mashup_location'] );
                                        $post_location['lat'] = trim( $lat );
                                        $post_location['lng'] = trim( $lng );
                                        $post_location['geoname'] = $_POST['geo_mashup_geoname'];
                                        $post_location['address'] = stripslashes( $_POST['geo_mashup_address'] );
                                        $post_location['postal_code'] = $_POST['geo_mashup_postal_code'];
                                        $post_location['country_code'] = $_POST['geo_mashup_country_code'];
                                        $post_location['admin_code'] = $_POST['geo_mashup_admin_code'];
                                        $post_location['sub_admin_code'] = $_POST['geo_mashup_sub_admin_code'];
                                        $post_location['locality_name'] = $_POST['geo_mashup_locality_name'];
                                }
                        }
                        
                        if ( ! empty( $post_location ) ) {
                                $error = GeoMashupDB::set_object_location( $object_name, $object_id, $post_location, true, $geo_date );
                                if ( is_wp_error( $error ) ) 
                                        return $error;
                        }

                } else if ( 'delete' == $action ) {

                        $error = GeoMashupDB::delete_object_location( $object_name, $object_id );
                        if ( is_wp_error( $error ) ) 
                                return $error;

                } 

                return true;
        }
        
        /*function front_end_map() {
                // A lots of Stuff
        
                if ( isset($_POST['geo_mashup_add_location']) ) {
                        
                        print "SUBMIT";
                        print "<BR>geo_mashup_add_location: ".$_POST['geo_mashup_add_location'];
                        print "<BR>geo_mashup_search: ".$_POST['geo_mashup_search'];
                        print "<BR>geo_mashup_no_js: ".$_POST['geo_mashup_no_js'];
                        print "<BR>geo_mashup_changed: ".$_POST['geo_mashup_changed'];
                        print "<BR>geo_mashup_location: ".$_POST['geo_mashup_location'];
                        

                        GeoMashupUIFrontend::get_submit_action();
                        
                } else {
                        
                        include_once( GEO_MASHUP_DIR_PATH . '/edit-form.php');
                        
                        //print "<form action='".get_page_link(25)."' method='post'>";
                        print "<form action='".get_page_link(25)."' method='post'>";
                        print " <input type='submit' name='submit' value='Enviar' />";
                        geo_mashup_edit_form( 'post', 'front_map');
                        print " <input type='hidden' name='page_id' value='25' />";
                        
                        print " <input id='geo_mashup_add_location' name='geo_mashup_add_location' type='submit'  value='Add Location' />";
                        print " <input id='geo_mashup_delete_location' name='geo_mashup_delete_location' type='submit' style='display:none;' value='Delete' />";
                        print " <input id='geo_mashup_update_location' name='geo_mashup_update_location' type='submit' style='display:none;' value='Save' />";
                        
                        print "</form>";
                
                }
        }*/

}

/**
 * A manager for user location user interfaces.
 *
 * Singleton instantiated immediately.
 *
 * @package GeoMashup
 * @since 1.3
 * @access public
 */
class GeoMashupUserUIFrontend extends GeoMashupUIFrontend {
        /**
         * Get the single instance of this class.
         * 
         * @since 1.3
         * @access public
         * @static
         * @uses parent::get_instance()
         *
         * @return GeoMashupPostUIFrontend The instance.
         */
        function get_instance() {
                return parent::get_instance( 'GeoMashupUserUIFrontend' );
        }

        /**
         * PHP4 Constructor
         *
         * @since 1.3
         * @access private
         */
        function GeoMashupUserUIFrontend() {
                // Global $geo_mashup_options is available, but a better pattern might
                // be to wait until init to be sure
                add_action( 'init', array( &$this, 'init' ) );
        }

        /**
         * Initialize for use in relevant requests.
         *
         * init {@link http://codex.wordpress.org/Plugin_API/Action_Reference action}
         * called by WordPress.
         * 
         * @since 1.3
         * @access private
         */
        function init() {
                global $geo_mashup_options;

                // Enable this interface when the option is set and we're on a destination page
                $enabled = is_admin() &&
                $geo_mashup_options->get( 'overall', 'located_object_name', 'user' ) == 'true' &&
                preg_match( '/(user-edit|user-new|profile).php/', $_SERVER['REQUEST_URI'] );

                // If enabled, register all the interface elements
                if ( $enabled ) { 

                        // Form generation
                        add_action( 'show_user_profile', array( &$this, 'print_form' ) );
                        add_action( 'edit_user_profile', array( &$this, 'print_form' ) );
                        // MAYBEDO: add location to registration page?

                        // Form processing
                        add_action( 'personal_options_update', array( &$this, 'save_user'));
                        add_action( 'edit_user_profile_update', array( &$this, 'save_user'));

                        $this->enqueue_jquery_styles();
                        $this->enqueue_form_client_items();
                }
        }

        /**
         * Print the user location editor form.
         * 
         * @since 1.3
         * @access public
         * @uses edit-form.php
         */
        function print_form() {
                global $user_id;

                include_once( GEO_MASHUP_DIR_PATH . '/edit-form.php');
                if ( isset( $_GET['user_id'] ) ) {
                        $object_id = $_GET['user_id'];
                } else {
                        $object_id = $user_id;
                }
                echo '<h3>' . __( 'Location', 'GeoMashup' ) . '</h3>';
                geo_mashup_edit_form( 'user', $object_id, get_class( $this ) );
        }

        /**
         * Save a posted user location.
         * 
         * @since 1.3
         * @access public
         * @uses parent::save_posted_object_location()
         *
         * @param id $user_id 
         * @return bool|WP_Error
         */
        function save_posted_object_location( $user_id ) {
                return parent::save_posted_object_location( 'user', $user_id );
        }

        /**
         * When a user is saved, also save any posted location.
         *
         * save_user {@link http://codex.wordpress.org/Plugin_API/Action_Reference action}
         * called by WordPress.
         * 
         * @since 1.3
         * @access private
         * @return bool|WP_Error 
         */
        function save_user() {
                if ( empty( $_POST['user_id'] ) ) {
                        return false;
                }

                $user_id = $_POST['user_id'];

                if ( !is_numeric( $user_id ) ) {
                        return $user_id;
                }

                if ( !current_user_can( 'edit_user', $user_id ) ) {
                        return $user_id;
                }

                return $this->save_posted_object_location( $user_id );
        }
}

// Instantiate
GeoMashupUserUIFrontend::get_instance();

/**
 * A manager for post/page location user interfaces.
 *
 * Singleton instantiated immediately.
 *
 * @package GeoMashup
 * @since 1.3
 * @access public
 */
class GeoMashupPostUIFrontend extends GeoMashupUIFrontend {
        /**
         * Location found in geo_mashup_save_location shortcode.
         * 
         * @since 1.3
         * @var array
         * @access private
         */
        var $inline_location;

        /**
         * Get the single instance of this class.
         * 
         * @since 1.3
         * @access public
         * @static
         * @uses parent::get_instance()
         *
         * @return GeoMashupPostUIFrontend The instance.
         */
        function get_instance() {
                return parent::get_instance( 'GeoMashupPostUIFrontend' );
        }

        /**
         * PHP4 Constructor
         *
         * @since 1.3
         * @access private
         */
        function GeoMashupPostUIFrontend() {
                // Global $geo_mashup_options is available, but a better pattern might
                // be to wait until init to be sure
                add_action( 'init', array( &$this, 'init' ) );
        }

        /**
         * Initialize for use in relevant requests.
         *
         * init {@link http://codex.wordpress.org/Plugin_API/Action_Reference action}
         * called by WordPress.
         * 
         * @since 1.3
         * @access private
         */
        function init() {
                global $geo_mashup_options;

                // Uploadable geo content type expansion always enabled
                add_filter( 'upload_mimes', array( &$this, 'upload_mimes' ) );

                // Enable this interface when the option is set 
                $enabled = $geo_mashup_options->get( 'overall', 'located_object_name', 'post' ) == 'true';
                
                if ( $enabled ) { 
                        
                        if ( is_user_logged_in() ) {
                                //CARREGA O FRONTEND NA PAGE, SE HABILITADO POR POST
                                add_shortcode('front_end_map', array( &$this, 'print_form' ) );
                        }
                        
                        //CARREGA DEPENDÊNCIAS (CSS E JS)
                        include_once( GEO_MASHUP_DIR_PATH . '/edit-form.php');
                        $this->enqueue_jquery_styles();
                        $this->enqueue_form_client_items();
                        wp_enqueue_script( 'jquery-ui-datepicker', trailingslashit( GEO_MASHUP_URL_PATH ) . 'jquery-ui.1.7.datepicker.min.js', array( 'jquery', 'jquery-ui-core'), '1.7' );
                        

// Queue inline location handlers

                        // Pre-save filter checks saved content for inline location tags
                        add_filter( 'content_save_pre', array( &$this, 'content_save_pre') );

                        // Save post handles both inline and form processing
                        add_action( 'save_post', array( &$this, 'save_post'), 10, 2 );

                        // Browser upload processing
                        add_filter( 'wp_handle_upload', array( &$this, 'wp_handle_upload' ) );

                        // If we're on a post editing page, queue up the form interface elements
                        if ( is_admin() && preg_match( '/(post|page)(-new|).php/', $_SERVER['REQUEST_URI'] ) ) {

                                // Form generation
                                add_action( 'admin_menu', array( &$this, 'admin_menu' ) );

                                $this->enqueue_jquery_styles();
                                $this->enqueue_form_client_items();

                                wp_enqueue_script( 'jquery-ui-datepicker', trailingslashit( GEO_MASHUP_URL_PATH ) . 'jquery-ui.1.7.datepicker.min.js', array( 'jquery', 'jquery-ui-core'), '1.7' );

                        } else if ( strpos( $_SERVER['REQUEST_URI'], 'async-upload.php' ) > 0 ) {

                                // Flash upload display
                                add_filter( 'media_meta', array( &$this, 'media_meta' ), 10, 2 );

                        } else if ( strpos( $_SERVER['REQUEST_URI'], 'upload.php' ) > 0 ) {

                                // Browser upload display
                                add_action( 'admin_print_scripts', array( &$this, 'admin_print_scripts' ) );

                        }
                } // end if enabled
        }

        /**
         * Add a location meta box to the post and page editors.
         * 
         * admin_menu {@link http://codex.wordpress.org/Plugin_API/Action_Reference action}
         * called by Wordpress.
         *
         * @since 1.3
         * @access private
         */
        function admin_menu() {
                // Not adding a menu, but at this stage add_meta_box is defined, so we can add the location form
                add_meta_box( 'geo_mashup_post_edit', __( 'Location', 'GeoMashup' ), array( &$this, 'print_form' ), 'post', 'advanced' );
                add_meta_box( 'geo_mashup_post_edit', __( 'Location', 'GeoMashup' ), array( &$this, 'print_form' ), 'page', 'advanced' );
        }
        /**
         * Print the post editor form.
         * 
         * @since 1.3
         * @access public
         * @uses edit-form.php
         */
        function print_post_form() {
                if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar('Front End Post') ) :
            endif;              
        }
        
        /**
         * Print the post editor form.
         * 
         * @since 1.3
         * @access public
         * @uses edit-form.php
         */
        function print_form() {
                global $post_ID;
                global $user_ID;
                
                /*$args = array('echo' => 0);
                wp_list_categories( $args );
                if ( $cats = wp_list_categories( $args ) ) {
                        print $cats[0];
                }*/
                
                if ( !is_array( $_POST['quick_post_cat'] ) ) {
                        $_POST['quick_post_cat'] = array($_POST['quick_post_cat']);
                }
                
                if ( $_POST['geo_mashup_add_location'] ) {
                        $post = array(
                                'post_author'           => $user_ID, //The user ID number of the author.
                                'post_category'         => $_POST['quick_post_cat'], //Add some categories.
                                'post_content'          => $_POST['quick_post_content'], //The full text of the post.
                                'post_date'                     => date_i18n( 'Y-m-d H:i:s' ), //The time post was made.
                                //'post_date_gmt'       => Y-m-d H:i:s, //The time post was made, in GMT.
                                'post_status'           => 'pending', //Set the status of the new post. Pode ser acertada via Admin
                                'post_title'            => $_POST['quick_post_title'], //The title of your post.
                                'post_type'                     => 'post', //Sometimes you want to post a page.
                                //'tags_input'          => [  ] //For tags.
                        );
                        
                        // Insert the post into the database
                        wp_insert_post( $post );
                        
                }
                
                //--- IF FORM - Ou algo que permita maior customização
                $filename[0] = TEMPLATEPATH . '/geo_mashup_ui_frontend_form.php';
                $filename[1] = GEO_MASHUP_DIR_PATH . '/geo_mashup_ui_frontend_form.php';
                
                if ( file_exists($filename[0]) ) {
                        
                        include_once($filename[0]);
                        
                } elseif ( file_exists($filename[1]) ) {
                        
                        include_once($filename[1]);
                        
                } else {
                ?>
<form method="post">

    <label for="quick_post_title" class="quick_post_label" style="">Title:</label> 
    <input type="text" name="quick_post_title" id="quick_post_title" style="" value="<Post title>" onblur="if(this.value=='') this.value='<Post title>'; return false;" onfocus="if(this.value=='<Post title>') this.value=''; return false;" />
    
    <label for="quick_post_content" class="quick_post_label" style="">Content:</label> 
    <textarea name="quick_post_content" rows="3" id="quick_post_content" style=""  onblur="if(this.value=='') this.value='<Post content>'; return false;" onfocus="if(this.value=='<Post content>') this.value=''; return false;" ><Post content></textarea>
    
    <input type='button' id="quick_post_load" style="" value="Visual Editor" title="Visual Editor" /> 
    
    <br />
    <input type=radio name="quick_post_rb" class="quick_post_rb" value="existing" style="" checked onclick="disableIt('quick_post_new_cat',true); disableIt('quick_post_new_cat_parent',true); disableIt('quick_post_cat',false);" /> 
    <label for="quick_post_cat" class="quick_post_label" style="">Category:</label>
    <select multiple name='quick_post_cat' id='quick_post_cat' class='postform' > 
        <option class="level-0" value="3">&Aacute;gua</option> 
        <option class="level-0" value="4">Terra</option> 
        <option class="level-0" value="5">Fogo</option> 
        <option class="level-0" value="7">Ar</option> 
    </select>
    
    <input type=radio name="quick_post_rb" class="quick_post_rb" value="new" style=""  onclick="disableIt('quick_post_new_cat',false); disableIt('quick_post_new_cat_parent',false); disableIt('quick_post_cat',true);" /> 
    <label for="quick_post_new_cat" class="quick_post_label" style="">New category:</label> <br /> 
    <input type="text" name="quick_post_new_cat" id="quick_post_new_cat" style="" value="" disabled /> 
    
    <select name='quick_post_new_cat_parent' id='quick_post_new_cat_parent' class='postform' > 
        <option value='-1'>Parent category</option> 
        <option class="level-0" value="3">&Aacute;gua</option> 
        <option class="level-0" value="4">Terra</option> 
        <option class="level-0" value="5">Fogo</option> 
        <option class="level-0" value="7">Ar</option> 
    </select> 
    
    <?php geo_mashup_edit_form( 'post', $post_ID, get_class( $this ) ); ?>
    
    <input type="submit" id="geo_mashup_add_location" name="geo_mashup_add_location" value="Post" title="Post" />
    
</form> 
                <?php
                } //--- IF FORM
        }


        /**
         * Save a posted post or page location.
         * 
         * @since 1.3
         * @access public
         * @uses parent::save_posted_object_location()
         *
         * @param id $post_id 
         * @return bool|WP_Error
         */
        function save_posted_object_location( $post_id ) {
                return parent::save_posted_object_location( 'post', $post_id );
        }

        /**
         * When a post is saved, save any posted location for it.
         * 
         * save_post {@link http://codex.wordpress.org/Plugin_API/Action_Reference action}
         * called by WordPress.
         *
         * @since 1.3
         * @access private
         * @uses GeoMashupDB::set_object_location()
         *
         * @param id $post_id 
         * @param object $post 
         * @return bool|WP_Error
         */
        function save_post($post_id, $post) {
                if ( 'revision' == $post->post_type ) {
                        return;
                }

                // WP has already saved the post - allow location saving without added capability checks

                if ( !empty( $this->inline_location ) ) {
                        GeoMashupDB::set_object_location( 'post', $post_id, $this->inline_location );
                        $this->inline_location = null;
                }

                update_option('geo_mashup_temp_kml_url','');

                return $this->save_posted_object_location( $post_id );
        }

        /**
         * Extract inline save location shortcodes from post content before it is saved.
         *
         * content_save_pre {@link http://codex.wordpress.org/Plugin_API/Filter_Reference filter}
         * called by Wordpress.
         * 
         * @since 1.3
         * @access private
         */
        function content_save_pre( $content ) {
                // Piggyback on the shortcode interface to find inline tags [geo_mashup_save_location ...] 
                add_shortcode( 'geo_mashup_save_location', 'is_null' );
                $pattern = get_shortcode_regex( );
                return preg_replace_callback('/'.$pattern.'/s', array( &$this, 'replace_save_pre_shortcode' ), $content);
        }

        /**
         * Store the inline location from a save location shortcode before it is removed.
         * 
         * @since 1.3
         * @access private
         *
         * @param array $shortcode_match 
         * @return The matched content, or an empty string if it was a save location shortcode.
         */
        function replace_save_pre_shortcode( $shortcode_match ) {
                $tag_index = array_search( 'geo_mashup_save_location',  $shortcode_match ); 
                if ( $tag_index !== false ) {
                        // There is an inline location - save the attributes
                        $this->inline_location = shortcode_parse_atts( stripslashes( $shortcode_match[$tag_index+1] ) );
                        // Remove the tag
                        $content = '';
                } else {
                        // Whatever was matched, leave it be
                        $content = $shortcode_match[0];
                }
                return $content;
        }

        /**
         * Add Flash-uploaded KML to the location editor map.
         *
         * media_meta {@link http://codex.wordpress.org/Plugin_API/Filter_Reference filter}
         * called by WordPress.
         * 
         * @since 1.3
         * @access private
         */
        function media_meta( $content, $post ) {
                // Only chance to run some javascript after a flash upload?
                if (strlen($post->guid) > 0) {
                        $content .= '<script type="text/javascript"> ' .
                                'if (parent.GeoMashupLocationEditor) parent.GeoMashupLocationEditor.loadKml(\''.$post->guid.'\');' .
                                '</script>';
                }
                return $content;
        }

        /**
         * Add Browser-uploaded KML to the location editor map.
         *
         * admin_print_scripts {@link http://codex.wordpress.org/Plugin_API/Action_Reference action}
         * called by WordPress.
         * 
         * @since 1.3
         * @access private
         */
        function admin_print_scripts( $not_used ) {
                // Load any uploaded KML into the search map - only works with browser uploader
                
                // See if wp_upload_handler found uploaded KML
                $kml_url = get_option( 'geo_mashup_temp_kml_url' );
                if (strlen($kml_url) > 0) {
                        // Load the KML in the location editor
                        echo '
                                <script type="text/javascript"> 
                                        if (parent.GeoMashupLocationEditor) parent.GeoMashupLocationEditor.loadKml(\'' . $kml_url . '\');
                                </script>';
                        update_option( 'geo_mashup_temp_kml_url', '' );
                }
        }

        /**
         * Add geo mime types to allowable uploads.
         * 
         * upload_mimes {@link http://codex.wordpress.org/Plugin_API/Filter_Reference filter}
         * called by WordPress.
         *
         * @since 1.3
         * @access private
         */
        function upload_mimes( $mimes ) {
                $mimes['kml'] = 'application/vnd.google-earth.kml+xml';
                $mimes['gpx'] = 'application/octet-stream';
                return $mimes;
        }

        /**
         * If an upload is KML, put the URL in an option to be loaded in the response 
         * 
         * wp_handle_upload {@link http://codex.wordpress.org/Plugin_API/Filter_Reference filter}
         * called by WordPress.
         *
         * @since 1.3
         * @access private
         */
        function wp_handle_upload( $args ) {
                // TODO: use transient API instead of option
                update_option( 'geo_mashup_temp_kml_url', '' );
                if ( is_array( $args ) && isset( $args['file'] ) ) {
                        if ( stripos( $args['file'], '.kml' ) == strlen( $args['file'] ) - 4 ) {
                                update_option( 'geo_mashup_temp_kml_url', $args['url'] );
                        }
                }
                return $args;
        }
}

// Instantiate
GeoMashupPostUIFrontend::get_instance();

/**
 * A manager for comment location user interfaces.
 *
 * Singleton instantiated immediately.
 *
 * @package GeoMashup
 * @since 1.3
 * @access public
 */
class GeoMashupCommentUIFrontend {
        /**
         * Get the single instance of this class.
         * 
         * @since 1.3
         * @access public
         * @static
         *
         * @return GeoMashupPostUIFrontend The instance.
         */
        function get_instance() {
                static $instance = null;
                if ( is_null( $instance ) ) {
                        $instance = new GeoMashupCommentUIFrontend();
                }
                return $instance;
        }

        /**
         * PHP4 Constructor
         *
         * @since 1.3
         * @access private
         */
        function GeoMashupCommentUIFrontend() {
                // Global $geo_mashup_options is available, but a better pattern might
                // be to wait until init to be sure
                add_action( 'init', array( &$this, 'init' ) );
        }

        /**
         * Initialize for use in relevant requests.
         *
         * init {@link http://codex.wordpress.org/Plugin_API/Action_Reference action}
         * called by WordPress.
         * 
         * @since 1.3
         * @access private
         */
        function init() {
                global $geo_mashup_options;


                // If enabled, register all the interface elements
                if ( !is_admin() && $geo_mashup_options->get( 'overall', 'located_object_name', 'comment' ) == 'true' ) { 

                        // Form generation
                        add_action( 'comment_form', array( &$this, 'print_form' ) );

                        // Form processing
                        add_action( 'comment_post', array( &$this, 'save_comment'), 10, 2 );

                        // Google JSAPI provides client location by IP
                        wp_enqueue_script( 'google-jsapi' );
                        wp_enqueue_script( 'geo-mashup-loader' );
                }
        }

        /**
         * Print the comment location editor form.
         *
         * @since 1.3
         * @access public
         */
        function print_form()
        {
                // If there's a logged in user with a location, use that as a default.
                // The client-side location will override it if available
                $default_lat = $default_lng = '';
                $user = wp_get_current_user();
                if ( $user ) {
                        $location = GeoMashupDB::get_object_location( 'user', $user->ID );
                        if ( $location ) {
                                $default_lat = $location->lat;
                                $default_lng = $location->lng;
                        }
                }

                // Print the form
                $input_format = '<input id="geo_mashup_%s_input" name="comment_location[%s]" type="hidden" value="%s" />';
                printf( $input_format, 'lat', 'lat', $default_lat );
                printf( $input_format, 'lng', 'lng', $default_lng );
                printf( $input_format, 'country_code', 'country_code', '' );
                printf( $input_format, 'locality_name', 'locality_name', '' );
                printf( $input_format, 'address', 'address', '' );
        }

        /**
         * When a comment is saved, save any posted location with it.
         *
         * save_comment {@link http://codex.wordpress.org/Plugin_API/Filter_Reference filter}
         * called by WordPress.
         *
         * @since 1.3
         * @access private
         * @uses GeoMashupDB::set_object_location()
         */
        function save_comment( $comment_id = 0, $approval = '' ) {
                if ( !$comment_id || 'spam' === $approval || empty( $_POST['comment_location'] ) || !is_array( $_POST['comment_location'] ) ) {
                        return false;
                }

                GeoMashupDB::set_object_location( 'comment', $comment_id, $_POST['comment_location'] );
        }
}

// Instantiate
GeoMashupCommentUIFrontend::get_instance();


////////////////////////////////////////////////////
//add_shortcode('front_end_map', 'GeoMashupUIFrontend::front_end_map' );
//add_shortcode('front_end_map', 'GeoMashupUIFrontend::GeoMashupUserUIFrontend()' );
//GeoMashupUIFrontend::GeoMashupUserUIFrontend();


?>