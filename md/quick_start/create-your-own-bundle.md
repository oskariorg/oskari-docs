# Creating your own bundle

Decide `<bundle-identifier>` which is unique and describes the functionality the bundle offers e.g. 'search' (already implemented so prefix it with something like mysearch).

Create a folder with the name of your `<bundle-identifier>` under `/packages/framework/bundle/` and `/bundles/framework/bundle/`. If you require styling/images create one under `/resources/framework/bundle/` also. The `/framework/` folder isn't enforced and you can replace it with something fitting your bundle compilation.

Create a `bundle.js` file under `/packages/framework/bundle/<bundle-identifier>/`. You can use [this sample](/quick-start/sample-bundle-definition) as a template:

* Change all the `<bundle-identifier>`s
* Change the bundle name (MyBundle) to something more describing.
* Change the bundle instance name (MyBundleInstance). Usually its the bundle name postfixed with "Instance".
* List all the implementation files and css files under `scripts`. Note that CSS files need to have `"type" : "text/css"`
* List all the localization files under `locales` or you can remove the locales property if none.

Create a `instance.js` file under `/bundles/framework/bundle/<bundle-identifier>/`. `instance.js` is a file you referenced in `bundle.js` scripts. You can use this sample as a template:
Change all the `<bundle-identifier>`s
Change the bundle instance name (MyBundleInstance). Use the same one you used before.

Add your bundle to the applications startup sequence like you did in previous steps (change the `<bundle-identifier>`):

```javascript
{ 
    "title" : "MyBundle",
    "en" : "MyBundle EN",
    "fi" : "MyBundle FI",
    "sv" : "MyBundle SV",
    "bundleinstancename" : "<bundle-identifier>",
    "bundlename" : "<bundle-identifier>",
    "instanceProps" : {},
    "metadata" : { 
        "Import-Bundle" : { 
            "<bundle-identifier>" : {
                "bundlePath" : "../../../packages/framework/bundle/"
            }
        },
        "Require-Bundle-Instance" : []
    }
}
```

Start adding your code in `instance.js`. If you have lots of code it is encouraged to add multiple `.js` files beside the `instance.js` (under the bundles implementation folder structure). These files can define other Oskari classes that the `instance.js` creates and operates. You'll need to add references to these additional files in `bundle.js` scripts array.
Read more details in Oskari Bundle.