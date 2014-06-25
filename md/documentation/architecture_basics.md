# Oskari Platform architecture

#### Oskari Platform includes frontend, backend and in the future also service bus. User interface is implemented in JavaScript and server functionality in Java.

#### The picture below shows the components of Oskari Platform. For more detailed architecture, see [frontend architecture](/documentation/development/architecture) and [backend architecture](/documentation/architecture/components).
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