# Oskari bundle with modern JavaScript

Starting with 1.48.0 Oskari supports writing bundles in JavasScript ES6. This update allows many improvements to the way Oskari bundles are composed.

This guide will help you get started.

## Bundle architecture

<img src="/images/architecture/bundle.png" alt="Bundle structure" width="590px" height="590px"/>

##### Service

It's the Service's responsibility keep the state related to the bundle business logic consistent and updated. Possibly saving this state to the backend via action routes when needed. The Service exposes public methods to mutate the state and allows other components within the bundle to register for notifications about state changes.

#### View

It's the View's responsibility to update the Flyout/Tile DOM accordingly when it receives notification from the Service that state has changed. It's also the View's responsibility to mutate the Service as a reaction to user input. Flyouts, Tiles, Popups etc. are parts of the View.

#### Map Plugin

It's the Map Plugin's responsibility to update the map related presentation when it receives notification from the Service that state has changed. If the bundle does not have map related functionality, it doesn't need to implement a Map Plugin. Map layers, map controls, map interactions are implemented by Map Plugins.

### Data flow

User input -> View/Plugin mutates Service by calling a public method on the Service -> Service updates internal state (possibly saving to backend) -> Service notifies all interested components by triggering an event -> Listening components (Views & Map Plugins) update their presentation.

### Communication between bundles

If a bundle wants to allow other bundles to interact with itself, the bundle can [register requests](/documentation/core-concepts/oskari-request) and [publish events](/documentation/core-concepts/oskari-event) to Oskari sandbox.

A Service can also be exposed to other bundles with a call to `sandbox.registerService(service)`. Afterwards other bundles can obtain a reference to the service by calling `sandbox.getService(serviceName)`.

## Composing JS files into bundle

All files within bundles should be referenced with [ES6 import-statements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import). Your [bundle definition](/guides/quick-start/sample-bundle-definition) should only have one JS file (instance.js) that is the entrypoint to the functionality of the bundle. This file should then `import` all JS/CSS/SCSS it needs (and those imported files import their own dependecies).

Register your entrypoint ES6 class with `Oskari.clazz.defineES` in `instance.js`.
See a simple bundle [example](/jsdoc/latest/modernbundle/module-SimpleBundle.html) with [sources](/jsdoc/latest/modernbundle/bundles_sample_mymodernbundle_instance.js.html).

```javascript
import MyService from './service'
import MyFlyout from './flyout'
import MyPlugin from './plugin'
import './resources/scss/style.scss';

const DefaultExtension = Oskari.clazz.get('Oskari.userinterface.extension.DefaultExtension');

Oskari.clazz.defineES('Oskari.<mynamespace>.<bundle-identifier>.MyBundleInstance',
    class MyBundleInstance extends DefaultExtension {
        constructor(name, flyoutClazz, tileClazz, viewClazz, locale) {
            super(name, flyoutClazz, tileClazz, viewClazz, locale);
        }
        getName() {
            return 'MyBundleInstance';
        }
        startExtension() {
            super.startExtension();
            const service = new MyService();

            this.setFlyout(new MyFlyout(service))

            const plugin = new MyPlugin(service);
            ...
        }
        ...
    },
    {
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);

```

As the above example illustrates, `Oskari.clazz.get(...)` can be used to obtain a class reference (constructor) for an already registered Oskari class. This class reference could be used directly to create an instance with `new DefaultExtension(...)` or it can be used as above with the `extends` keyword to define a subclass inheriting from the class.

CSS/SCSS files should be imported directly in the JS as above. Keep CSS/SCSS modular by dividing the styles into multiple files and importing where needed. Images/fonts referenced with `url(...)` in CSS/SCSS files will become part of the build automatically. Use paths relative to your CSS/SCSS file.

## External dependencies (libraries)

If you bundle depends on external library code, the libary must be referenced to be included into the build.

If the library [is a part of oskari-frontend repository](/documentation/libraries) (lodash, d3, etc.), or generally if the library is distributed a separate JS file [you should reference](/documentation/development/adding-libraries) it in your `bundle.js`.

If you want to use libraries distributes as NPM modules, you can `npm install --save` them and `import` as usual. But check first that the library isn't in use under oskari-frontend libraries/ to avoid duplication of library code.