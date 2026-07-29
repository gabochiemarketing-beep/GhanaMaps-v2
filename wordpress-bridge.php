<?php
/**
 * File: wordpress-bridge.php
 * Plugin Name: Ghana Maps & Business Intelligence Engine
 * Description: Production WordPress integration bridge for Ghana Maps GIS, BI Dashboard, and Lead Intelligence Platform.
 * Version: 1.2.0
 * Author: Gabochie Marketing
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

if (!class_exists('GhanaMapsPlugin')) {

    class GhanaMapsPlugin {

        /**
         * Instance counter for unique iframe IDs
         */
        private static $instance_count = 0;

        /**
         * Initialize plugin hooks and shortcodes
         */
        public function __construct() {
            add_shortcode('ghana_maps_shortcode', array($this, 'ghana_maps_shortcode'));
            add_shortcode('ghana_maps_dashboard', array($this, 'ghana_maps_shortcode'));
            add_shortcode('gabochie_gis', array($this, 'ghana_maps_shortcode'));

            if (is_admin()) {
                add_action('admin_menu', array($this, 'register_admin_menu'));
            }
        }

        /**
         * Shortcode handler for [ghana_maps_shortcode], [ghana_maps_dashboard], and [gabochie_gis]
         * 
         * URL Parameters injected by default:
         * ?tab=dashboard&hide_nav=true&hide_footer=true
         * 
         * Supported attributes:
         * - tab: "dashboard" | "public_landing" | "gis_map" | "explorer" | "founder_mode" | "microsaas"
         * - height: CSS height (default: "850px")
         * - hide_nav: "true" | "false" (default: "true")
         * - hide_footer: "true" | "false" (default: "true")
         * - url: Base application URL (default: "http://localhost:3000")
         */
        public function ghana_maps_shortcode($atts = array()) {
            self::$instance_count++;

            $atts = shortcode_atts(array(
                'url'         => 'http://localhost:3000',
                'tab'         => 'dashboard',
                'height'      => '850px',
                'hide_nav'    => 'true',
                'hide_footer' => 'true',
                'fullwidth'   => 'true',
            ), $atts, 'ghana_maps_shortcode');

            $height     = esc_attr($atts['height']);
            $tab        = esc_attr($atts['tab']);
            $baseUrl    = esc_url($atts['url']);
            $hideNav    = filter_var($atts['hide_nav'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
            $hideFooter = filter_var($atts['hide_footer'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
            $fullwidth  = filter_var($atts['fullwidth'], FILTER_VALIDATE_BOOLEAN);

            // Construct exact query string required for clean embed without header or footer overflow
            $queryParams = array(
                'tab'         => $tab,
                'embed'       => 'true',
                'hide_nav'    => $hideNav,
                'hide_footer' => $hideFooter,
                'inst'        => self::$instance_count,
            );

            $finalUrl    = add_query_arg($queryParams, $baseUrl);
            $containerId = 'ghana-maps-container-' . self::$instance_count;
            $iframeId    = 'ghana-maps-iframe-' . self::$instance_count;

            $wrapperStyle = $fullwidth ? 
                'width: 100%; max-width: 100vw; position: relative; margin-left: 50%; transform: translateX(-50%); padding: 0;' : 
                'width: 100%; max-width: 100%; position: relative; padding: 0;';

            return sprintf(
                '<div id="%s" class="ghana-maps-bridge-wrapper" style="%s">
                    <iframe id="%s" src="%s" class="ghana-maps-bridge-iframe" allow="geolocation; camera; microphone" style="width:100%%; height:%s; min-height:650px; border:none; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.08); display:block; background:#f8fafc;"></iframe>
                </div>',
                esc_attr($containerId),
                $wrapperStyle,
                esc_attr($iframeId),
                esc_url($finalUrl),
                $height
            );
        }

        /**
         * Register WP Admin Sidebar menu item
         */
        public function register_admin_menu() {
            add_menu_page(
                'Ghana Maps BI Console',
                'Ghana Maps BI',
                'manage_options',
                'ghana-maps-bi-console',
                array($this, 'render_admin_console'),
                'dashicons-location-alt',
                30
            );
        }

        /**
         * Render Admin Page
         */
        public function render_admin_console() {
            $adminShortcode = $this->ghana_maps_shortcode(array(
                'tab'         => 'dashboard',
                'height'      => '880px',
                'hide_nav'    => 'true',
                'hide_footer' => 'true',
                'fullwidth'   => 'false',
            ));

            echo '<div style="margin:20px 20px 20px 0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h1 style="font-weight:900; color:#0f172a; margin:0; font-size:22px;">Ghana Maps GIS & BI Admin Console</h1>
                        <p style="margin:4px 0 0 0; color:#64748b; font-size:13px;">Manage business leads, region analytics, and membership tier access.</p>
                    </div>
                    <a href="http://localhost:3000" target="_blank" style="background:#059669; color:#fff; text-decoration:none; padding:8px 16px; border-radius:8px; font-weight:700; font-size:13px; box-shadow:0 2px 8px rgba(5,150,105,0.25);">Launch Full App &rarr;</a>
                </div>';
            echo $adminShortcode;
            echo '</div>';
        }
    }

    // Instantiate and register plugin bridge
    new GhanaMapsPlugin();
}
