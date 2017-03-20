# Tips and Guidelines

### Generic

* There's a difference for developing generic Oskari functionality and application specific functionality.
* Oskari repositories should not contain application specific functionalities (community-repository can contain application specific code).
* In general smaller pull requests will be reviewed and merged faster as they usually are easier to review and test than large ones.
* In most cases you want to use develop-branch as baseline. Only use master if you need something urgently fixed.

### Code
- Use english and descriptive names for variables/methods etc
- Format your code and use spaces instead of tabs
- Don't make long or overly complex methods - keep it simple
- Try to create generic functionalities that can be used by others. The application specific UI can be separated in most cases from the generic functionality.
- Try to keep functions self-contained with clear input and output and no side-effects when possible.
- Use existing features like PropertyUtil for oskari-server or the localization support from Oskari in the frontend instead of reinventing the wheel.
- Try to use existing libraries when creating new features. For each new framework added to the client side code the more end-users need to download to get the application.
- Remember documentation: API docs, MigrationGuide, ReleaseNotes, Changelog

### Commits
- Configure GIT line endings setting: https://help.github.com/articles/dealing-with-line-endings/
- Never commit on master - always work with the latest develop version
- Keep commits small and use descriptive comments
- This means you don't dump your entire feature from svn into single massive git commit.

### Pull requests
- Keep pull requests small/having a single feature
- See https://github.com/blog/1943-how-to-write-the-perfect-pull-request
- Be very careful when making changes to existing sources (maven modules or frontend bundles) since it's easy to break an unexpected part of an app this way.
- Create separate pull request for changes to existing source with documentation what the change enables you to do.
- Entirely new features/functionalities should be created as new maven modules on oskari-server and bundles on frontend. Oskari-server uses layered naming for modules:
    - service-[functionality] as a library for the generic functionality
    - service-[functionality]-[plugin name] as a plugin part to enhance service-[functionality] with non-generic functionality
    - control-[functionality] as a wrapper for action routes/http-layer where you parse params and format a JSON response for the result of the operation.

## Be very careful when changing the API

Changing the API means that others will need to change their code as well. This is a especially problematic on the RPC API.
For frontend this means request/event/conf/state/services
- Try to think of your new addition as a library especially the API. Keep it clean, simple and as self-contained as possible.
- Oskari requests should have mandatory parameters as the first parameters and any optional parameters should be gathered in to an options object with describing names. Any data in conf, state, requests or events should be serializable to JSON -> Don't send functions etc. If you need to send functions, use services instead.
- If you have developed a new feature or changed existing one please document your work: [API docs](https://github.com/oskariorg/oskari-frontend/tree/master/api) / [Generated API](/api).

For server:
- action_route parameters and response
- properties
- any external dependencies

**Any changes to API need to be documented always!**

## Frontend

### Requirements for new bundles to the core
* API documentation (event, requests, service, config, state)
* implementation for the bundle API
* usage instructions documentation of any external dependencies (server routes for example) for the implementation of the bundle
* implementation needs a responsible party. If there's a bug or something is broken the responsible party is the first contact point. If there's no action taken and no-one else wants to take responsibility the bundle implementation will be migrated to community-repository.

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
* Use CSS selectors and traversal to access DOM snippet substructure under the current functionality. Don't alter the UI created by another functionality.
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

### Server

- JUnit tests for any action routes that test parameter/user combinations
- documentation of external dependencies and possible configurations/properties
- TODO: more requirements propably