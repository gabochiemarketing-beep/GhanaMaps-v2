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
        'height' => '90vh',
        'fullwidth' => 'true'
    ), $atts, 'gabochie_gis');

    $height = esc_attr($atts['height']);
    $url = esc_url($atts['url']);

    return sprintf(
        '<style>
            .gabochie-gis-wrapper {
                width: 100%%;
                max-width: 100vw;
                position: relative;
                margin-left: 50%%;
                transform: translateX(-50%%);
                padding: 0;
            }
            .gabochie-gis-iframe {
                width: 100%%;
                height: %s;
                min-height: 700px;
                border: none;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                display: block;
            }
        </style>
        <div class="gabochie-gis-wrapper">
            <iframe src="%s" class="gabochie-gis-iframe" allow="geolocation; camera; microphone"></iframe>
        </div>',
        $height,
        $url
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
    echo '<div style="margin:20px 20px 0 0;">
        <h1 style="font-weight:900; color:#0f172a; margin-bottom:15px;">Gabochie Marketing GIS & Maps BI Console</h1>
        <iframe src="http://localhost:3000/?tab=dashboard" width="100%" height="880px" style="border:none; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.12);"></iframe>
    </div>';
}
