# Accordion & AccordionPanel

## Description

An Accordion is a passive vertical container for zero or more AccordionPanels. It simply acts as a placeholder for the AccordionPanels and does not interfere with their states apart from being able to toggle the visibility of all the panels.

An AccordionPanel consists of a header and a content area. It can be visible or (entirely) hidden and open or closed. When the panel is visible, the header is always displayed. When open, the content is rendered underneath it. An icon next to the header shows the current state and acts as an open/close button.

![Accordion in use](/images/documentation/components/accordion.png)

## How to use

Simple accordion

```javascript
var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion'),
    container = jQuery('div.myAccordion'),
    panel = null;

_.each(this.panelData, function(panelData) {
  panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
  panel.setTitle(panelData.title);
  panel.setContent(panelData.content);
  panel.setVisible(panelData.isVisible);

  panelData.isOpen ? panel.open() : panel.close();

  accordion.addPanel(panel);
});

accordion.insertTo(container);
```