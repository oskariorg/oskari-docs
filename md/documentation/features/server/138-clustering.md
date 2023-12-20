# Server clustering

Oskari server can be used in a clustered environment setup.
A server cluster can be used to increase availability, reliability and scalability and help 
deal with software crashes/hardware failures etc in the system. 

A simple clustered environment can be set up by having 1-n Jetty-servers (or Tomcat etc) running Oskari-server based webapp and having a load balancer
like nginx as a an entrypoint that forwards requests to the Jetty-instances. The requests can be forwarded in a round-robin fashion. "Sticky sessions"
 are not required but could benefit debugging etc (see Identified challenges).

Currently this means:
- User sessions can be saved/tracked in Redis (shared between nodes)
- Caches communicate removals/flushes between cluster nodes
- Programmatically setting log level is communicated between cluster nodes

Note! A "cluster" with just one server instance still means persistent sessions (sessions don't "die" with server restart etc) so it's worth considering.

## Enabling cluster handling

Clustered environment handling is enabled with `oskari.profiles` in `oskari-ext.properties`:

```
# Comma-separated list of profiles to activate.
oskari.profiles=redis-session
```
Add `redis-session` to the profiles list

## Code examples for adding more cluster aware functionality

### Check status

Check if we have cluster handling enabled:

```java
boolean isClustered = org.oskari.cluster.ClusterManager.isClustered();
```

### Messaging

Calling `ClusterManager.getClientFor([functionality id])` returns a `ClusterClient` instance that is created on first call and shared between returning calls. This keeps the number of Redis-connections manageable. The `ClusterClient` can be used to send messages and listen to messages. The `ClusterManager` handles that messages from the same instance are not received by listeners of that same instance. `ClusterClient` handles that messages from other functionalities on the same instance are not received by other functionalities for example "cache" functionality doesn't receive messages from "logger" functionality making it easier to handle messages based on the functionality.

For example `cache` is used by Oskari cache classes as functionality id.

Messaging also has a `channel` that can be used to further filter messages for specific listeners. Channel could be considered an event name for usual event based code. In the cache functionality `channel` is used to identify the cache instance (maplayer, dataprovider etc).

### Sending messages

```java
String functionalityId = "cache";
String channel = "maplayer"; 
String msg = "REM:1";
ClusterManager
    .getClientFor(functionalityId)
    .sendMessage(channel, msg);
```
This would send a message `REM:1` to `cache` functionality with channel `maplayer`. This would signal other cluster nodes that `cache` with name `maplayer` should be notified with the message `REM:1`. The functionality that is doing messaging is responsible for implementing the message parsing/protocol ie. what kind of message signifies what in the functionality.

### Listening to messages

Listen to messages from other cluster nodes based on `functionality id` and more specific message type `channel`. The code below can be used to listen to messages from other cluster nodes that have been sent with the code snippet above.

```java
String functionalityId = "cache";
String channel = "maplayer"; 
ClusterManager
    .getClientFor(functionalityId)
    .addListener(channel, (msg) -> handleClusterMsg(msg));
```
The `handleClusterMsg()` will receive the `REM:1` message from the above example and in the case of caches will remove the value with key 1 from the cache. Note that channel is used to identify the cache so only the `maplayer` cache would remove the item with key 1, not for example a cache for dataproviders.

### Identified challenges

Server clusters usually present some challenges for servers environments as well. Here's something we've identified:

#### Logging

Logging in clustered environment means that a single page view by a single user can generate log messages on different servers (different log files).
This requires an instance specific solution like:
- "sticky session" where the load balancer in front of Oskari-server forwards requests from single user to the same server instance.
- a centralized logging system where the log from each node is gathered on a central system. 

The centralized logging would also benefit from a "request id" that could be used to group log messages/user without identifying the user details. This hasn't been implemented as it is not trivial and would require passing some identifier to different parts of the system that don't require it now.
