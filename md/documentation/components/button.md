# Button

## Description

The button component is defined in `divmanazer` bundle and provides a generic button ui element.

## How to use

Creates a button with label "Alert" and binds a handler to it that shows an alert when clicked.

```javascript
var alertBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

// make visually "primary" button (blue)
alertBtn.addClass('primary');
alertBtn.setTitle('Alert');
alertBtn.setHandler(function() {
    alert('Alert');
});
```

Inserts the button to given element.

```javascript
var myUI = jQuery('div.mybundle.buttons');

alertBtn.insertTo(myUI);
```

Remove the button.

```javascript
alertBtn.destroy();
```