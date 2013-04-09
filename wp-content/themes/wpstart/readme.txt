Theme Name: WPstart
Theme URI: http://krusze.pl/wpstart
Author: krusze.pl
Author URI: http://krusze.pl
Description: WPstart is a WordPress parent theme allowing you to create any type of website you want. WPstart features: custom background, drop-down menu, editor styles, header image, highly customizable and adaptable, print styles, SEO friendly, translation ready, W3C valid, widget-ready areas & more... Everyone from first-time WordPress users to advanced developers and designers can take advantage of WPstart.
Version: 1.0.9
License: GNU General Public License v2.0
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Tags: custom-background, custom-header, editor-style, fixed-width, full-width-template, left-sidebar, one-column, right-sidebar, sticky-post, threaded-comments, translation-ready, two-columns

Copyright £ukasz Kruszewski-Zelman http://krusze.pl

== Description ==
WPstart is a WordPress theme allowing you to create any type of website you want.
WPstart works with WordPress 3.3+

Sources and credits
* [960 Grid System] (http://960.gs/) | License: [GPL] (http://www.gnu.org/licenses/gpl.html) & [MIT] (http://www.opensource.org/licenses/mit-license.php)
* [Header image: get to the point] (http://www.publicdomainpictures.net) | License: [GPL] (http://www.gnu.org/licenses/gpl.html)
* [html5shiv] (https://github.com/aFarkas/html5shiv/) | License: [MIT] (http://www.opensource.org/licenses/MIT) & [GPL2] (http://www.gnu.org/licenses/gpl-2.0.html)

If you have any questions, suggestions, bug reports or feature requests feel free to contact at kontakt@krusze.pl or visit http://krusze.pl

== Installation ==
1. Unzip wpstart.1.0.9.zip
2. Upload the wpstart directory to the /wp-content/themes/
3. Activate the theme through the appearance menu

== Changelog ==
= 1.0.9 - 20.01.2013 =
* Changed : CSS & html output fixes towards html5, added html5shiv.js

== Changelog ==
= 1.0.8 - 07.01.2013 =
* Changed : change theme screenshot (screenshot.png) dimensions to 600x450px
* Changed : laytout improvements: move #main, #container, #content, #footer to content-extensions.php
* Changed : wpstart_entry_title divided to: wpstart_post_entry_title and wpstart_single_entry_title

== Changelog ==
= 1.0.7 - 01.07.2012 =
* Changed : changed header image
* Changed : added wpstart_before_container and wpstart_after_container
* Changed : added wpstart_before_content and wpstart_after_content

== Changelog ==
= 1.0.6 - 07.06.2012 =
* Changed : add_custom_background replaced with add_theme_support( 'custom-background' ) and add_custom_image_header replaced with add_theme_support( 'custom-header' ); provide backward-compatibility for Custom Background and Custom Header [functions.php]

= 1.0.5 - 29.04.2012 =
* Bugfix : changed _e() to esc_attr__() in "permalink" translations [content-extensions.php]

= 1.0.4 - 29.04.2012 =
* Changed : removed wpstart_body action and function - added wpstart_body_class [function.php, content-extensions.php]
* Bugfix : added textdomain to: 'Permalink: %s'; 'Permalink: '; 'One Response to %2$s', '%1$s Responses to %2$s'
* Changed : added <h1 class="page-title"> to daily archives, monthly archives, yearly archives page titles [content-extensions.php]
* Changed : some CSS fixes

= 1.0.3 - 27.04.2012 =
* Bugfix : removed function_exists() conditional for functions introduced more than one (recommended) or two (optionally) WordPress version prior [functions.php]
* Bugfix : fixed "Clearing Floats" - Edit link is cleared now
* Bugfix : textdomain in translation functions is now 'wpstart' 
* Bugfix : fixed printf in content-extensions.php
* Bugfix : pages in search results - removed meta information and added missing whitespace between them

= 1.0.2 - 24.04.2012 =
* Bugfix : get_template_directory()/get_stylesheet_directory() instead of TEMPLATEPATH/STYLESHEETPATH
* Bugfix : added function_exists() conditional where appropriate in functions.php
* Bugfix : restored default actions in wp_head (rsd_link, wp_generator, index_rel_link, wlwmanifest_link, feed_links_extra, start_post_rel_link, parent_post_rel_link, adjacent_posts_rel_link)
* Bugfix : fixed "Clearing Floats"
* Bugfix : removed "Comments are closed." message on page with comments disabled
* Bugfix : prevent wide images get cut off when overflowing the content area - .entry-content img { height:auto; max-width:100%; }
* Changed : fixed header image preview in the admin area; added wpstart_admin_header_image

= 1.0.1 - 19.04.2012 =
* Changed : new screenshot.png
* Changed : moved get_search_form from wpstart_header_content to sidebar-first area
* Changed : added CSS styles - img.alignleft, img.alignright, .nav-previous; added clear:"both" to .link-page
* Bugfix : CSS fixes - removed unnecessary styles: #headline, #breadcrumb, #banner, .opacity, .gallery-thumbs, input:focus, input[type="text"]:focus, input[type="submit"]:hover, img.header-image, .home #content
* Bugfix : removed unnecessary file: includes/content-extensions - Kopia.php

= 1.0 - 14.04.2012 =
* Official release.

==================================================================================================================

== Opis ==
WPstart to motyw do aplikacji WordPress, ktÛry pozwala na stworzenie dowolnego typu strony internetowej.
WPstart dzia≥a z WordPress 3.3+

èrÛd≥a:
* [960 Grid System] (http://960.gs/) | Licencja: [GPL] (http://www.gnu.org/licenses/gpl.html) & [MIT] (http://www.opensource.org/licenses/mit-license.php)
* [Obrazek nag≥Ûwka: get to the point] (http://www.publicdomainpictures.net) | Licencja: [GPL] (http://www.gnu.org/licenses/gpl.html)
* [html5shiv] (https://github.com/aFarkas/html5shiv/) | Licencja: [MIT] (http://www.opensource.org/licenses/MIT) & [GPL2] (http://www.gnu.org/licenses/gpl-2.0.html)

Jeúli masz pytania, sugestie, pomys≥y lub chcesz zg≥osiÊ b≥πd to skontaktuj siÍ z nami na kontakt@krusze.pl lub odwiedü http://krusze.pl

== Instalacja ==
1. Rozpakuj archiwum wpstart.1.0.9.zip
2. Przeúlij folder wpstart do /wp-content/themes/
3. W≥πcz szablon poprzez menu wyglπd

== Changelog ==
= 1.0.9 - 20.01.2013 =
* Zmiana : poprawki w CSS & html dla html5, dodano html5shiv.js

== Changelog ==
= 1.0.8 - 07.01.2013 =
* Zmiana : zmiana rozmiaru zdjÍcia motywu (screenshot.png) na 600x450px
* Zmiana : ulepszenie layoutu: przeniesienie #main, #container, #content, #footer do content-extensions.php
* Zmiana : wpstart_entry_title podzielone na: wpstart_post_entry_title i wpstart_single_entry_title

== Changelog ==
= 1.0.7 - 01.07.2012 =
* Zmiana : zmieniony obrazek nag≥Ûwka
* Zmiana : dodane wpstart_before_container i wpstart_after_container
* Zmiana : dodane wpstart_before_content i wpstart_after_content

== Changelog ==
= 1.0.6 - 07.06.2012 =
* Zmiana : add_custom_background zastπpione add_theme_support( 'custom-background' ) oraz add_custom_image_header zastπpione add_theme_support( 'custom-header' ); zapewnienie kompatybilnoúci wstecz dla Custom Background i Custom Header [functions.php]

= 1.0.5 - 29.04.2012 =
* Poprawka : zmiana _e() na esc_attr__() w t≥umaczeniu "permalink" [content-extensions.php]

= 1.0.4 - 29.04.2012 =
* Zmiana : usuniÍte wpstart_body akcja i funkcja - dodane wpstart_body_class [function.php, content-extensions.php]
* Poprawka : dodane textdomain: 'Permalink: %s'; 'Permalink: '; 'One Response to %2$s', '%1$s Responses to %2$s'
* Zmiana : dodane <h1 class="page-title"> do tytu≥Ûw daily archives, monthly archives, yearly archives [content-extensions.php]
* Zmiana : drobne zmiany w CSS

= 1.0.3 - 27.04.2012 =
* Poprawka : usuniÍte function_exists() dla funkcji wprowadzonych wiÍcej niø 1 (zalecane) lub 2 (opcja) wczeúniejsze wersje WordPress [functions.php]
* Poprawka : poprawione "Clearing Floats" - link Edytuj wyrÛwnany
* Poprawka : textdomain ustawiony na 'wpstart' 
* Poprawka : poprawione printf w content-extensions.php
* Poprawka : strony w wywnikach wyszukiwania - usuniÍte meta i dodana przerwa pomiÍdzy wynikami listy

= 1.0.2 - 24.04.2012 =
* Poprawka : get_template_directory()/get_stylesheet_directory() zmiast TEMPLATEPATH/STYLESHEETPATH
* Poprawka : dodane function_exists() gdzie wskazane w functions.php
* Poprawka : przywrÛcone domyúlne akcje w wp_head (rsd_link, wp_generator, index_rel_link, wlwmanifest_link, feed_links_extra, start_post_rel_link, parent_post_rel_link, adjacent_posts_rel_link)
* Poprawka : poprawione "Clearing Floats" obrazkÛw
* Poprawka : usuniÍty komunikat "MoøliwoúÊ komentowania jest wy≥πczona." na stronach z blokadπ dodawania komentarzy
* Poprawka : zabezpieczenie przed przycinaniem obrazkÛw, ktÛre wychodzπ poza obszar treúci - .entry-content img { height:auto; max-width:100%; }
* Zmiana : poprawione wyúwietlanie podglπdu obrazka nag≥Ûwka w panelu administracyjnym; dodane wpstart_admin_header_image

= 1.0.1 - 19.04.2012 =
* Zmiana : nowy screenshot.png
* Zmiana : przeniesione get_search_form z wpstart_header_content do sidebar-first area
* Zmiana : dodane style CSS - img.alignleft, img.alignright, .nav-previous; dodane clear:"both" to .link-page
* Poprawka : poprawki w CSS - usuniÍcie zbÍdnych styli: #headline, #breadcrumb, #banner, .opacity, .gallery-thumbs, input:focus, input[type="text"]:focus, input[type="submit"]:hover, img.header-image, .home #content
* Poprawka : usuniÍcie zbÍdnego pliku: includes/content-extensions - Kopia.php

= 1.0 - 14.04.2012 =
* Pierwsze wydanie.
