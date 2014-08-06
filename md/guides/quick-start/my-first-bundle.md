# Quick Start to Oskari development

* Download sources from [here](/download)
* Extract the files from the downloaded archive
* Open `/applications/sample/myfirst/index.html` in your browser and you should see:

![My first bundle](/images/quick-start/myfirst.png)

This is the map application with only OpenLayers and the core of Oskari downloaded with a custom 'Hello World' bundle added as extension.

To add new funtionality to the application we add another bundle to it:

* Open `/applications/sample/myfirst/appsetupconfig.json` file to an editor
* Find the a bundle block for `myfirstbundle` and append the following `mysecondbundle` after it (remember to separate the blocks with a comma):

```javascript
{ 
    "title" : "My2nd",
    "en" : "My2nd",
    "fi" : "My2nd",
    "sv" : "My2nd",
    "bundleinstancename" : "mysecondbundle",
    "bundlename" : "mysecondbundle",
    "instanceProps" : {},
    "metadata" : { 
        "Import-Bundle" : { 
            "mysecondbundle" : {
                "bundlePath" : "../../../packages/sample/bundle/"
            } 
        },
        "Require-Bundle-Instance" : []
    }
}
```

* Reload `index.html` on your browser and click the map. You should get another message alert whenever you click the map. This is the functionality added by `mysecondbundle`: it listens to an Oskari Event and reacts to it by showing an alert.
* If you open `/applications/sample/mysecond/index.html` in your browser you will have the same functionality without the Hello World alert on startup.

## Next steps

[Working with Tiles and Flyouts](/guides/quick-start/working-with-tiles-and-flyouts)

[Requesting Toolbar for a new button](/guides/quick-start/using-toolbar)

[Create your own bundle](/guides/quick-start/create-your-own-bundle)