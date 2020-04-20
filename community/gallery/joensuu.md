*Date: 29.1.2020*

## City of Joensuu takes Oskari to the next level
**Jarno Kinnunen**, GIS specialist working at the capital of North Karelia, City of Joensuu, manages GIS like no other. 
Above all Kinnunen is very interested in all new GI technologies. He pushes them to the limits, tests and explains his findings in a very distinct way. He provides easy to follow instructions for the Finnish audience in his blog “The GIS-man” – [Paikkatietomies](https://www.paikkatietomies.fi/). 

Last year he went ahead and installed Oskari environment for the City of Joensuu in an effort to create a service for managing with geospatial information. Not managing information, but managing with information. 

### Managing with information provides valuable insights about our living environment

Kinnunen stated already last fall during the Oskari & OSGeo tour that the leadership of organisations should be based on real and analysed information. This is something we all want to believe in and needless to say it is more crucial now than ever when struggling with global trends of climate change, urbanisation, digitalisation and senescence.

Managing with information refers to the ability to collect data from different systems and sources, combining and analysing them and reporting the findings. Kinnunen eventually reckoned that Oskari’s abilities could suit these purposes and that it could complete the existing commercial municipal registry system provided by [Trimble](https://www.trimble.com/) (used in many Finnish municipalities). Last year they already created nice visualisations and informative maps about [population](https://oskari.joensuu.fi/?zoomLevel=8&coord=641888.7390984665_6944235.880752566&mapLayers=20+100+default,115+100+Muutos:%202014%20-%20nykyhetki&uuid=8c4d8671-cd00-41eb-992a-0aa6f21c463c&noSavedState=true&showIntro=false) and [building](https://oskari.joensuu.fi/?zoomLevel=8&coord=642621.2491746544_6944036.380971023&mapLayers=20+100+default,126+100+,129+100+,130+100+&uuid=8c4d8671-cd00-41eb-992a-0aa6f21c463c&noSavedState=true&showIntro=false) changes inside the City of Joensuu by joining GFI (GetFeatureInfo) request with Google Chart API resulting in good quality pop-up infos ([check out an example in Jarno’s blog](https://www.paikkatietomies.fi/webbikartta-oskari-karttapalvelun-avulla/)).

<img src="/images/gallery/joensuu.png" class="img-responsive"/>

*Example of GFI pop-ups with Google Charts integration.* 

### Visually clear understanding about today and the future

Now Kinnunen reveals that they have two main goals for the ongoing year of 2020:

“First goal is to create a GIS based land use management program. We combine information coming from different databases and systems – like up-to-date population statistics, population forecasts, investment program plans, building information and planned property reclaims.

The goal is to create visually clear understanding about the current and future city that we are building. This provides tools for officials, decision makers and citizens.

Oskari has excellent tools for this: easy to use web map with effortless provision of detailed attribute information and it also allows us to control the user rights. Tools behind Oskari and OGC-interfaces like GDAL, PostGIS and GeoServer enable highly versatile and automated GIS analysis and visualisations.”

No we have not paid Jarno to say this. He just likes us.

### 3D Oskari provide new possibilities
“The other goal is to publish a city model with Oskari. Hence we are truly excited about Oskari’s new 3D possibilities that are now enabled in the recent release. We have the abilities to provide city models in CityGML-format.

Trimble Locus provides the WFS-interface for the CityGML which we then convert with ETL-tools into 3Dtiles-format and publish it through Oskari.

We have been convinced by the 3D demo datasets shown in national geoportal (Paikkatietoikkuna) that Oskari might very well be the publishing tool for city models provided by commercial softwares.

Time will tell how we handle these thoughts! And we are really interested in all joint efforts that (municipalities) have, joint development might be the way for cities like Joensuu to be part of Oskari development.”

**More information:**

Jarno Kinnunen, City of Joensuu, jarno.kinnunen@joensuu.fi
