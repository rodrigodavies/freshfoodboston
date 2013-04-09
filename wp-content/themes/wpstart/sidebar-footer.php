<?php
/*
 * Sidebar footer widget area.
 *
 * @package WordPress
 * @subpackage WPstart
 */
?>

<?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
	<div class="sidebar sidebar-footer">
		<?php dynamic_sidebar( 'footer-1' ); ?>
	</div>
<?php endif; ?>

<?php if ( is_active_sidebar( 'footer-2' ) ) : ?>
	<div class="sidebar sidebar-footer">
		<?php dynamic_sidebar( 'footer-2' ); ?>
	</div>
<?php endif; ?>

<?php if ( is_active_sidebar( 'footer-3' ) ) : ?>
	<div class="sidebar sidebar-footer">
		<?php dynamic_sidebar( 'footer-3' ); ?>
	</div>
<?php endif; ?>

<?php if ( is_active_sidebar( 'footer-4' ) ) : ?>
	<div class="sidebar sidebar-footer">
		<?php dynamic_sidebar( 'footer-4' ); ?>
	</div>
<?php endif; ?>