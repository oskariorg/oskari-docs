## Oskari as a City map service

City of Tampere is one of the most long term users of Oskari. [City of Tampere mapservice](https://kartat.tampere.fi/) 
is the public view to the information the city provides to its citizens but Oskari is also in internal use with the city officials. 
The map service is basic Oskari implementation excluding some graphical elements.

<img src="/images/gallery/tampere.png"/>

### Providing the right users the right data
One of the interesting things in Tampere case is that the city official's user IDs have been incorporated within the Oskari installation 
using rolebased administration. This keeps the data integrity intact. The right persons are able to edit and view the datasets they are allowed 
to edit and view.

"We provide and maintain a large amount of different substance information in geospatial format. 
With rolebased administration, this information can also be viewed by our different stake holders through the map service", 
describes Marko Kauppi, special planner in City of Tampere (now working at Ubigu Ltd).

### Light-weight map services with Oskari
One of the coolest examples of using Oskari is the RPC-functionalities. 
You can create light services on top of Oskari-installation that utilize the datasets and map service in the background. 
City of Tampere has been using this functionality quite often. 
Here is one example for [the general plan from Tampere](http://karttapalvelu.tampere.fi/www/kanta_yk2040/#) and here 
[a feed back service for the tram-planning](https://kartat.tampere.fi/raitiotieallianssi/).

### Improvements in map listing by joint cooperation
City of Tampere, Lounaispaikka, National Board of Antiquities and Helsinki Region Environment were among the organisations that developed the hierarchical layer list functionality to Oskari.
This development is one great example on how we can create features to Oskari that also others are interested in having.
