/**
 * Oskari api documentation helper
 * Registers in global 'APIDOC' variable
 */

var Navigo = require('navigo');
var router = new Navigo('/', { hash: true });

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

        jQuery('#desc-filter').change(function() {
            jQuery('.navi-section p').toggle();
        });

        var json = {};

        APIDOC.versionChanged = function(version, keepPath) {
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
            var panel = getPanel({title: 'Events', descFilterLabel: 'Description'}, json);
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
        var eventItemTemplate = jQuery('<li class="eventnavi"><a href="javascript:void(0);"></a><p></p></li>');

        var getPanel = function(namespace, events) {
            var panel = naviTemplate.clone();
            panel.find('div.panel-heading').append(namespace.title);
            panel.find('div.panel-heading label').append(' ' + namespace.descFilterLabel);
            panel.find('#desc-filter').change(function() {
                jQuery('.navi-section p').toggle();
            })
            var list = panel.find('ul');
            var sorted = {};
            for (var i = 0; i < events.length; i++) {
                if (!sorted[events[i].ns]) {
                    sorted[events[i].ns] = [];
                }
                sorted[events[i].ns].push(events[i]);
            }

            for (var key in sorted) {
                var section = sectionTemplate.clone();
                var entries = sorted[key];
                section.find('h4').text(key);
                entries.forEach(function(event) {
                    var item = eventItemTemplate.clone();
                    var link = item.find('a');
                    item.attr('data-rpc', event.rpc);
                    item.attr('title', event.desc);
                    link.append(event.name);
                    item.on('click', function(e) {
                        e.preventDefault();
                        router.navigate(currentVersion + '/' + event.path);
                    });
                    item.find('p').text(event.desc);
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
            //console.log(url);
            jQuery('#bundlecontent').load( '/apidoc/' + url, function() {
                fixCodeHighlights();
            });
        }
        // -------------- ROUTING ----------------
        router
            .on('/:version/:ns/:bundle/event/:name', function (value) {
                var params = value.data;
                if(params.version !== currentVersion) {
                    selector.val(params.version);
                    APIDOC.versionChanged(params.version, true);
                }
                APIDOC.showBundleDoc(params.version, params.ns + '/' + params.bundle + '/event/' + params.name);
            })
            .on('/:version', function (params) {
                var requestedVersion = params.data.version;
                if(requestedVersion !== currentVersion) {
                    selector.val(requestedVersion);
                    selector.trigger('change');
                }
                APIDOC.versionChanged(requestedVersion);
            })
            .resolve();

/*
        router.on(function () {
            // no route match
        });
*/

        return APIDOC;
    }

module.exports = eventNavigation;
