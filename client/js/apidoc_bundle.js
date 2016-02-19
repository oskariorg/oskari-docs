/**
 * Oskari api documentation helper
 * Registers in global 'APIDOC' variable
 */

var Navigo = require('navigo');
var router = new Navigo('/api/bundles', true);

function bundleNavigation(selector) {

        var APIDOC = {};

        var currentVersion = selector.val();
        selector.on('change', function() {
            currentVersion = jQuery(this).val();
            router.navigate(currentVersion);
        });

        var json = {};

        APIDOC.versionChanged = function(version) {
            if(json[version]) {
                APIDOC.renderNavigation(json[version]);
                return;
            }
            jQuery.ajax('/api/bundles.json', {
                data : {
                    version : version
                }
            }).done(function(response) {
                json[response.version] = response.api;
                APIDOC.renderNavigation(json[response.version]);
              })
              .fail(function() {
                alert( "error loading version info" );
              })
            //console.log('version changed:', version);
        };

        APIDOC.renderNavigation = function(json) {
            // remove the old navigation
            var navig = jQuery('#bundlenavi');
            navig.find('div.generated').remove();
            // setup new one
            jQuery.each( json, function( index, namespace ) {
                var panel = getPanel(namespace.name, namespace.bundles);
                navig.append(panel);
            });
            // reset to changelog
            APIDOC.showBundleDoc(selector.val());
        };

        var naviTemplate = jQuery('<div class="panel panel-default generated">'
            + '<div class="panel-heading"></div>'
            + '<div class="panel-body"><ul></ul></div>'
         +'</div>');
        var bundleItemTemplate = jQuery('<li class="bundlenavi"><a href="javascript:void(0);"></a></li>');

        var getPanel = function(namespace, bundles) {
            var panel = naviTemplate.clone();
            panel.find('div.panel-heading').append(namespace);
            var list = panel.find('ul');
            bundles.forEach(function(bundle) {
                var item = bundleItemTemplate.clone();
                item.attr('title', bundle.desc);
                var link = item.find('a');
                //link.attr('href', bundle.path);
                link.append(bundle.name);
                item.on('click', function(e) {
                    e.preventDefault();
                    router.navigate(currentVersion + '/' + bundle.path);
                });
                list.append(item);
            });
            return panel;
        };
        var fixCodeHighlights = function() {
            jQuery('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        };
        APIDOC.showBundleDoc = function(version, bundle) {
            var url =  version + '/' + (bundle || '');
            //router.navigate(url);
            jQuery('#bundlecontent').load( '/apidoc/' + url, function() {
                fixCodeHighlights();
            });
        }

        // -------------- ROUTING ----------------
        router.on('#:version/:ns/:bundle', function (params) {
            APIDOC.showBundleDoc(params.version, params.ns + '/' + params.bundle);
        });
        router.on('#:version', function (params) {
            APIDOC.versionChanged(params.version);
        });

/*
        router.on(function () {
            // no route match
        });
*/

        return APIDOC;
    }

module.exports = bundleNavigation;
