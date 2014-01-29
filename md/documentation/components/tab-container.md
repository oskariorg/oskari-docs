# TabPanel, TabContainer & TabDropdownContainer

## Description

A TabPanel is a wrapper for a title, a header and content (html) and can call a handler when the tab is selected or unselected. A TabContainer renders TabPanels as selectable tabs whereas a TabDropdownContainer represents the TabPanel collection as a dropdown list. A callback for panel changes can be registered for both.

![Tabs and TabContainer in action](images/documentation/components/tabcontainer.png) 

## Usage

Simple TabContainer

```javascript
var aPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel'),
    anotherPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel'),
    element = jQuery('div.tabs'),
    container = null;

aPanel.setTitle('A TabPanel');
aPanel.setContent('<p>some Html</p>');
anotherPanel.setTitle('Another TabPanel');
anotherPanel.setContent('<p>some more Html</p>');

if (useDropDown) {
    container = Oskari.clazz.create('Oskari.userinterface.component.TabDropdownContainer', 'A TabDropdownContainer');
} else {
    container = Oskari.clazz.create('Oskari.userinterface.component.TabContainer', 'A TabContainer');
}

container.addPanel(aPanel);
container.addPanel(anotherPanel);
container.insertTo(element);
```