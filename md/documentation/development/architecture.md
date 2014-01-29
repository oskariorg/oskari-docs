# Oskari architecture

## Oskari JavaScript framework

![Oskari front-end architecture](images/documentation/oskari_architecture_frontend.png)

1. Oskari-loader is started up when the browser signals the DOM is ready.
2. The loader is passed the Oskari application startup sequence and configuration as JSON.
3. The `startApplication()` method is called on loader and the processing of the startup sequence is started.
4. Bundles referenced in the startup sequence are loaded and started.
5. One bundle must be a "creator bundle" which initiates Oskari core.
6. After the core init - services and request handlers can be registered to the core by any bundle.
7. Reference to the map module can be fetched from the core and any map plugins can be registered to it.

### Bundle communication

![Bundle communication](images/documentation/bundle_communications.png)

1. Bundles can provide a an interface for other bundles to request some operation through a request handler.
2. A bundle can provide a request class and register a handler for the request in the Oskari core.
3. Another bundle can then send the request which will be processed by the other bundle.
4. Another way to communicate with other bundles is to send out an event through Oskari core.
5. Any bundle registered as an eventlistener for the given event is then notified about the event.

## Oskari backend

![Oskari backend architecture](images/documentation/oskari_architecture_backend.png)