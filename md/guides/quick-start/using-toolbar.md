# Requesting another bundle to do something

This example continues the `mythird` sample application by adding new functionality to it. Add another bundle to the startup sequence *__after__* the toolbar bundle:

```javascript
{
    "bundlename" : "myfourthbundle",
    "metadata" : {
        "Import-Bundle" : {
            "myfourthbundle" : {
                "bundlePath" : "../../../packages/sample/bundle/"
            }
        }
    }
}
```

This bundle sends out a request on startup for `toolbar` bundle asking it to show another button. What happens when you click the button is handled by `myfourthbundle`. You can see what you can do with the toolbar requests by looking at the toolbar bundles documentation.

The modified/ready bundle configuration is in file `/applications/sample/mythird/my4th_appsetupconfig.json`. You can replace the file `appsetupconfig.json` with it and see the end result:

![Custom toolbar](/images/quick-start/custom_toolbar.png)

## Next steps

[Create your own bundle](/guides/quick-start/create-your-own-bundle)