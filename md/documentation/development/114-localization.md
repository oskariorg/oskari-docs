# Localization

Localization files are referenced in bundle definitions (`bundle.js` - locales array). Each languages localization is in its own file with structure like this:

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
                "content" : "{name}'s layer was created on {created, date}"
            },
            "step2" : {
                "tab" : "Step 2",
                "title" : "Step 2 title",
                "content" : "Remove {count, plural, one {# map layer} other {# map layers}}"
            },
            "step3" : {
                "tab" : "Step 3",
                "title" : "Step 3 title",
                "content" : "No interpolation here"
            }
        }
    }
});
```

The message strings are in [ICU message syntax](https://formatjs.io/guides/message-syntax/). Value names to be included into the string are in curly braces. Type (number, date or time) of the value can be given after the comma (default is string). The number/date/time will be formatted according to the locale rules (see steps.step1.content above). If the language has different forms for singular/plural, all forms must be defined (see steps.step2.content above). Note: some languages have [multiple plural forms](https://formatjs.io/guides/message-syntax/#plural-format). It also possible to define [different messages depending on value](https://formatjs.io/guides/message-syntax/#select-format).

The language that will be returned is the one set with `Oskari.setLang` method (usually during before application start):

```javascript
Oskari.setLang('en');
```

## Formatting

To get a localized string in the current language:

```javascript
Oskari.getMsg('<MyBundlesLocalizationKey>', '<path.to.message>', {key1: value1, key2: value2});
```
Where keys are the ones used inside curly braces in the ICU format. From the example above:

```javascript
Oskari.getMsg('<MyBundlesLocalizationKey>', 'steps.step1.content', {name: 'Oscar', created: new Date()});
Oskari.getMsg('<MyBundlesLocalizationKey>', 'steps.step2.content', {count: 4});
Oskari.getMsg('<MyBundlesLocalizationKey>', 'steps.step3.content');
```

To avoid typing the bundles's localization key in every localization call, you can bind the first argument and create an instance variable for it:

```javascript
Oskari.clazz.define(
    'Oskari.my.bundle.clazz',
    function () {
        this.loc = Oskari.getMsg.bind(null, '<MyBundlesLocalizationKey>');
    }, {
        someMethod: function() {
            this.loc('steps.step1.content', {name: 'Oscar', created: new Date()});
        }
    },
    ...
```


## Deprecated old way

In some older bundles the whole localization data tree is retrieved on runtime with a call:

```javascript
var localization = Oskari.getLocalization('<MyBundlesLocalizationKey>');
this.showMessage(localization.steps.step1.tab);
```

This way does not support interpolation, pluralization or number/time formatting and therefore should not be used in new bundles.