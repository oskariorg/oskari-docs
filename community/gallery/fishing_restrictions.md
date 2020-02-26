*Date: 26.2.2020*

## Fishing restrictions on a map and more

There are some limitations on when and where to fish in Finland also for hobby fishermen and women. A map service gathering all the official restriction areas together is crucial for providing regional information for the public but also for commercial fishing industry and fishing monitoring officials, states **Eevamaria Härkönen** from Finnish Food Authority. 

The service [Kalastusrajoitus.fi][https://kalastusrajoitus.fi/#/kalastusrajoitus] has been running for a few years now and has been used by approximately 5-9000 users per month, the highest use obviously during holiday season in the summer but overall the main usage is during the fishing season stretching from spring to autumn. The service is provided now in Finnish and Swedish, but maybe also in the future in English and Russian. 

### Overlapping restrictions and legislation create interesting geospatial problems

Finding fishing restrictions is fairly easy. The only problem is how to decipher some of the restrictions. E.g. all the rivers are marked as migratory areas for fishes, although the main restrictions actually apply mainly to rapids and flow waters - AND the places where the rapids are can change due to fluctuations in water situation. Restrictions can be complicated, the service itself is not, Härkönen smiles.  

<img src="/images/gallery/fishing_restrictions.gif" width="500"/>

*Multiple restrictions on top of each other. Restriction information is fetched from Kaveri database and responsively shown on the map either when the user clicks or pans in the area of restrictions.The information shows whether or not the restriction is valid today. Service is using Suomi.fi-maps and Oskari API.*

<img src="/images/gallery/fishing_restrictions.png" width="500"/>

*Problems arise when you try to decipher the restrictions. Can you fish or not in the Aurariver waters?* 

It would be nice to have different layers for different restriction types. Since at the moment in some cases there are multiple different restrictions on top of each other. Also regarding the prior it would be good to have different default views for different users, because e.g. seine and trawl restrictions are in practice applicable only for the commercial fishing industry, describes Härkönen. 

### Suomi.fi-maps provides a solid background

The detailed information from the various fishing restrictions are shown on an embedded map created with Suomi.fi-maps (using Oskari API as described before). Suomi.fi-maps is an electronic service for public sector authorities in Finland. The restriction data is updated every weekday. The information will soon also provide an overview of demanded catch measurements and close seasons that concern larger regions.

The Fishing restriction service is only one of the many Suomi.fi-maps based services that have been taken in use during the past years in Finnish Food Authorities. In some cases Suomi.fi-maps is used to provide the “dot on the map” and in some cases for digitizing new information. Härkönen lists some of them here, most of them need registration so the actual map-part is not visible to public, so we will not link them here:

- Sisaalis (electronic service for providing catch information in freshwater areas)
- Sähi (fish planting)
- Pesä (reporting reindeer damages)
- Kalpa (list of fishing economy regions)
- EPS (animal keeper registry)
- LUOVA (organic actor monitoring service)

### Joint effort for helping our little fishes

The Fishing restriction service development is coordinated by the Finnish Food Authority and developed currently by companies called Productivityleap and Unikie. The solution itself is owned by the Ministry of Agriculture and Forestry of Finland and together with the Centres of Economy, Traffic and Environment they are responsible for the content of the service.
