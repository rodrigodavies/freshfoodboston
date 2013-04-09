<div id="rightcolumn" class="widget-area" role="complementary">
	<?php if ( ! dynamic_sidebar( 'widget-area-right' ) ) : ?>

		<aside id="search" class="widget widget_search">
			<?php get_search_form(); ?>
		</aside>

		<aside id="meta" class="widget">
			<h3 class="widget-title"><?php _e( 'Meta', 'birdtips' ); ?></h3>
			<ul>
				<?php wp_register(); ?>
				<aside><?php wp_loginout(); ?></aside>
				<?php wp_meta(); ?>
			</ul>
		</aside>
	<?php endif; ?>
</div>
