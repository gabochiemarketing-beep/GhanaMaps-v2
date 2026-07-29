<?php
/**
 * Plugin Name: Gabochie MKT GIS & Membership SaaS
 * Plugin URI: https://mkt.gabochie.com
 * Description: Integrates Ghana Maps GIS BI & Lead Intelligence Platform into LocalWP & WordPress Admin.
 * Version: 1.1.0
 * Author: Gabochie Marketing
 * Author URI: https://mkt.gabochie.com
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Load bridge file if present
if (file_exists(__DIR__ . '/wordpress-bridge.php')) {
    require_once __DIR__ . '/wordpress-bridge.php';
}

/**
 * 1. Production-Grade Shortcode [gabochie_gis]
 * 
 * Supported Attributes:
 * - view: "public_landing" | "dashboard" | "map_explorer" | "directory" | "lead_hunter" | "membership" | "analytics" | "leads"
 * - height: CSS height (default: "850px")
 * - hide_footer: "true" | "false" (default: "true" to prevent double footer)
 * - hide_nav: "true" | "false" (default: "false")
 * - url: Base app URL (default: "http://localhost:3000")
 * 
 * Examples:
 * [gabochie_gis view="dashboard" hide_footer="true"]
 * [gabochie_gis view="map_explorer" height="900px"]
 * [gabochie_gis view="directory"]
 */
function gabochie_mkt_gis_shortcode($atts) {
    static $instance = 0;
    $instance++;

    $atts = shortcode_atts(array(
        'url'         => 'http://localhost:3000',
        'view'        => 'public_landing',
        'height'      => '850px',
        'hide_footer' => 'true',
        'hide_nav'    => 'false',
        'fullwidth'   => 'true',
    ), $atts, 'gabochie_gis');

    $height     = esc_attr($atts['height']);
    $view       = esc_attr($atts['view']);
    $baseUrl    = esc_url($atts['url']);
    $hideFooter = filter_var($atts['hide_footer'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
    $hideNav    = filter_var($atts['hide_nav'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
    $fullwidth  = filter_var($atts['fullwidth'], FILTER_VALIDATE_BOOLEAN);

    // Build URL query params
    $queryParams = array(
        'tab'         => $view,
        'embed'       => 'true',
        'hide_footer' => $hideFooter,
        'hide_nav'    => $hideNav,
        'inst'        => $instance
    );

    $finalUrl = add_query_arg($queryParams, $baseUrl);
    $wrapperId = 'gabochie-gis-wrapper-' . $instance;
    $iframeId  = 'gabochie-gis-iframe-' . $instance;

    $fullwidthStyles = $fullwidth ? 
        "width: 100%; max-width: 100vw; position: relative; margin-left: 50%; transform: translateX(-50%); padding: 0;" : 
        "width: 100%; max-width: 100%; position: relative; padding: 0;";

    return sprintf(
        '<div id="%s" class="gabochie-gis-container" style="%s">
            <iframe id="%s" src="%s" class="gabochie-gis-frame" allow="geolocation; camera; microphone" style="width:100%%; height:%s; min-height:650px; border:none; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); display:block; background:#f8fafc;"></iframe>
        </div>',
        esc_attr($wrapperId),
        $fullwidthStyles,
        esc_attr($iframeId),
        esc_url($finalUrl),
        $height
    );
}
add_shortcode('gabochie_gis', 'gabochie_mkt_gis_shortcode');

/**
 * 2. WordPress Admin Menu Item (BI Console)
 */
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
    $adminUrl = 'http://localhost:3000/?tab=dashboard&embed=true&hide_footer=true&hide_nav=true&is_admin=true';
    echo '<div style="margin:20px 20px 20px 0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h1 style="font-weight:900; color:#0f172a; margin:0; font-size:22px;">Gabochie Marketing GIS & BI Console</h1>
            <a href="http://localhost:3000" target="_blank" style="background:#059669; color:#fff; text-decoration:none; padding:8px 16px; border-radius:8px; font-weight:700; font-size:13px;">Open Full App &rarr;</a>
        </div>
        <iframe src="' . esc_url($adminUrl) . '" width="100%" height="880px" style="border:none; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.12); background:#f8fafc;"></iframe>
    </div>';
}

