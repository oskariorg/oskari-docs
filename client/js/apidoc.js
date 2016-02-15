/**
 * Oskari api documentation helper
 * Registers in global 'APIDOC' variable
 */
(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        global.APIDOC = factory(jQuery);
    }
}(this, function(jQuery) {
    var selector = jQuery('#version-selector');
    if(!selector.length) {
        return;
    }

    var APIDOC = {};
    selector.on('change', function() {
        APIDOC.versionChanged(jQuery(this).val());
    });
    jQuery('li.bundlenavi').on('click', bundleClickHandler);

    var json = null;

    APIDOC.versionChanged = function(version) {
        if(json) {
            APIDOC.renderNavigation(json[version]);
            return;
        }
        jQuery.ajax('/api.json')
          .done(function(response) {
            json = {};
            jQuery.each(response, function(index, item) {
                json[item.version] = item.api;
            });

            APIDOC.renderNavigation(json[version]);
          })
          .fail(function() {
            alert( "error loading version info" );
          })
        //console.log('version changed:', version);
    };
/*
{
   "ui": {
      "divmanazer": {
         "desc": "Sent after Extension view state has changed",
         "event": [
            "userinterface.ExtensionUpdatedEvent.md"
        ]
      }
   }
}
*/
    APIDOC.renderNavigation = function(json) {
        // remove the old navigation
        var navig = jQuery('#bundlenavi');
        navig.find('div.generated').remove();
        // setup new one
        jQuery.each( json, function( namespace, value ) {
            var list = [];
            jQuery.each( value, function( bundle, details ) {
                list.push({
                    name : bundle,
                    desc : details.desc,
                    path : namespace + '/' + bundle
                });
            });
            var panel = getPanel(namespace, list);
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
    var bundleClickHandler = function() {
        var bundle = jQuery(this).data('path');
        APIDOC.showBundleDoc(selector.val(), bundle);
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
}));