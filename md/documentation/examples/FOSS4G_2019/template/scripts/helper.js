const HELPER = {
    getFeatures: function () {
      // TODO: take bbox as param and filter features based on that
      return fetch('../poi.json').then(function(response) {
        return response.json();
      });
    },
    getFeatureUI: function () {
        return jQuery('#featurelist');
    },
    getSidebar: function () {
        return jQuery('nav');
    },
    highlightMenu: function (id, previouslySelected) {
        if (id == previouslySelected) {
            return;
        }
        jQuery('li.list-group-item').removeClass('highlight').find('.panel-collapse').collapse('hide');
        const selectedItem = jQuery('#feat-' + id);
        selectedItem.addClass('highlight').find('.panel-collapse').collapse('show');
    },
    createFeaturePanel: function (feature) {
        const { id, name, txt, img, attr } = feature.properties;
        return jQuery(`<li class="list-group-item" id="feat-${id}"><div class="panel panel-default">
         <div class="panel-heading cursor-pointer">
             <h4 class="panel-title collapse-panel" data-toggle="collapse" data-target="#POI-id-${id}">${name}</h4>
         </div>
         <div id="POI-id-${id}" class="panel-collapse collapse poi-description">
             <div class="panel-body">
                 <p>${txt}</p>
                 <span>
                     <img class="img-fluid rounded" src="${img}" />
                     <small>&copy; ${attr}</small>
                 </span>
             </div>
         </div>
       </div></li>`);
    }
};
