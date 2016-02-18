/**
 * Oskari api documentation helper
 * Registers in global 'APIDOC' variable
 */
function navigation(selector) {

        var APIDOC = {};
        selector.on('change', function() {
            APIDOC.versionChanged(jQuery(this).val());
        });

        var bundleClickHandler = function() {
            var bundle = jQuery(this).data('path');
            APIDOC.showBundleDoc(selector.val(), bundle);
        };

        jQuery('li.bundlenavi').on('click', bundleClickHandler);

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
        var bundleItemTemplate = jQuery('<li data-path="path/to/bundle" class="bundlenavi"></li>');

        var getPanel = function(namespace, bundles) {
            var panel = naviTemplate.clone();
            panel.find('div.panel-heading').append(namespace);
            var list = panel.find('ul');
            bundles.forEach(function(bundle) {
                var item = bundleItemTemplate.clone();
                item.attr('data-path', bundle.path);
                item.attr('title', bundle.desc);
                item.append(bundle.name);
                item.on('click', bundleClickHandler);
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
            var url = '/apidoc/' + version + '/' + (bundle || '');
            jQuery('#bundlecontent').load( url, function() {
                fixCodeHighlights();
            });
        }
        return APIDOC;
    }

module.exports = navigation;
