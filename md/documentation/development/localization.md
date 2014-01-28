# Localization

Localization files are referenced in bundle definitions (`bundle.js` - locales array). Each languages localization is in its own file with syntax like this:

```javascript
Oskari.registerLocalization({
    // localization language
    "lang" : "fi",
    // Bundle name or some other identifier which is used when retrieving this localization data
    "key" : "<MyBundlesLocalizationKey>",
    "value" : {
        // Actual localization data in custom structure, bundle using this data is responsible for interpreting the structure
        "title" : "Bundle title",
        "steps" : {
            "step1" : {
                "tab" : "Step 1",
                "title" : "Step 1 title",
                "content" : "Content 1"
            },
            "step2" : {
                "tab" : "Step 2",
                "title" : "Step 2 title",
                "content" : "Content 2"
            },
            "step3" : {
                "tab" : "Step 3",
                "title" : "Step 3 title",
                "content" : "Content 3"
            }
        }
    }
});
```

The value property of the localization data can then be retrieved on runtime with a call:

```javascript
Oskari.getLocalization('<MyBundlesLocalizationKey>');
```

The language that will be returned is the one set with `Oskari.setLang` method (usually during before application start):

```javascript
Oskari.setLang('en');
```