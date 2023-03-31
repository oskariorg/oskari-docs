# Oskari RPC

One of the features of Oskari is the ability to define a map that can be embedded to another website. The maplayers selections and other settings can be done using an easy to use user interface. While this is a powerful feature on its own the RPC-functionality adds the ability to control the embedded map and react to events on the map from the embedding website.

**Note! The instance that hosts the embedded map and the selections made in the publisher functionality affects what can be done with RPC. Some functionalities can be disabled or not supported depending on the Oskari instance.**

## Concepts

### Request

- Way of programmatically commanding the map to do something like move to given location or adding a feature on the map
- [List of requests](https://oskari.org/api/requests) (Select the "RPC only" checkbox to filter for embedded maps)

### Events

- Way of programmatically listening to what is happening on the map like notifying code on the embedding page when the map moved or a location or feature was clicked etc
- [List of events](https://oskari.org/api/events) (Select the "RPC only" checkbox to filter for embedded maps)

### Examples

- [Introduction to RPC](https://oskari.org/examples/rpc-api/rpc_example.html)
- Tutorials how to work with RPC:
    - [FOSS4G 2019 Bucharest workshop](/documentation/examples/FOSS4G_2019/workshop) with the sources available in [GitHub](https://github.com/oskariorg/oskari-docs/tree/master/md/documentation/examples/FOSS4G_2019)
    - [FOSS4G 2022 Firenze workshop](/documentation/examples/FOSS4G_2022/workshop) with the sources available in [GitHub](https://github.com/oskariorg/oskari-docs/tree/master/md/documentation/examples/FOSS4G_2022)
