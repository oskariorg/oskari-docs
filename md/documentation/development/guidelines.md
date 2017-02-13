# Guidelines

## Generic

* Avoid global variables
* Avoid id and name attributes on DOM elements. It's very easy to use conflicting names/ids for elements between different functionalities and in the case of conflict the behavior in browser is propably not what you expect. If you have an input with name="name" in two elements the browser will remove the attribute from the other. This will result in errors even if you use very specific selector to read/assign the value for that field. Use data-attributes or classes instead to avoid this.

**WRONG:**

```javascript
jQuery('<input type="text" name="name" />');
jQuery('<input type="text" id="searchfield" />');
jQuery('#searchfield').val();
```

**RIGHT:**

```javascript
jQuery('<input type="text" data-name="name" />');
jQuery('<div class="search-mainpanel"><input type="text" class="searchfield" /></div>');
jQuery('.search-mainpanel .searchfield').val();
```

* Bundles are independent components:
    * a bundle should not hard code references to other bundles or modules
    * a bundle should not poke other bundles' internal structures
* Bundles should not have hard coded references to any backend etc outside source
    * any such references should be given to the bundle via [configuration](/documentation/core-concepts/oskari-bundle-configuration)
* Use jQuery with `jQuery()`, not `$()`
* Attach event handling functions to DOM with JavaScript assignments rather than HTML markup:

**WRONG:**

```javascript
$('<button onclick="myglobal.myinstance.someMethod()"></button>');
```

**RIGHT:**

```javascript
var btn = jQuery('button.myButton')
btn.bind('click', function() {
    myinstance.someMethod();
});
```

## User interface

* Use template variables for defining DOM elements in class and build UI for the bundle by cloning them
* Retain handles (a variable or class member field) to UI elements and use them when modifying UI
* Use CSS selectors and traversal to access DOM snippet substructure (using ExtJS, DoJO, YUI, jQuery selectors for instance)
* Prefix your custom CSS definitions with your `<bundle-identifier>`
* Avoid post processing of library generated DOM (f.ex ExtJS dom) with jQuery

## Documentation

You should comment your Oskari classes in a format recognized by the API generator tool [YUIDoc](http://yui.github.io/yuidoc/)

```javascript
/*
 * Returns a 'foobared' string.
 *
 * @method fooBar
 * @param {String} arg
 * @return {String} returns the argument prefixed with 'foo' and postfixed with 'bar'
 */
function fooBar(arg) {
    return 'foo ' + arg + ' bar';
}
```