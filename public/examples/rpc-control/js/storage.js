(function(global, factory) {
   if (typeof define === 'function' && define.amd) define(factory);
   else if (typeof module === 'object')  module.exports = factory;
   else {
      global.Storage = factory();
   }
}(this, function() {
	var Storage = {};
    var store = localStorage || {};
    var db =  {};
    // TODO: clear for now
    //store.markers = '{}';
    if(store.markers) {
        try {
            db = JSON.parse(store.markers);
        } catch (e) {
            O.log("Error parsing markers", e);
        }
    }
    else {
        store.markers = db;
    }

    Storage.save = function(marker) {
        db[marker.id] = marker;
        store.markers = JSON.stringify(db);
	};

    Storage.getMarkers = function(type) {
        var markers = [];
        _.each(db, function(value, key) {
            if(!type || value.type === type) {
                markers.push(value);
            }
        });
        return markers;
    };
    Storage.getMarkerValuesById = function(markerId) {
        var markers = _.filter(db, 'id', markerId);
        if(markers.length) {
            return markers[0];
        }
        // not found
        return null;
    }

    Storage.getMarkerDef = function(marker) {
        var coords = marker.coordinates.split(',');

        var def = {
            id : marker.id,
            x: coords[0].trim(),
            y: coords[1].trim(),
            size: 2,
            color : O.getColor(marker.type)
        };
        return def;
    }
	return Storage;
}));
