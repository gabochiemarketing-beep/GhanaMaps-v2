<?php
/**
 * Plugin Name: Gabochie MKT GIS & Membership SaaS
 * Plugin URI: https://mkt.gabochie.com
 * Description: Integrates Ghana Maps GIS BI & Lead Intelligence Platform into LocalWP & WordPress Admin.
 * Version: 1.0.0
 * Author: Gabochie Marketing
 * Author URI: https://mkt.gabochie.com
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// 1. Frontend Shortcode [gabochie_gis]
function gabochie_mkt_gis_shortcode($atts) {
    $atts = shortcode_atts(array(
        'url' => 'http://localhost:3000',
        'height' => '850px',
    ), $atts, 'gabochie_gis');

    return sprintf(
        '<div className="gabochie-gis-container" style="width:100%%; max-width:100%%; overflow:hidden; border-radius:16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin: 20px 0;">
            <iframe src="%s" width="100%%" height="%s" style="border:none; width:100%%; display:block;" allow="geolocation; camera; microphone"></iframe>
        </div>',
        esc_url($atts['url']),
        esc_attr($atts['height'])
    );
}
add_shortcode('gabochie_gis', 'gabochie_mkt_gis_shortcode');

// 2. WordPress Admin Menu Item
function gabochie_mkt_add_admin_menu() {
    add_menu_page(
        'Gabochie GIS BI',
        'Gabochie GIS BI',
        'manage_options',
        'gabochie-gis-bi',
        'gabochie_mkt_admin_page_render',
        'dashicons-location-alt',
        3
    );
}
add_action('admin_menu', 'gabochie_mkt_add_admin_menu');

function gabochie_mkt_admin_page_render() {
    echo '<div className="wrap" style="margin:20px 20px 0 0;">
        <h1 style="font-weight:900; color:#0f172a; margin-bottom:15px;">Gabochie Marketing GIS & Maps BI Console</h1>
        <iframe src="http://localhost:3000" width="100%" height="880px" style="border:none; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.12);"></iframe>
    </div>';
}
