# [Guides](/guides) - Taking full advantage of Oskari

#### This guide is still under development and is currently based on the documents found under [Documentation](/views/documentation)

### Oskari software consists of web mapping application (frontend) and service platform (backend). This guide gives instructions on how to setup them both and how to start developing Oskari. It is assumed that the reader is familiar with [Oskari - basics](/documentation).
<br>

### 1. Setting up database
#### 1.1 [Creating the database](/documentation/backend/setup-database)
#### 1.2 [Populating the database](/documentation/backend/database-populate) (Optional)
### 2. Setting up the server
#### 2.1 [Download the Jetty bundle](/download)
#### 2.1 [Setup the development environment](/documentation/backend/setup-development)
### 3. Configuration
#### 3.1 [Modifying the initial demo data](/documentation/backend/database-customize-initial-data)
### 4. Setting up transport WFS service
#### 4.1 [Installing the WFS backend](/documentation/backend/installing-transport)
<br>

Now you have the basic functionality.

For **developing backend**, see the following documentation:
* [Enable my places](/documentation/backend/enabling-myplaces)
* [Add user authentication](/documentation/backend/authentication)
* [Setting up thematic map mode support](/documentation/backend/thematic-maps-setup)
* [Installing Parcel application](/documentation/backend/custom-install-parcel)
* [Adding user guide](/documentation/backend/adding-user-guide)


For **developing frontend**, see the following documentation:
* [Oskari Application](/documentation/core-concepts/oskari-application)
* [Oskari Bundle](/documentation/core-concepts/oskari-bundle)
 * [Oskari bundle manager/loader](/documentation/core-concepts/bundle-manager)
 * [Bundle docs](/documentation/bundles)
* [Oskari class](/documentation/core-concepts/oskari-class)
* [Oskari core and sandbox](/documentation/core-concepts/oskari-core)
* [Bundle communication: Request](/documentation/core-concepts/oskari-request)
 * [List of Oskari requests](/documentation/core-concepts/request-list)
* [Bundle communication: Event](/documentation/core-concepts/oskari-event)
 * [List of Oskari events](/documentation/core-concepts/event-list)
* [Map plugin](/documentation/core-concepts/map-plugin)
