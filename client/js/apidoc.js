
(function () {
    var selector = jQuery('#version-selector');
    /*
    if(!selector.length) {
        return;
    }
    */
    var type = selector.attr('data-type');
    if(type === 'bundles') {
        var bundleNavi = require('./apidoc_bundle');
        bundleNavi(selector);
    } else if(type === 'requests') {
        var requestNavi = require('./apidoc_request');
        requestNavi(selector);
    } else if(type === 'events') {
        var eventNavi = require('./apidoc_event');
        eventNavi(selector);
    }
})();
