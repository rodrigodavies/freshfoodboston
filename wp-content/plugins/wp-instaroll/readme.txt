=== WP-Instaroll ===
Contributors: FeliceMente, rformato, patrick91
Donate link: http://www.rollstudio.it/  
Tags: instagram, photos 
Requires at least: 3.3  
Tested up to: 3.4
Stable tag: 1.1.1
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==
Simple Instagram plug-in for creating WordPress posts from Instagram photos (both from user stream and by using a specific search tag).

You can browse photos in your user stream, or by the specified tag, import them into WordPress media library and link it to post, with the possibility of choosing between adding it as featured image (post thumbnail) or directly inside the post (default).

The posts created from Instagram photos can be saved as draft or directly published.

The plug-in keeps track of previously published photos and avoids downloading them from Instagram again, if they're already present in local media library, in case a single photo is used for creating multiple posts.

In photos selection panels there's a checkbox for specifying whether to show already published Instagram photos (default) or not, and a checkbox for specifying whether to only user photos or not.

Requirements:

* WordPress 3.x or above
* PHP 5.3.x or above
* cURL PHP extension

== Installation ==
1. Upload 'wp-instaroll' to the '/wp-content/plugins/'' directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to 'Settings -> Instaroll Settings' and fill the settings fields
4. Now you're ready to go to 'Instaroll Photos' and create posts (there's a panel for user stream photos and a panel for search tag stream)

== Frequently Asked Questions ==

= Do I need to set up an Instagram application to use the plugin? =
Yes, you have to. You can create an Instagram application here: http://instagram.com/developer/.

= Do I have to login and authorize the application to use the plugin? =
Yes, you have to, in 'Settings -> Instaroll Settings' panel.

= I can't perform Instagram authorization, do I need a particular server configuration? =
You need cURL on your system, and at least WordPress 3.3.x and PHP 5.3.x (which normally includes cURL).

= I filled all the required fields in the settings panel, but I still get a message warning I didn't. What's wrong? =
You probably didn't fill the search tag field and are trying to visualize the second tab ('Instagram Photos by Tag'). This field is used for retrieving, separately for your user stream (which contains your photos plus the photos from the people you're following), a stream of photos containing this tag. This tag can be left blank if you're interested only to the first tab ('Instagram User Stream').

= Automatic creation of photos oly work with user stream photos, while the tag stream photos are ignored. What's wrong? =
You probably didn't fill the search tag field. This field isn't mandatory for user photos (it isn't actually used for this), but is mandatory for tag stream photos, so if you choose automatic post creation for tag stream or user stream + tag stream and this field is empty, no photos from the tag stream will be taken (and, if you go to 'Instagram Photos by Tag' tab, you won't see photos).

= I have cURL installed on my system but I can't connect to Instagram. Do I need to configure something on the server? =
For security reasons, the plug-in connects to Instagram using a secure (SSL) connection when authorizing Instagram access (this if due to Instagram API). cURL library compares the remote host agaist a list of well known domains and allows the connection from known hosts.
In case the list on your server doesn't allow the connection to the remote host and you can't update your server's list, you can edit the file 'wp-instaroll/instagram/instagram.php', decommenting the line:
'//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);'
changing it to 'curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);'.

== Screenshots ==
1. plug-in administration panel
2. plug-in photo selection panel: tag stream

== Changelog ==
= 1.1.1 =
* better implementation, for the second tab ('Instagram Photos by Tag'), of the option for showing only user photos: before, in case of many never photos, older user photos could not appear, because only most recent photos were returned, while now the user stream is used, so that older photos are not pushed away by newer photos posted by other people
= 1.1 =
* in the first tab ('Instagram User Stream'), you can now select between showing the user stream (user photos + friends photos) or only the user's photos (thanx 'shacker')
* in the second tab ('Instagram Photos by Tag'), you can now select between showing all photos or only the user's photos (thanx 'vitious')
* possibility of setting a tag (or multiple tags, comma separated) that will be added to posts created from Instagram photos (thanx 'vitious')
* search tag field is no longer mandatory (if not present, only user stream panel will actually work)
* the plugins checks for minimum requirements, warning the user and stopping in case of problems
= 1.0.4.3 =
* makes the plugin work also when the host is configured for not allowing access of remote file using 'fopen()' and 'file_get_contents()' functions ('allow_url_fopen' .ini setting disabled), using cURL instead
* better visualization of photo streams on smaller screens
= 1.0.4.2 =
* resolved a little issue with Instagram authorization
= 1.0.4.1 =
* now the plug-in can be installed directly from WordPress
= 1.0.4 =
* possibility of scheduling automatic post creation from Instagram photos (from user stream, tag stream or both)
* possibility of choosing the category to publish Instagram based posts to
* photo selection panel visualization optimized for smaller screens
* minor fixes and improvements

== Upgrade Notice ==
= 1.1.1 =
improves the 'user only' filter in tag stream
= 1.1 =
includes small fixes and some improvements suggested by users
= 1.0.4.3 =
resolves several small issues and improves compatibility with different server configurations
= 1.0.4 =
the plug-in has improved in many areas, since previous version