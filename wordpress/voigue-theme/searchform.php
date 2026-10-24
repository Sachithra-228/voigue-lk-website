<?php
/**
 * Blog search box.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;
?>
<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="sr-only" for="blog-search">Search articles</label>
	<input type="search" id="blog-search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="Search the blog" class="focus-ring w-full rounded-full border border-line px-5 py-3">
	<input type="hidden" name="post_type" value="post">
</form>
