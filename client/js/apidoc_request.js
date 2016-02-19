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

        jQuery('li.requestnavi').on('click', bundleClickHandler);

        var filterNavigation = function(onlyRPC) {
            if(onlyRPC) {
                jQuery('li.requestnavi[data-rpc="false"]').hide();
            }
            else {
                jQuery('li.requestnavi').show();
            }
        };

        jQuery('#rpc-filter').change(function() {
            filterNavigation(this.checked);
        });

        var json = {};

        APIDOC.versionChanged = function(version) {
            if(json[version]) {
                APIDOC.renderNavigation(json[version]);
                return;
            }
            jQuery.ajax('/api/requests.json', {
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
            var panel = getPanel('Requests', json);
            navig.append(panel);
            // reset to changelog
            APIDOC.showBundleDoc(selector.val());
        };

        var naviTemplate = jQuery('<div class="panel panel-default generated">'
            + '<div class="panel-heading"></div>'
            + '<div class="panel-body"><ul></ul></div>'
         +'</div>');
        var bundleItemTemplate = jQuery('<li data-path="path/to/bundle" class="requestnavi"></li>');

        var getPanel = function(namespace, requests) {
            var panel = naviTemplate.clone();
            panel.find('div.panel-heading').append(namespace);
            var list = panel.find('ul');
            requests.forEach(function(req) {
                var item = bundleItemTemplate.clone();
                item.attr('data-path', req.path);
                item.attr('data-rpc', req.rpc);
                item.attr('title', req.desc);
                item.append(req.name);
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
