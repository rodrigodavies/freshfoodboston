<?php global $mixfolio_options;
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the id=main div and all content after
 *
 * @package Mixfolio
 */
?>
				</div><!-- .twelve -->
			</div><!-- #main -->
		</div><!-- .main-outer -->

		<footer id="colophon" class="row" role="contentinfo">
			<div id="site-generator" class="twelve columns">
				<span class="right">
					<?php printf( __( 'Based on %1$s by %2$s', 'mixfolio' ), '<a href="http://graphpaperpress.com/themes/mixfolio/">Mixfolio</a>', '<a href="http://graphpaperpress.com/" rel="designer">Graph Paper Press</a>' ); ?>. <a href="http://thenounproject.com/noun/fruit/#icon-No3378" target="_blank">Fruit</a> designed by <a href="http://thenounproject.com/Jaymepayme" target="_blank">Jayme Davis</a> from The Noun Project
				</span><!-- .right -->
			</div><!-- #site-generator -->
		</footer><!-- #colophon -->
	</div><!-- #page -->


<?php wp_footer(); ?>
</body>
</html>