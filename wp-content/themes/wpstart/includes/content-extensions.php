<?php

/* wpstart_after_attachment_post */
if ( !function_exists( 'wpstart_after_attachment_post' ) ) {
	function wpstart_after_attachment_post() {
		?>
		</article>
		<?php
	}
}

/* wpstart_after_container */
if ( !function_exists( 'wpstart_after_container' ) ) {
	function wpstart_after_container() { 
		if ( is_archive() || is_author() || is_category() || is_search() || is_tag() ) { ?>
			</section><!-- #container -->
		<?php } else { ?>
			</div><!-- #container -->
		<?php }
	}
}

/* wpstart_after_content */
if ( !function_exists( 'wpstart_after_content' ) ) {
	function wpstart_after_content() { 
		?>
		</div><!-- #content -->
		<?php
	}
}

/* wpstart_after_footer */
if ( !function_exists( 'wpstart_after_footer' ) ) {
	function wpstart_after_footer() { 
		?>
			</footer>
		</div><!-- #wrapper -->
		<?php
	}
}

/* wpstart_after_header */
if ( !function_exists( 'wpstart_after_header' ) ) {
	function wpstart_after_header() { 
		?>
		</header><!-- #header -->
		<?php
	}
}

/* wpstart_after_main */
if ( !function_exists( 'wpstart_after_main' ) ) {
	function wpstart_after_main() { 
		?>
		</div><!-- #main -->
		<?php
	}
}

/* wpstart_after_page_post */
if ( !function_exists( 'wpstart_after_page_post' ) ) {
	function wpstart_after_page_post() {
		?>
		</article>
		<?php
	}
}

/* wpstart_after_single_post */
if ( !function_exists( 'wpstart_after_single_post' ) ) {
	function wpstart_after_single_post() {
		?>
		</article>
		<?php
	}
}

/* wpstart_attachment_entry_content */
if ( !function_exists( 'wpstart_attachment_entry_content' ) ) {
	function wpstart_attachment_entry_content() {
		?>		
		<div class="entry-content">
			<div class="entry-attachment">
			<?php if ( wp_attachment_is_image() ) : ?>
				<img class="aligncenter" src="<?php echo wp_get_attachment_url(); ?>" alt="<?php the_title_attribute(); ?>" title="<?php the_title_attribute(); ?>" />
			<?php else: ?>
				<a href="<?php echo wp_get_attachment_url(); ?>" title="<?php echo esc_attr( get_the_title() ); ?>"><?php echo basename( get_permalink() ); ?></a>
			<?php endif; ?>
			</div>
		</div>
		<?php
	}
}

/* wpstart_attachment_entry_footer */
if ( !function_exists( 'wpstart_attachment_entry_footer' ) ) {
	function wpstart_attachment_entry_footer() { 
	?>
		<footer class="entry-footer">
			<?php if ( wp_attachment_is_image() ) {
				$metadata = wp_get_attachment_metadata();
				printf( __( '<span class="meta-dimensions">Original dimensions %s</span>', 'wpstart' ),
					sprintf( '<a href="%1$s" title="%2$s">%3$s &times; %4$s</a>',
						wp_get_attachment_url(),
						esc_attr( __( 'Link to image', 'wpstart' ) ),
						$metadata['width'],
						$metadata['height']
					)
				);
			}
							
			edit_post_link( __( '(Edit)', 'wpstart' ), '<span class="edit-link">', '</span>' ); ?>
		</footer>	
	<?php 
	}
}

/* wpstart_attachment_entry_header */
if ( !function_exists( 'wpstart_attachment_entry_header' ) ) {
	function wpstart_attachment_entry_header() { ?>
		<header class="entry-header">
		<?php if ( is_single() ) { ?>
			<h1 class="entry-title"><?php the_title(); ?></h1>
		<?php } elseif (is_404()) { ?>
			<h1 class="entry-title"><?php _e( 'Page not found', 'wpstart' ); ?> - 404</h1>
		<?php } ?>
		
		<p><span class="back-to-entry"><a href="<?php echo get_permalink( $post->post_parent ); ?>" title="<?php esc_attr( get_the_title( $post->post_parent ) ); ?>">
		<?php printf( __( '&larr; Back to %s', 'wpstart' ), get_the_title( $post->post_parent ) ); ?></a></span></p>
		
		<?php printf('<span class="meta-date"><span class="meta-date-prep">' . __( 'Published on:', 'wpstart' ) . '</span> %1$s',
			sprintf( '<time datetime="%1$s">%2$s</time></span> ',
				esc_attr( get_the_date( 'c' ) ),
				get_the_date()
			)
		);
		
		printf('<span class="meta-author"><span class="meta-author-prep">' . __( 'Author:', 'wpstart' ) . '</span> %1$s',
			sprintf( '<a href="%1$s" class="meta-author-link" title="%2$s">%3$s</a></span>',
				get_author_posts_url( get_the_author_meta( 'ID' ) ),
				sprintf( esc_attr__( 'View posts by this author', 'wpstart' ), get_the_author() ),
				get_the_author()
			)
		);
				
		if ( comments_open() && ! post_password_required() ) :
			echo ' ' . '<span class="meta-comments">';
				comments_popup_link( __( 'Leave a comment', 'wpstart' ), __( '1 Comment', 'wpstart' ), __( '% Comments', 'wpstart' ), 'meta-comments-link' );
			echo '</span>';
		endif; ?>
	<?php }
}

/* wpstart_attachment_navigation */
if ( !function_exists( 'wpstart_attachment_navigation' ) ) {
	function wpstart_attachment_navigation() {
		?>
		<div class="attachment-navigation">
			<div class="previous-attachment"><?php previous_image_link( false, __( '&laquo; Previous', 'wpstart' ) ); ?></div>
			<div class="next-attachment"><?php next_image_link( false, __( 'Next &raquo;', 'wpstart' ) ); ?></div>
		</div>
		<?php
	}
}

/* wpstart_before_attachment_post */
if ( !function_exists( 'wpstart_before_attachment_post' ) ) {
	function wpstart_before_attachment_post() {
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<?php
	}
}

/* wpstart_before_container */
if ( !function_exists( 'wpstart_before_container' ) ) {
	function wpstart_before_container() { 
		if ( is_archive() || is_author() || is_category() || is_search() || is_tag() ) { ?>
			<section id="container">
		<?php } else { ?>
			<div id="container">
		<?php }
	}
}

/* wpstart_before_content */
if ( !function_exists( 'wpstart_before_content' ) ) {
	function wpstart_before_content() { 
		?>
		<div id="content">
		<?php
	}
}

/* wpstart_before_footer */
if ( !function_exists( 'wpstart_before_footer' ) ) {
	function wpstart_before_footer() { 
		?>
		<footer id="footer">
		<?php
	}
}

/* wpstart_before_header */
if ( !function_exists( 'wpstart_before_header' ) ) {
	function wpstart_before_header() { 
		?>
		<div id="wrapper">
			<header id="header">
		<?php
	}
}

/* wpstart_before_main */
if ( !function_exists( 'wpstart_before_main' ) ) {
	function wpstart_before_main() { 
		?>
		<div id="main">
		<?php
	}
}

/* wpstart_before_page_post */
if ( !function_exists( 'wpstart_before_page_post' ) ) {
	function wpstart_before_page_post() {
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<?php
	}
}

/* wpstart_before_single_post */
if ( !function_exists( 'wpstart_before_single_post' ) ) {
	function wpstart_before_single_post() {
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<?php
	}
}

/* wpstart_body_class */
if ( !function_exists( 'wpstart_body_class' ) ) {
	function wpstart_body_class($classes) {
		$classes[] = 'template-2columns-right';	
		return $classes;
	}
}
add_filter('body_class', 'wpstart_body_class');

/* wpstart_footer_content */
if ( !function_exists( 'wpstart_footer_content' ) ) {
	function wpstart_footer_content() { 
	?>
	<?php get_sidebar('footer'); ?>
			
	<?php if ( is_active_sidebar( 'colophon' ) ) : ?>
		<div class="sidebar sidebar-colophon">
			<?php dynamic_sidebar( 'colophon' ); ?>
		</div>
	<?php else: ?>	
		<div class="sidebar sidebar-colophon">
			<aside id="text" class="widget-container widget_text">		
				<div class="textwidget">
					<p>&copy; <a href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" class="site-info"><?php bloginfo( 'name' ); ?></a>. <a href="http://wordpress.org" title="<?php echo esc_attr( _e( 'Powered by WordPress', 'wpstart' ) ); ?>" class="site-generator"><?php echo esc_attr( _e( 'Powered by WordPress', 'wpstart' ) ); ?></a> &amp; <a href="http://krusze.pl/wpstart" title="WPstart Theme" class="site-webdesign" target="_blank">WPstart Theme</a>.</p>	
				</div>
			</aside>
		</div>
	<?php endif; ?>
	<?php
	}
}

/* wpstart_head */
if ( !function_exists( 'wpstart_head' ) ) {
	function wpstart_head() { 
	?>
<head>
<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />

<title><?php wp_title('', true); ?></title>

<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
<link rel="stylesheet" href="<?php bloginfo( 'stylesheet_url' ); ?>" type="text/css" media="all" />

<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri(); ?>/js/html5shiv.js" type="text/javascript"></script>
<![endif]-->

<!-- WPstart v1.0.9 - http://krusze.pl -->

<?php if ( is_singular() && get_option( 'thread_comments' ) ) wp_enqueue_script( 'comment-reply' ); ?>

<?php wp_head(); ?>
</head>
	<?php
	}
}

/* wpstart_header_content */
if ( !function_exists( 'wpstart_header_content' ) ) {
	function wpstart_header_content() { 
	?>
	<hgroup>
		<h1 class="site-title">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
		</h1>
		<h2 class="site-description"><?php bloginfo('description'); ?></h2>
	</hgroup>
	<?php
	}
}

/* wpstart_header_image */
if ( !function_exists( 'wpstart_header_image' ) ) {
	function wpstart_header_image() {
		$header_image = get_header_image();
		if ( ! empty( $header_image ) ) : ?>
			<img src="<?php header_image(); ?>" width="<?php echo HEADER_IMAGE_WIDTH; ?>" height="<?php echo HEADER_IMAGE_HEIGHT; ?>" alt="" class="header-image" />
		<?php endif;
	}
}

/* wpstart_nav */
if ( !function_exists( 'wpstart_nav' ) ) {
	function wpstart_nav() {
		?> 
		<nav id="nav">
			<div class="screen-reader-text">
				<a href="#content" title="<?php esc_attr_e( 'Content', 'wpstart' ); ?>"><?php _e( 'Content', 'wpstart' ); ?></a>
			</div>	
			<?php wp_nav_menu( array( 'theme_location' => 'navigation' ) ); ?>
		</nav>
		<?php
	}
}

/* wpstart_page_entry_content */
if ( !function_exists( 'wpstart_page_entry_content' ) ) {
	function wpstart_page_entry_content() {
		?>
		<div class="entry-content">
			<?php the_content(); ?>
			<?php edit_post_link( __( 'Edit', 'wpstart' ), '<span class="edit-link">', '</span>' ); ?>
			<?php wp_link_pages( array( 'before' => '<div class="link-pages">' . __( 'Pages:', 'wpstart' ), 'after' => '</div>' ) ); ?>
		</div>
		<?php
	}
}

/* wpstart_page_entry_header */
if ( !function_exists( 'wpstart_page_entry_header' ) ) {
	function wpstart_page_entry_header() { ?>
		<header class="entry-header">
			<h1 class="entry-title"><?php the_title(); ?></h1>
		</header>
	<?php }
}

/* wpstart_page_title */
if ( !function_exists( 'wpstart_page_title' ) ) {
	function wpstart_page_title() {	?>
		<header class="archive-header">
		<?php if (is_author()) { ?>
			<h1 class="page-title"><?php printf( __('Posts by %s', 'wpstart'), '<span class="vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( "ID" ) ) ) . '" title="' . esc_attr( get_the_author() ) . '">' . get_the_author() . '</a></span>' ); ?></h1>
		<?php } elseif (is_category()) { ?>
			<h1 class="page-title"><?php printf( __( 'You are currently browsing the archives for the %s category.', 'wpstart' ), '<span>' . single_cat_title( '', false ) . '</span>' ); ?></h1>
			<?php
				$category_description = category_description();
				if ( ! empty( $category_description ) ) : ?>
					<div class="category-description"><?php echo category_description(); ?></div>
			<?php endif; ?>			
		<?php } elseif (is_search()) { ?>
			<h1 class="page-title"><?php printf( __( 'Search results for &#8220;%s&#8221;', 'wpstart' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
		<?php } elseif (is_tag()) { ?>
			<h1 class="page-title"><?php printf( __( 'Tag Archives: %s', 'wpstart' ), '<span>' . single_tag_title( '', false ) . '</span>' ); ?></h1>
		<?php } elseif (is_day()) { ?>
			<h1 class="page-title"><?php printf( __( 'Daily Archives: <span>%s</span>', 'wpstart' ), get_the_date() ); ?></h1>
		<?php } elseif (is_month()) { ?>
			<h1 class="page-title"><?php printf( __( 'Monthly Archives: <span>%s</span>', 'wpstart' ), get_the_date( 'F Y' ) ); ?></h1>
		<?php } elseif (is_year()) { ?>
			<h1 class="page-title"><?php printf( __( 'Yearly Archives: <span>%s</span>', 'wpstart' ), get_the_date( 'Y' ) ); ?></h1>
		<?php } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
			<h1 class="page-title"><?php _e( 'Archives', 'wpstart' ); ?></h1>';
		<?php } ?>
		</header>
	<?php }
}

/* wpstart_post_entry_footer */
if ( !function_exists( 'wpstart_post_entry_footer' ) ) {
	function wpstart_post_entry_footer() {
		echo '<footer class="entry-footer">';
			if ( count( get_the_category() ) ) :			
				echo '<span class="meta-categories">';
					printf('<span class="%1$s">' . __( 'Categories', 'wpstart' ) . ':</span> %2$s', 'meta-category-prep', get_the_category_list( ', ' ) );
				echo '</span>';
			endif;
							
			$tags = get_the_tag_list( '', ', ' );
			if ( $tags ):
				echo ' ' . '<span class="meta-tags">';
					printf( '<span class="%1$s">%2$s</span> %3$s', 'meta-tags-prep', __( 'Tags:', 'wpstart' ), $tags );
				echo '</span>';
			endif;

			edit_post_link( __( '(Edit)', 'wpstart' ), '<span class="edit-link">', '</span>' );
		echo '</footer>';
	}
}

/* wpstart_post_entry_header */
if ( !function_exists( 'wpstart_post_entry_header' ) ) {
	function wpstart_post_entry_header() { ?>
		<header class="entry-header">
			<h2 class="entry-title"><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute( array('before' => esc_attr__( 'Permalink: ', 'wpstart' ), 'after' => '')); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
		
		<?php if ( 'post' == get_post_type() ) :
			printf('<span class="meta-date"><span class="meta-date-prep">' . __( 'Published on:', 'wpstart' ) . '</span> %1$s',
				sprintf( '<a href="%1$s" title="%2$s" rel="bookmark"><time datetime="%3$s">%4$s</time></a></span> ',
					get_permalink(),
					esc_attr( get_the_time() ),
					esc_attr( get_the_date( 'c' ) ),
					get_the_date()
				)
			);
					
			printf('<span class="meta-author"><span class="meta-author-prep">' . __( 'Author:', 'wpstart' ) . '</span> %1$s',
				sprintf( '<a href="%1$s" class="meta-author-link" title="%2$s">%3$s</a></span>',
					get_author_posts_url( get_the_author_meta( 'ID' ) ),
					sprintf( esc_attr__( 'View posts by this author', 'wpstart' ), get_the_author() ),
					get_the_author()
				)
			);
					
			if ( comments_open() && ! post_password_required() ) :
				echo ' ' . '<span class="meta-comments">';
					comments_popup_link( __( 'Leave a comment', 'wpstart' ), __( '1 Comment', 'wpstart' ), __( '% Comments', 'wpstart' ), 'meta-comments-link' );
				echo '</span>';
			endif;
		endif; ?>
		</header>
	<?php }
}

/* wpstart_post_entry_summary */
if ( !function_exists( 'wpstart_post_entry_summary' ) ) {
	function wpstart_post_entry_summary() {
		?>
		<div class="entry-summary">
			<?php if (has_post_thumbnail()){ ?>
			<a href="<?php the_permalink() ?>" title="<?php the_title_attribute( array('before' => esc_attr__( 'Permalink: ', 'wpstart' ), 'after' => '')); ?>" rel="bookmark"><?php the_post_thumbnail(); ?></a>
			<?php } ?>
			<?php the_excerpt(); ?>
		</div>
		<?php
	}
}

/* wpstart_post_no_results_not_found */
if ( !function_exists( 'wpstart_post_no_results_not_found' ) ) {
	function wpstart_post_no_results_not_found() {
		?>
		<article id="post-0" class="post no-results not-found">
			<header>
				<h1 class="entry-title"><?php _e( 'No posts found.', 'wpstart' ); ?></h1>
			</header>
			<div class="entry-content">
				<?php get_search_form(); ?>
			</div>
		</article>
		<?php
	}
}

/* wpstart_post_pagination */
if ( !function_exists( 'wpstart_post_pagination' ) ) {
	function wpstart_post_pagination() {
		global $wp_query;
		if (  $wp_query->max_num_pages > 1 ) : ?>
		<div class="navigation">
			<div class="nav-previous"><?php next_posts_link( __( '<span class="meta-nav">&larr;</span> Older', 'wpstart' ) ); ?></div>
			<div class="nav-next"><?php previous_posts_link( __( 'Newer <span class="meta-nav">&rarr;</span>', 'wpstart' ) ); ?></div>
		</div>
		<?php endif;
	}
}

/* wpstart_search_form */
if ( !function_exists( 'wpstart_search_form' ) ) {
	function wpstart_search_form() {
		?>		
		<form method="get" id="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
			<div>
				<label class="screen-reader-text" for="s"><?php _e( 'Search', 'wpstart' ) ?></label>
				<input type="text" value="" name="s" id="s" />
				<input type="submit" id="searchsubmit" value="<?php esc_attr_e( 'Search', 'wpstart' ) ?>" />
			</div>
		</form>
		<?php
	}
}

/* wpstart_search_no_results_not_found */
if ( !function_exists( 'wpstart_search_no_results_not_found' ) ) {
	function wpstart_search_no_results_not_found() {
		?>		
		<article id="post-0" class="post no-results not-found">
			<header>
				<h1 class="entry-title"><?php _e( 'No results found.', 'wpstart' ); ?></h1>
			</header>
			<div class="entry-content">
				<p><?php _e( 'Sorry, no posts matched your criteria.', 'wpstart' ); ?></p>
				<?php get_search_form(); ?>
			</div>
		</article>
		<?php
	}
}

/* wpstart_single_entry_content */
if ( !function_exists( 'wpstart_single_entry_content' ) ) {
	function wpstart_single_entry_content() {
		?>		
		<div class="entry-content">
			<?php if ( has_post_thumbnail()) { $large_image_url = wp_get_attachment_image_src( get_post_thumbnail_id(), 'large');
			echo '<a href="' . $large_image_url[0] . '" title="' . the_title_attribute('echo=0') . '" >';
			the_post_thumbnail();
			echo '</a>';
			} ?>
			<?php the_content(); ?>				
			<?php wp_link_pages( array( 'before' => '<div class="link-pages">' . __('Pages:', 'wpstart'), 'after' => '</div>' ) ); ?>
		</div>
		<?php
	}
}

/* wpstart_single_entry_footer */
if ( !function_exists( 'wpstart_single_entry_footer' ) ) {
	function wpstart_single_entry_footer() {
		echo '<footer class="entry-footer">';
			if ( count( get_the_category() ) ) :			
				echo '<span class="meta-categories">';
					printf('<span class="%1$s">' . __( 'Categories', 'wpstart' ) . ':</span> %2$s', 'meta-category-prep', get_the_category_list( ', ' ) );
				echo '</span>';
			endif;
							
			$tags = get_the_tag_list( '', ', ' );
			if ( $tags ):
				echo ' ' . '<span class="meta-tags">';
					printf( '<span class="%1$s">%2$s</span> %3$s', 'meta-tags-prep', __( 'Tags:', 'wpstart' ), $tags );
				echo '</span>';
			endif;
			
			edit_post_link( __( '(Edit)', 'wpstart' ), '<span class="edit-link">', '</span>' );
		echo '</footer>';
	}
}

/* wpstart_single_entry_header */
if ( !function_exists( 'wpstart_single_entry_header' ) ) {
	function wpstart_single_entry_header() { ?>
		<header class="entry-header">
		<?php if ( is_single() ) { ?>
			<h1 class="entry-title"><?php the_title(); ?></h1>
		<?php } elseif (is_404()) { ?>
			<h1 class="entry-title"><?php _e( 'Page not found', 'wpstart' ); ?> - 404</h1>
		<?php } ?>
		
		<?php printf('<span class="meta-date"><span class="meta-date-prep">' . __( 'Published on:', 'wpstart' ) . '</span> %1$s',
				sprintf( '<time datetime="%1$s">%2$s</time></span> ',
					esc_attr( get_the_date( 'c' ) ),
					get_the_date()
				)
			);
				
			printf('<span class="meta-author"><span class="meta-author-prep">' . __( 'Author:', 'wpstart' ) . '</span> %1$s',
				sprintf( '<a href="%1$s" class="meta-author-link" title="%2$s">%3$s</a></span>',
					get_author_posts_url( get_the_author_meta( 'ID' ) ),
					sprintf( esc_attr__( 'View posts by this author', 'wpstart' ), get_the_author() ),
					get_the_author()
				)
			);
				
			if ( comments_open() && ! post_password_required() ) :
				echo ' ' . '<span class="meta-comments">';
					comments_popup_link( __( 'Leave a comment', 'wpstart' ), __( '1 Comment', 'wpstart' ), __( '% Comments', 'wpstart' ), 'meta-comments-link' );
				echo '</span>';
			endif; ?>
		</header>
	<?php }
}

/* wpstart_single_entry_navigation */
if ( !function_exists( 'wpstart_single_entry_navigation' ) ) {
	function wpstart_single_entry_navigation() {
		?>
		<div class="entry-navigation">
			<div class="previous-entry"><?php previous_post_link('%link', '<span> &larr; </span> %title'); ?></div>
			<div class="next-entry"><?php next_post_link('%link', '%title <span> &rarr; </span>'); ?></div>
		</div>
		<?php
	}
}


?>