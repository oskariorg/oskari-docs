/**
 * Marker "database" - saves markers to localStorage if available.
 * Registers in global 'Storage' variable
 */
(function(global, factory) {
    if (typeof define === 'function' && define.amd) define(factory);
    else if (typeof module === 'object') module.exports = factory;
    else {
        global.Storage = factory();
    }
}(this, function() {
    var Storage = {};
    var store = localStorage || {};
    var db = {};
    // to reset saved markers, do localStorage.markers = '{}'; in console
    if (store.markers) {
        try {
            db = JSON.parse(store.markers);
        } catch (e) {
            Util.log("Error parsing markers", e);
        }
    } else {
        store.markers = db;
    }

    /**
     * Clears saved markers
     */
    Storage.reset = function() {
        db = {};
        store.markers = db;
    };

    /**
     * Stores the form values.
     * @param  {Object} marker form values
     */
    Storage.save = function(marker) {
        db[marker.id] = marker;
        store.markers = JSON.stringify(db);
    };

    /**
     * Returns marker that has the correct type or all markers if type not specified
     * @param  {String} type 'road', 'env' or undefined
     * @return {Object[]} list of marker form values
     */
    Storage.getMarkers = function(type) {
        var markers = [];
        $.each(db, function(key, value) {
            if (!type || value.type === type) {
                markers.push(value);
            }
        });
        return markers;
    };
    /**
     * Finds marker from storage by id
     * @param  {String} markerId
     * @return {Object} form values for the marker
     */
    Storage.getMarkerValuesById = function(markerId) {
            var markers = _.filter(db, 'id', markerId);
            if (markers.length) {
                return markers[0];
            }
            // not found
            return null;
        }
        /**
         * Parses coordinates from storage and returns
         * a template to send to map
         * @param  {Object} marker form values
         * @return {Object} template for adding a marker to map
         */
    Storage.getMarkerDef = function(marker) {
        var coords = marker.coordinates.split(',');

        var def = {
            id: marker.id,
            x: coords[0].trim(),
            y: coords[1].trim(),
            size: 4,
            color: Util.getColor(marker.type)
        };
        return def;
    }
    return Storage;
}));