<?php
/**
 * Home page: Hero, Our Foundation, The Voigue Experience, Global Connection, Careers teaser, Recognition.
 *
 * @package Voigue_Theme
 */

defined( 'ABSPATH' ) || exit;

get_header();

get_template_part( 'template-parts/home/hero' );
get_template_part( 'template-parts/home/foundation' );
get_template_part( 'template-parts/home/experience' );
get_template_part( 'template-parts/home/global-connection' );
get_template_part( 'template-parts/home/careers-teaser' );
get_template_part( 'template-parts/home/recognition' );

get_footer();
