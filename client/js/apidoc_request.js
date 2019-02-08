/**
 * Oskari api documentation helper
 * Registers in global 'APIDOC' variable
 */
var Navigo = require('navigo');
var router = new Navigo('/api/requests', true);

function requestNavigation(selector) {

        var APIDOC = {};

        var currentVersion = selector.val();
        selector.on('change', function() {
            currentVersion = jQuery(this).val();
            router.navigate(currentVersion);
        });


        var filterNavigation = function(onlyRPC) {
            if(onlyRPC) {
                jQuery('li.requestnavi:not([data-rpc="true"])').hide();
            }
            else {
                jQuery('li.requestnavi').show();
            }
        };

        jQuery('#rpc-filter').change(function() {
            filterNavigation(this.checked);
        });

        jQuery('#desc-filter').change(function() {
            jQuery('.navi-section p').toggle();
        });

        var json = {};

        APIDOC.versionChanged = function(version, keepPath) {
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
                APIDOC.renderNavigation(json[response.version], keepPath);
              })
              .fail(function() {
                alert( "error loading version info" );
              })
            //console.log('version changed:', version);
        };

        APIDOC.renderNavigation = function(json, keepPath) {
            // remove the old navigation
            var navig = jQuery('#bundlenavi');
            navig.find('div.generated').remove();
            // setup new one
            var panel = getPanel({title: 'Requests', descFilterLabel: 'Description'}, json);
            navig.append(panel);
            if(!keepPath) {
                // reset to changelog
                APIDOC.showBundleDoc(selector.val());
            }
            filterNavigation(jQuery('#rpc-filter').is(":checked"));
        };

        var naviTemplate = jQuery('<div class="panel panel-default generated">'
            + '<div class="panel-heading"><label class="desc-filter-label"><input type="checkbox" id="desc-filter" checked="checked"/></label></div>'
            + '<div class="panel-body"><ul></ul></div>'
            +'</div>');
        var sectionTemplate = jQuery('<section class="navi-section"><h4></h4><ul></ul></section>');
        var requestItemTemplate = jQuery('<li class="requestnavi"><a href="javascript:void(0);"></a><p></p></li>');

        var getPanel = function(namespace, requests) {
            var panel = naviTemplate.clone();
            panel.find('div.panel-heading').append(namespace.title);
            panel.find('div.panel-heading label').append(' ' + namespace.descFilterLabel);
            panel.find('#desc-filter').change(function() {
                jQuery('.navi-section p').toggle();
            })
            var list = panel.find('ul');
            var sorted = {};
            for (var i = 0; i < requests.length; i++) {
                if (!sorted[requests[i].ns]) {
                    sorted[requests[i].ns] = [];
                }
                sorted[requests[i].ns].push(requests[i]);
            }

            for (var key in sorted) {
                var section = sectionTemplate.clone();
                var entries = sorted[key];
                section.find('h4').text(key);
                entries.forEach(function(req) {
                    var item = requestItemTemplate.clone();
                    var link = item.find('a');
                    item.attr('data-rpc', req.rpc);
                    item.attr('title', req.desc);
                    link.append(req.name);
                    item.on('click', function(e) {
                        e.preventDefault();
                        router.navigate(currentVersion + '/' + req.path);
                    });
                    item.find('p').text(req.desc);
                    section.find('ul').append(item);
                })
                list.append(section);
              }
            return panel;
        };
        var fixCodeHighlights = function() {
            jQuery('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        };

        APIDOC.showBundleDoc = function(version, bundle) {
            var url = version + '/' + (bundle || '');
            jQuery('#bundlecontent').load( '/apidoc/' + url, function() {
                fixCodeHighlights();
            });
        }
        // -------------- ROUTING ----------------
        router.on('#:version/:ns/:bundle/request/:name', function (params) {
            if(params.version !== currentVersion) {
                selector.val(params.version);
                APIDOC.versionChanged(params.version, true);
            }
            APIDOC.showBundleDoc(params.version, params.ns + '/' + params.bundle + '/request/' + params.name);
        });
        router.on('#:version', function (params) {
            if(params.version !== currentVersion) {
                selector.val(params.version);
                selector.trigger('change');
            }
            APIDOC.versionChanged(params.version);
        });
/*
        router.on(function () {
            // no route match
        });
*/
        return APIDOC;
    }

module.exports = requestNavigation;
