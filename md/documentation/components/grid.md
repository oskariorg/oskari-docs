# Grid & GridModel

## Description

A Grid can render a given GridModel as a table. Its features include column aliases, calling external handlers for nested tables, field-specific value renderers, sorting and selections. A GridModel is a simple data container that keeps track of key fields and provides convenience methods for addition of structured data.

![Sample grid](images/documentation/components/grid.png)

Usage

```javascript
var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel'),
    grid = Oskari.clazz.create('Oskari.userinterface.component.Grid'),
    element = jQuery('div.myGrid'),
    idRenderer, idLink;

_.each(dataArray, function(elem) {
    gridModel.addData(elem);
});

gridModel.setIdField('id');
grid.setDataModel(gridModel);
grid.setVisibleFields(['id', 'afield', 'anotherfield']);

grid.setColumnValueRenderer('id', function(id, data) {
    idLink = jQuery('<span class="idlink">' + id + '</span>');
    idLink.bind('click', function() {
        showDetails(id);
        return false;
    });
    return idLink;
});

grid.setColumnUIName('afield', localizations.afield);
grid.setColumnUIName('anotherfield', localizations.anotherfield);
grid.renderTo(element);
```