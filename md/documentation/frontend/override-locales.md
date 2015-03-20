# Overriding Oskari.org bundle locales

This documents helps to create bundle which overrides default Oskari.org locales.

# How to create locale override?

## Call Oskari.registerLocalization 

Create new bundle or use old bundle defination. In bundle start call `Oskari.registerLocalization(params, override)`
function to override the locales.

```javascript
Oskari.registerLocalization(
{
    'key': 'MapModule', 
    'value': { 
        "plugin": { 
            "LogoPlugin" : { 
                "dataSources": "Copyright",
                "layersHeader": "&copy; ELF and listed service providers"
            }
        } 
    }, 
    'lang': Oskari.getLang()
}, true);
```

`First parameter` is a Object that tell bundle locale object what you want override. In Object must be a following keys and their values: key, value and lang. 
`Second parameter` is a Boolean that tells at you want override locales (value is true).

## Change application startup sequence

This bundle must be the first to launch a your application startup sequence because this bundle maybe overrides also application UI texts.

# Example bundle

You can use [this bundle](https://github.com/nls-oskari/oskari/tree/develop/bundles/elf/elf-lang-overrides) as a example.

