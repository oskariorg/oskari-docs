# The Oskari Platform architecture

### The big picture

The Oskari Platform helps businesses and municipalities 
offer better online and mobile map services 
to their citizens and consumers.

It is not a turnkey solution, but instead provides software components used in online service creation,
leveraging geospatial data from standardised APIs.

The Platform integrates 
off-the-shelf Open Source geographical software products
with off-the-shelf Open Source software libraries
and custom Oskari software components
to allow the interleaving and integration of many different sources of geographical and statistical data
into online map visualizations
that help power e-government services and decisionmaking processes.

### The component architecture

The Oskari Platform includes a frontend, a backend and in the future also a service bus.

The user interface is implemented in JavaScript and the server functionality in Java.

The picture below shows the components of Oskari Platform. 

For a more detailed view of the architecture, see the [frontend architecture](/documentation/development/architecture) and the [backend architecture](/documentation/architecture/components) documents.

![Full stack](/images/architecture/full-stack.png)


* Browser - Oskari frontend			
	- Firefox							
	- Chrome
	- Internet Explorer
	- Safari

* Proxy/Load balancer
	- HAProxy
	- Apache
	- Nginx
	- F5 load balancer

* Oskari-map
	- Jetty
	- Tomcat
	- Liferay

* Transport/Redis
	- Jetty

* Geoserver
	- Jetty
	- Tomcat

* Printout/Redis
	- Jetty

* Database
	- PostgreSQL