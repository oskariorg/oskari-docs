# Mode

**Note! This is not used currently in Oskari and is probably outdated:**

Mode in this context describes an alternate user interface layout and setup that is entered and exited. The default layout is resumed upon exit. Mode is implemented as an extension bundle.

## Mode View and Mode Toolbar implementation requirements

* From `divmanazer` bundle:
    * `Oskari.userinterface.extension.DefaultView`
    * `Oskari.userinterface.extension.DefaultTile`
    * `Oskari.userinterface.extension.DefaultExtension`

* bundle definition `bundle.js` description file which declares any JavasSript files, locales to be included for the bundle
* extension bundle instance inherited from `Oskari.userinterface.extension.DefaultExtension`
* View inherited from `Oskari.userinterface.extension.DefaultView`
    * View transition implementations for `show` and `hide` which manipulate CSS and/or DOM structure to show or hide view content
    * View contents and functionality implemented with Oskari, jQuery or library of your choice

## Changing View Mode

### Configuration (`config.json`)

DefaultExtension requires these configurations to be present. If bundle does not add a flyout set `flyoutClazz` to null.

#### **Note:**

`tileClazz` assumes locale with key `tile` - it will **NOT** create tile without localizations (been there done that...). The same applies to `viewClazz` (`view`) and `flyoutClazz` (`flyout`) as well if declared.

```javascript
"<bundle-identifier>": {
    "conf": {
        "name": "<bundle-name>",
        "sandbox": "sandbox",
        "tileClazz": "Oskari.userinterface.extension.DefaultTile",
        "flyoutClazz": null,
        "viewClazz": "Oskari.<mynamespace>.bundle.<bundle-identifier>.NewModeView"
    }
}
```

### Container structure

Along with custom view modes we have restructured initial HTML structure a bit. Now, there is a container for menu toolbar and `oskariui` is divided into three containers: `oskariui-left`, `oskariui-center`, and `oskariui-right`.

```html
<div id="contentMap" class="oskariui container-fluid">
    <div id="menutoolbar" class="container-fluid"></div>
    <div class="row-fluid" style="height: 100%; background-color:white;">
        <div class="oskariui-left"></div>
        <div class="span12 oskariui-center" style="height: 100%; margin: 0;">
            <div id="mapdiv"><div class="mapplugins left"></div></div>
        </div>
        <div class="oskari-closed oskariui-right">
            <div id="mapdivB"></div>
        </div>
    </div>
</div>
```

### Changing the view mode

To change the view mode, one needs to

* create a new view as a plugin
    * `startPlugin` function: add a request handler to listen to mode changes
    * `stopPlugin` function: remove the handler and additional objects
    * `showMode` function: change mode according to parameter (`isShown`) using CSS classes

The following example shows the basic structure of a new view mode. In addition, you will need to create requests and request handlers for changing your new view mode.

```javascript
Oskari.clazz.define('Oskari.<mynamespace>.bundle.<bundle-identifier>.NewModeView',
/**
 * @static constructor function
 */
function() {
}, {
    /**
     * called by host to start view operations
     *
     * @method startPlugin
     */
    startPlugin: function() {
        var sandbox = this.instance.getSandbox();

        this.toolbar = Oskari.clazz.create('Oskari.<mynamespace>.bundle.<bundle-identifier>.MyToolbar', {
            title: this.getTitle()
        }, this.instance);

        // The extension bundle instance routes request 
        // to enter / exit mode by listening to and responding to userinterface.ExtensionUpdatedEvent 
        this.requestHandler = Oskari.clazz.create('Oskari.<mynamespace>.bundle.<bundle-identifier>.request.MyRequestHandler', this);
        sandbox.addRequestHandler('<bundle-identifier>.MyRequest', this.requestHandler);

    },
    /**
     * called by host to stop view operations
     *
     * @method stopPlugin
     */
    stopPlugin: function() {
        this.toolbar.destroy();
        this.instance.getSandbox().removeRequestHandler('<bundle-identifier>.MyRequest', this.requestHandler);
    },
    /**
     * called by host to change mode
     *
     * @method showMode
     */
    showMode: function(isShown, madeUpdateExtensionRequest) {
        var sandbox = this.instance.getSandbox(),
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
            map = mapModule.getMap(),
            elCenter = this.getCenterColumn(),
            elLeft = this.getLeftColumn();

        this.toolbar.show(isShown);

        if (isShown) {
            /** ENTER The Mode */

            /** show our mode view */
            elCenter.
                removeClass('span12').
                addClass('span5');

            elLeft.
                removeClass('oskari-closed').
                addClass('span7');
        } else {
            /** EXIT The Mode */
            
            /** remove our mode view */
            elCenter.
                removeClass('span5').
                addClass('span12');

            elLeft.
                addClass('oskari-closed').
                removeClass('span7');

            if (!madeUpdateExtensionRequest) {
                // reset tile state if not triggered by tile click
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
            }
        }

        /** notify openlayers of map size change */
        map.updateSize();
    },
    /**
     * Get left column container
     */
    getLeftColumn : function() {
        return jQuery('.oskariui-left');
    },
    /**
     * Get center column container
     */
    getCenterColumn : function() {
        return jQuery('.oskariui-center');
    },
    /**
     * Get right column container
     */
    getRightColumn : function() {
        return jQuery('.oskariui-right');
    }
}, {
    // the protocol / interface of this object is view
    "protocol": ["Oskari.userinterface.View"],
    // extends DefaulView
    "extend": ["Oskari.userinterface.extension.DefaultView"]
});
```