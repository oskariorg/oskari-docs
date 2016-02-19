/**
 * Oskari api documentation helper
 * Registers in global 'APIDOC' variable
 */

var Navigo = require('navigo');
var router = new Navigo('/api/events', true);

function eventNavigation(selector) {

        var APIDOC = {};
        var currentVersion = selector.val();
        selector.on('change', function() {
            currentVersion = jQuery(this).val();
            router.navigate(currentVersion);
        });

        var filterNavigation = function(onlyRPC) {
            if(onlyRPC) {
                jQuery('li.eventnavi:not([data-rpc="true"])').hide();
                //jQuery('li.eventnavi[data-rpc="false"]').hide();
            }
            else {
                jQuery('li.eventnavi').show();
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
            jQuery.ajax('/api/events.json', {
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
            var panel = getPanel('Events', json);
            navig.append(panel);
            // reset to changelog
            APIDOC.showBundleDoc(selector.val());
            filterNavigation(jQuery('#rpc-filter').is(":checked"));
        };

        var naviTemplate = jQuery('<div class="panel panel-default generated">'
            + '<div class="panel-heading"></div>'
            + '<div class="panel-body"><ul></ul></div>'
         +'</div>');
        var bundleItemTemplate = jQuery('<li class="eventnavi"><a href="javascript:void(0);"></a></li>');

        var getPanel = function(namespace, requests) {
            var panel = naviTemplate.clone();
            panel.find('div.panel-heading').append(namespace);
            var list = panel.find('ul');
            requests.forEach(function(req) {
                var item = bundleItemTemplate.clone();
                item.attr('data-rpc', req.rpc);
                item.attr('title', req.desc);

                var link = item.find('a');
                //link.attr('href', req.path);
                link.append(req.name);
                item.on('click', function(e) {
                    e.preventDefault();
                    router.navigate(currentVersion + '/' + req.path);
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
            var url = version + '/' + (bundle || '');
            console.log(url);
            jQuery('#bundlecontent').load( '/apidoc/' + url, function() {
                fixCodeHighlights();
            });
        }
        // -------------- ROUTING ----------------
        router.on('#:version/:ns/:bundle/event/:name', function (params) {
            APIDOC.showBundleDoc(params.version, params.ns + '/' + params.bundle + '/event/' + params.name);
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

module.exports = eventNavigation;
