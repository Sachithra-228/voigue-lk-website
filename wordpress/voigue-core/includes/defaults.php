<?php
/**
 * Default values and the list of editable photo / video slots.
 *
 * @package Voigue_Core
 */

defined( 'ABSPATH' ) || exit;

/**
 * Contact details and social links. Editable under Voigue > Site settings; these are the starting values.
 *
 * @return array<string,string>
 */
function voigue_default_settings() {
	return array(
		'brand_line'       => 'Bridging people and possibilities across borders.',
		'website'          => 'www.voigue.com',
		'email_general'    => 'hello@voigue.com',
		'email_careers'    => 'careers@voigue.com',
		'phone_lk'         => '011 711 0170',
		'phone_au'         => '1300 095 588',
		'address_au'       => 'Ground floor, 470 St Kilda Road, Melbourne, VIC 3004, Australia',
		'address_lk'       => 'No. 736 (4th floor), Bank Building, Dr Danister De Silva Mw, Orion City, Colombo 09',
		'social_linkedin'  => 'https://www.linkedin.com/company/voigue/',
		'social_instagram' => 'https://www.instagram.com/voigue365?igsi=dDN4NGdtZm5semQ0',
		'social_facebook'  => 'https://www.facebook.com/share/14nRE1USJ8Q/?mibextid=wwXIfr',
		'social_tiktok'    => 'https://www.tiktok.com/@voigueptyltd?_r=1&_t=ZS-99TKd3EV1eB',
		'life_youtube'     => '',
		'map_lk'           => 'Orion City, Dr Danister De Silva Mawatha, Colombo 09, Sri Lanka',
		'map_au'           => '470 St Kilda Road, Melbourne, VIC 3004, Australia',
	);
}

/**
 * Every photo or video the design uses. Leave a slot empty and the site shows a neutral placeholder.
 *
 * @return array<string,array{label:string,type:string,group:string}>
 */
function voigue_media_slots() {
	return array(
		'home_hero_clip_1' => array(
			'label' => 'Hero video clip 1',
			'type'  => 'video',
			'group' => 'Home page',
		),
		'home_hero_clip_2' => array(
			'label' => 'Hero video clip 2 (optional)',
			'type'  => 'video',
			'group' => 'Home page',
		),
		'home_hero_clip_3' => array(
			'label' => 'Hero video clip 3 (optional)',
			'type'  => 'video',
			'group' => 'Home page',
		),
		'home_hero_poster' => array(
			'label' => 'Hero poster image (shown while the video loads)',
			'type'  => 'image',
			'group' => 'Home page',
		),
		'home_exp_culture' => array(
			'label' => 'Experience: People & Culture photo',
			'type'  => 'image',
			'group' => 'Home page',
		),
		'home_exp_trust'   => array(
			'label' => 'Experience: Trust & Ownership photo',
			'type'  => 'image',
			'group' => 'Home page',
		),
		'home_exp_growth'  => array(
			'label' => 'Experience: Growth & Progression photo',
			'type'  => 'image',
			'group' => 'Home page',
		),
		'about_hero'       => array(
			'label' => 'About hero: full-width people photo',
			'type'  => 'image',
			'group' => 'About Us page',
		),
		'about_future'     => array(
			'label' => 'Future of Work photo',
			'type'  => 'image',
			'group' => 'About Us page',
		),
		'life_hero_video'  => array(
			'label' => 'Hero video',
			'type'  => 'video',
			'group' => 'Life at Voigue page',
		),
		'life_hero_poster' => array(
			'label' => 'Hero poster image (shown while the video loads)',
			'type'  => 'image',
			'group' => 'Life at Voigue page',
		),
		'life_people_team' => array(
			'label' => 'People: large team photo',
			'type'  => 'image',
			'group' => 'Life at Voigue page',
		),
		'life_people_portrait' => array(
			'label' => 'People: employee portrait',
			'type'  => 'image',
			'group' => 'Life at Voigue page',
		),
		'life_people_moment' => array(
			'label' => 'People: culture moment',
			'type'  => 'image',
			'group' => 'Life at Voigue page',
		),
	);
}
