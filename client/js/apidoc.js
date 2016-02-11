/**
 * Marker "database" - saves markers to localStorage if available.
 * Registers in global 'Storage' variable
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
    var APIDOC = {};
    var selector = jQuery('#version-selector');
    selector.on('change', function() {
        APIDOC.versionChanged(jQuery(this).val());
    });

    APIDOC.versionChanged = function(version) {
        console.log('version changed:', version);
    };
    jQuery('li.bundlenavi').on('click', function() {
        var bundle = jQuery(this).data('path');
        APIDOC.showBundleDoc(selector.val(), bundle);
    })
    APIDOC.showBundleDoc = function(version, bundle) {
        console.log('Show document for', version, bundle);
        var url = '/apidoc/' + version + '/' + bundle;
        jQuery('#bundlecontent').load( url );
    }

    return APIDOC;
}));