# Popup

##Description

The popup component is defined in `divmanazer` bundle and provides basic popup functionality. It can be used to show messages that will be shown for given time before removing and messages that user needs to react to by clicking a button. It can also be used in a modal mode (uses the [Overlay](/documentation/components/overlay) component internally) and it can be used to show for example a form for user input. The popup can be associated with a given element so it will point at the element or as generic location on the middle of the screen.

# TODO

* Intelligent placement when associated to element so dialog don't go off-screen

# How to use

Shows popup at the middle of the screen and closes automatically after 3 seconds. The fadeout method can be given the time as parameter but defaults to 3000 milliseconds.

```javascript
var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

dialog.show('Title', 'Message');
dialog.fadeout();
```

Shows popup at the middle of the screen and closes when the user clicks the ok button on the popup. addClass is used to make the button visually "primary" (== blue). `createCloseButton` is a convenience method that just creates and returns a `Oskari.userinterface.component.Button` which is binded to close the dialog on click.

```javascript
var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
    btn = dialog.createCloseButton('OK');

btn.addClass('primary');
dialog.show('Note', 'Click OK to close', [btn]);
```

Shows popup at the middle of the screen and closes when the user clicks the ok button on the popup. Here we create a custom `Oskari.userinterface.component.Button` and asign a handler function for it which closes the dialog and shows an alert. We also make the dialog modal by calling its `makeModal` method.

```javascript
var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
    btn = dialog.createCloseButton('OK'),
    alertBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

btn.addClass('primary');

alertBtn.setTitle('Alert');
alertBtn.setHandler(function() {
    dialog.close();
    alert('Alert');
});

dialog.show('Note', 'Click OK to close and alert for an alert', [alertBtn, btn]);
dialog.makeModal();
```

Shows popup above (we give it alignment "top") a DOM element with id "myComponent" and closes automatically after 3 seconds.

```javascript
var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
    myComponent = jQuery('#myComponent');

dialog.show('Note', 'Something happened at this component');
dialog.moveTo(myComponent, 'top');
dialog.fadeout();
```

Catching event when the popup is closed:

```javascript
var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
dialog.show('Note', 'I will alert when closed');
dialog.onClose(function() {
   alert('Dialog closed!');
});
dialog.fadeout();
```
