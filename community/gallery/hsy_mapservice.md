## HSY and environmental services with Oskari

HSY ([Helsinki Environmental Services](https://www.hsy.fi/fi/asukkaalle/Sivut/default.aspx)) is one of the many organisations in Finland to use Oskari as a tool for external and internal GIS use.

**Henna-Kaisa Stjernberg**, GIS specialist in HSY, tells us now how exactly Oskari is used at HSY and what are their future plans for Oskari.

"We have a special Oskari working group inside HSY which tests, coordinates and participates in the development and maintenance meetings. 
Our different sectors order or list these development needs and they are discussed within 
the group and decided which procedures are to be done at what stage and when", she explains.

"At the moment we have three different Oskari instances: 
one open for public use, one for extranet use and one for intranet use for internal actions. 
On top of the three services we have test services, so actually we have 6 Oskari instances to maintain. 
The service environment contains also PostGIS database and GeoServer software which provides the GIS interfaces."

### We use Oskari to create news to public
"We use Oskari in quite many use cases. In the open side which you can go see at [https://kartta.hsy.fi/](https://kartta.hsy.fi/) 
our customers have a possibility to download some of the datasets we provide, using special Oskari tool called the **Download basket**. It is a tool we developed together with other Oskari community organisations and one of the first community bundles created for Oskari. 
Some of the datasets are also available through the open service in realtime, like air quality."

"We use Oskari also to create news to public about certain phenomena using the embedded map functionality Oskari provides", 
she continues.

The embedded map is for example used when HSY wants to steer some projects like the mining work at Blominmäki hill at City of Espoo. 
The contractor updates the mining activities by clicking the map - a tool created on top of the embedded map using Oskari API.

<img src="../../public/images/hsy_blominmaki_louhinta.PNG" width="850"/>

*Embedded map is used to collect information from the contractor about the progress of mining operations in Blominmäki Espoo.* 

### Internal Oskari bundles serve HSY's versatile needs
The extranet service is mainly used to deliver datasets to certain user groups like consultants, 
students or other partners in need of our non-open data.

"We would like to develop the extranet service so that some of the users could edit the datasets through the service 
based on their user role, download them, calculate statistics, create thematic maps and graphs and then print the 
results for their own use", she continues. 

"In the intranet which we use inside HSY, we have also a special water management tool where we can check 
where it is possible to connect to the existing pipelines. 
Also we use the intranet service to export some of our datasets in different formats. 
These internal Oskari bundles are at the moment only built for our needs and they are updated if needed when 
a new Oskari release is available. The special bundles are developed following the architectural principles of Oskari, 
so the updates cascade fairly easily."

<img src="../../public/images/HSY_pipelinetool.PNG" width="850"/>

*The Pipeline tool is developed specially for HSYs internal needs.*

### We hope that we can serve the citizens faster and better
"We are also piloting a service called SeutuMaisa which is a Oskari based service for coordinating and 
following the excavation and transportation of land masses. Also in the waste management side in 
Ämmänsuo waste treatment center they are using Oskari to manage the different waste deposits by 
editing the deposits' geometry and attributes. This is only for our internal Oskari use."

"We are also eager to test Oskari API more. We are currently developing a Climate Atlas service using Oskari RPC, an embedded map with RPC calls from the website. When finished, the Climate Atlas provides the possibility to search data 
with certain criteria and users can also add own information. 
Oskari API provides lots of possibilities and it has gain interest in our different sectors, 
so let's see what we come up with it in the future!"

"Our hopes for the future are also to get rid of the usage of Google maps in our services and have better mobile usability with Oskari. 
We hope that we can serve the citizens faster and better in the future - like provide information about possible water 
supply disruptions. We are also very eager to create Oskari tools together with other Oskari user organisations," Stjenberg closes. 
