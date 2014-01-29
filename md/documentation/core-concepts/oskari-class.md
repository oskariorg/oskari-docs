# Oskari class

Most code in Oskari is defined as classes. Defining a class is a simple call to `Oskari.clazz.define()` method:

```javascript
Oskari.clazz.define('Oskari.mynamespace.MyClass', 
function(pState) {
    this._state = this.states[pState || 'open'];
}, {
    /**
     * @property states
     */
    states : {
        'open' : 1,
        'close' : 2
    },
    getState : function() {
        return this._state;
    }
},
{
    // a list of protocols this class implements
    "protocol" : []
});
```

The define method takes parameters that it uses to produce a class prototype:

```javascript
/**
 * Defines a class implementation in Oskari framework
 *
 * @method define
 * @param {String} name fully qualified class name
 * @param {Function} contructor the method that will be called on create that should initialize any class properties. 
 *        It can also have parameters that can be passed when creating an instance of the class
 * @param {Object} implementation JavaScript object defining the methods and 'static' properties of the class
 * @param {Object} metadata (optional) class metadata which can for example declare which protocols/interfaces the class implements   
 */
```

Once a class has been defined, it can be created by calling `Oskari.clazz.create()` method and it's methods can be called:

```javascript
var openState = Oskari.clazz.create('Oskari.mynamespace.MyClass'),
    closeState = Oskari.clazz.create('Oskari.mynamespace.MyClass', 'close');

alert('MyClass open state is ' + openState.getState());
alert('MyClass close state is ' + closeState.getState());
```

The create method returns an instance of the class which you specify as parameter:

```javascript
/**
 * Creates an instance of Oskari framework class
 *
 * @method create
 * @param {String} name fully qualified class name
 * @param {Object} params (optional 0-n) parameters that are passed to the constructor. All the parameters after the class name will be passed.
 * @return {Object} instantiated class prototype
 */
```

## Protocol

Classes can declare implementing a protocol (none to many) or classes can also be used to define a protocol. A protocol can be thought of as an interface declaration and contract for a set of functions that a class must provide/implement. For example for a class to register to [Oskari sandbox](documentation/core-concepts/oskari-core) it needs to implement the Oskari.mapframework.module.Module protocol which defines that the class must have for example a `getName()` and `onEvent()` methods. This way we can depend that any registered component can handle operations that will be expected from registered components.

```javascript
Oskari.clazz.define('Oskari.mynamespace.MyProtocol', function() {}, {
  "myProtocolMethod": function(arg) {}
});
```

Defining a protocol class is not really used for anything other than explaining what methods an implementation should offer. Oskari class system provides functions to query classes that implement a protocol:

```javascript
var classesImplementingProtocol = Oskari.clazz.protocol("Oskari.mynamespace.MyProtocol");
```

## Category

Oskari Clazz system supports splitting Class implementations in multiple compilation units (files) by a Category concept. This means you can add functions to an existing class to "extend" it. When loading asynchronously a stub class is defined if class definition is not yet loaded.

```javascript
Oskari.clazz.category('Oskari.mynamespace.MyClass', 'my-set-of-methods', {  
  "myOtherMethod" : function() {
    return "one";
  },
  "myAnotherMethod" : function() {
    return "two";
  }
});
```

When the `category()` method call has completed, your class will have the new methods declared in the category call and they can be called as any original method in the class prototype:

```javascript
var openState = Oskari.clazz.create('Oskari.mynamespace.MyClass');
openState.myOtherMethod();
```

The category method takes parameters that it uses to extend a class prototype:

```javascript
/**
 * Appends a class implementation in Oskari framework
 *
 * @method category 
 * @param {String} name fully qualified class name
 * @param {String} categoryName identifier for the set of methods.
 * @param {Object} implementation JavaScript object defining new methods and 'static' properties for the class
 */
```