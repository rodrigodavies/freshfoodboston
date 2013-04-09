<div id="leftcolumn" class="widget-area" role="complementary">
	<?php if ( ! dynamic_sidebar( 'widget-area-left' ) ) : ?>

		<aside id="archives" class="widget">
			<h3 class="widget-title"><?php _e( 'Recent Articles', 'birdtips' ); ?></h3>
			<ul>
				<?php wp_get_archives( array( 'type' => 'postbypost' ) ); ?>
			</ul>
		</aside>
	<?php endif; ?>

</div>
