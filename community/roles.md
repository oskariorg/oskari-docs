# User roles and requirements

Here the abilities of the different user roles handling Oskari software are described. This information can be used when recruiting new team members or when creating a procurement process regarding Oskari maintenance or development.
 
## Oskari developer
Develops new features or improves existing functionalities in Oskari. Can contribute to Oskari core or Oskari community plugin development.

### Requirements:

- Version management: Git
- Frontend: JavaScript, HTML, CSS, OpenLayers 3+
- Backend: Java, PostgreSQL, PostGIS, GeoServer, GeoTools
- Build infrastructure & tests: Jenkins, Travis CI, Selenium, Robot Framework
- Understanding about the following software: GeoServer, PostGIS, Jetty, Redis, Nginx
- Understanding OGC standards: WMS, WMTS, WFS, WPS, WCS

## Oskari technical maintainer
Usually same individual as developer but not always. Mounts Oskari instance to requested server environment. Keeps Oskari software up-to date, checks the versioning of the software when a new release is available. Activates the necessary bundles and creates possible user management integration for the organisation. Adds datasets/integrations using different API’s to Oskari instances if needed. Configures Oskari instance with possible metadata service providing metadata in CSW format. Checks also the connections to location search integrations.

### Other possible tasks:
problem solving esp. with API’s

### Requirements:
- Build infrastructure, see also Oskari developer
- Oskari architecture, bundles and component
 
## Oskari content administrator
Acts as the administrator of Oskari instance: adds new dataset layers to Oskari and also administers the users and rights for end users (layer privileges). Can also customize the basic settings of Oskari layers: scale, bounding boxes, legends and links to metadata of map layers. Understands the functionalities of WMS, WFS, WMTS and WCS standards, understands parameters of GetCapabilities requests.

### Other possible tasks:

- Usually also creates the geospatial interfaces from datasets with suitable software (e.g. MapServer, GeoServer, ArcGIS Server) including managing GetFeatureInfo requests (what information are shown in pop-up info tool in Oskari and how), visualizing the layers (e.g. using SLD) and configuring legends. Maintaining of those interfaces.

### Requirements:

- Good skills on GIS and GIS software (e.g. QGIS, ArcGIS, PostGIS)
- Knowledge on OGC standards (at least WMS and WFS)
- Basic IT skills
- Possible others skills: cartographic / visualization skills, experience with html or xml, experience with Styled Layer Descriptor (SLD)

## Oskari service designer
Usually same individual as product owner but not always. Service design is needed when creating Oskari based services or changes are made to current Oskari instance or functionalities. Service designer is responsible for designing the service so that it meets the needs of customers and the service provider. This can be done by checking the processes of every service interaction sessions (identification of actors, definition of possible service scenarios, providing the blueprint of the service). Acts closely with the development team and project owner.

### Other possible tasks:

- Designing graphical elements for the service or tools.

### Requirements:

- Good skills in service design
- Possible other requirements: Understanding on map services, GIS technologies and/or UI design, good graphic designing skills
 
## Oskari product owner
Product owner for Oskari instance. Responsible for the management of service requirements and functionalities (why the service is available, what user groups there are and what are the needs of the end users). Overlooks the maintenance (technical and content) of the Oskari instance.

### Other possible tasks:

- Designs new required Oskari functionalities together with the developer team. Provides descriptions, mockups and use case stories for new features. Finds funding for development. Also checks the possibilities to cofund new features. Informs the Oskari community about new feature development. Facilitates also the end user testing. Makes sure the new features are being maintained and further developed.

### Requirements:

- Understanding on project management
- Possible other requirements: previous team leader experience, GIS skills, understanding user needs, understanding of service design
