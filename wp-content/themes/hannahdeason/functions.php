<?php

function theme_enqueue_styles() {
    wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array( 'avada-stylesheet' ) );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );

function avada_lang_setup() {
	$lang = get_stylesheet_directory() . '/languages';
	load_child_theme_textdomain( 'Avada', $lang );
}
add_action( 'after_setup_theme', 'avada_lang_setup' );

/**
 * This is required to allow additional file upload types.
 *
 * @param $mime_types
 * @return mixed
 */
function my_myme_types($mime_types){
    $mime_types['svg'] = 'image/svg+xml'; //Adding svg extension
    $mime_types['woff'] = 'application/font-woff';
    $mime_types['woff2'] = 'font/woff2';
    $mime_types['eot'] = 'application/vnd.ms-fontobject';
    $mime_types['otf'] = 'application/font-sfnt';
    $mime_types['ttf'] = 'application/font-sfnt';

    return $mime_types;
}
add_filter('upload_mimes', 'my_myme_types');

/**
 * Use text header instead of logo.
 */
function hd_avada_logo_prepend () {
    ?>
    <a class="fusion-logo-link hd-brand" href="<?php echo home_url( '/' ); ?>">
        Hannah Deason
    </a>
    <?php
}
add_action( 'avada_logo_prepend', 'hd_avada_logo_prepend');
