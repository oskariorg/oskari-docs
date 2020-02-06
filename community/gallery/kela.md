Date: 5.11.2018

## The Social Insurance Institution of Finland took Oskari API in use

Service points of [The Social Insurance Institution of Finland (Kela)](https://www.kela.fi/web/en) can now be observed with a [web map service](https://www.kela.fi/palvelupisteen-haku). 
The map platform is provided by an Oskari based service called [Suomi.fi - maps](https://esuomi.fi/?lang=en). 

<img src="/images/gallery/kela.png" width="500"/>

The possibility to publish embedded maps from Oskari based services enables also the creation of own tailored light weight web maps 
using Oskari API. The embedded map can be used to retrieve information from your website or own databases. 
In this case Kela created search forms to fetch data from their service points around Finland. 
We asked them a little bit how the service creation went and what challenges they had.

### Use what is already there

"The search application used Suomi.fi -maps and other open source components. 
We want to build our applications on top of already existing and available public sector services,
so that we do not have to create everything from scratch", describes Kela's web marketing expert **Samuli Vuorinen**.

"The search service uses the national Service database created also in the Suomi.fi Services. 
The querying of the data was quite simple. However the database does not suit to all our needs, but in this case it functions well. 
The organisations in Finland still have some learning to do - how they are delivering their service point information as 
fast as possible to the national database", continues Vuorinen.

### Documentation needs improvement
Vuorinen is relatively pleased with Suomi.fi -maps service. Compared to their last service, the current one is considerably 
more modern and responsive and thus reachable with mobile use also. 

**Mikko Karvonen**, a software developer in Kela, describes that Oskari provides convenient and handy functionalities for 
handling web maps, but there is still need for improving the documentation.

### Oskari API and your own datasets
Kela service search utilizes the Oskari RPC technology a.c.a. Oskari API. 
In this case the API is used to fetch data from Kela's json interface. 
They download information from the National Service database to Kela's own databases couple times a day 
to ensure the delivery through the application as fast as possible.

More information about how to get [Suomi.fi Maps in use (in Finnish)](https://www.maanmittauslaitos.fi/asioi-verkossa/suomifi-kartat) and 
[Suomi.fi Services](https://esuomi.fi/?lang=en). Suomi.fi Service is being developed by the Population Register Centre of Finland. 
