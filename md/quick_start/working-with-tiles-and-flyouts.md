# Working with Tiles and Flyouts

Oskari has an user interface bundle called `divmanazer` that offers other bundles to have an uniform UI presentation with `Tile` which you can think of as an menu item and a `Flyout` which can be thought as a windowed functionality for showing more information or options than would otherwise take too much screenspace.

Let's try it out:

* Open `/applications/sample/mythird/index.html` in your browser and you should see:

![My third bundle](/images/quick-start/mythird.png)

If you compare the `mythird/index.html` to `myfirst/index.html` you'll notice that it has some additional placeholder elements that divmanazer requires.

Click the "Hello World" Tile on the left side menu to open the Flyout.
This bundle has localized texts so you can change the text shown on the tile/flyout:
Open `/bundles/sample/bundle/mythirdbundle/locale/en.js` in an editor.
Change the value of `flyouttitle` to something else:

```javascript
Oskari.registerLocalization({
    "lang" : "en",
    "key" : "MyThirdBundle",
    "value" : {
        "title" : "Hello World",
        "flyouttitle" : "Good news everybody!",
        "desc" : "",
        "flyout" : {
            "sayHello" : "Hello World!"
        }
    }
});
```

Reload the `index.html` on your browser and notice that the flyouts title has changed.
To add new funtionality to the application we add another bundle to it:
Open `/applications/sample/mythird/appsetup.json` file to an editor
Find the a bundle block for `mythirdbundle` and append the following `toolbar` bundle after it to load it after `mythirdbundle` or before to load it before it (remember to separate the blocks with a comma):

```javascript
{ 
    "title" : "Toolbar",
    "en" : "Toolbar",
    "fi" : "Toolbar",
    "sv" : "Toolbar",
    "bundleinstancename" : "toolbar",
    "bundlename" : "toolbar",
    "instanceProps" : {},
    "metadata" : { 
        "Import-Bundle" : { 
            "toolbar" : {
                "bundlePath" : "../../../packages/framework/bundle/"
            } 
        },
        "Require-Bundle-Instance" : []
    }
}
```

Reload `index.html` on your browser and you have a generic toolbar UI component that you can use to add new functionalities that don't require a Tile/Flyout:

![My third bundle with a toolbar](/images/quick-start/mythird_with_toolbar.png)

You can add different bundles having a Tile/Flyout to the startupsequence and they will appear in that order on the left side menu. Note that you need to add them after `divmanazer` because that is the bundle that adds the Tile and Flyout functionalities. Another example is a bundle that shows which layers are on the map - added with:

```javascript
{ 
    "title" : "Layer Selection",
    "en" : "Layer Selection",
    "fi" : "Layer Selection",
    "sv" : "Layer Selection",
    "bundleinstancename" : "layerselection2",
    "bundlename" : "layerselection2",
    "instanceProps" : {},
    "metadata" : { 
        "Import-Bundle" : { 
            "layerselection2" : {
                "bundlePath" : "../../../packages/framework/bundle/"
            }
        },
        "Require-Bundle-Instance" : []
    }
}
```

## Next steps

[Requesting Toolbar for a new button](/quick-start/using-toolbar)

[Create your own bundle](/quick-start/create-your-own-bundle)