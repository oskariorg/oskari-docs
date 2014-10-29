## Creating new location search channel services

There is an example search channel for OpenStreetMap available in the
file `servlet-map/src/main/java/fi/nls/oskari/search/OpenStreetMapSearchService.java`.
All search channel services need to implement the `SearchableChannel` interface from the
file `service-search/src/main/java/fi/nls/oskari/search/channel/SearchableChannel.java`.

The easiest way to add a custom search channel is to extend the class
`service-search/src/main/java/fi/nls/oskari/search/channel/SearchChannel.java` and annotate the class with @Oskari("[channelID]"):

    package fi.nls.oskari.search;

    import fi.mml.portti.service.search.ChannelSearchResult;
    import fi.mml.portti.service.search.SearchCriteria;
    import fi.mml.portti.service.search.SearchResultItem;
    import fi.nls.oskari.annotation.Oskari;
    import fi.nls.oskari.log.LogFactory;
    import fi.nls.oskari.log.Logger;
    import fi.nls.oskari.search.channel.SearchChannel;
    import fi.nls.oskari.util.IOHelper;

    import java.io.IOException;

    @Oskari("MyChannel")
    public class CustomChannel extends SearchChannel {

        private Logger log = LogFactory.getLogger(this.getClass());

        public ChannelSearchResult doSearch(SearchCriteria criteria) {
            ChannelSearchResult result = new ChannelSearchResult();
            try {
                // TODO: do the actual search
                final String responseData = IOHelper.getURL("https://www.google.fi/?q="
                        + criteria.getSearchString());
                // parse responseData and populate result with SearchResultItems
                SearchResultItem item = new SearchResultItem();
                item.setTitle("MySearchResult");
                result.addItem(item);
            }
            catch (IOException ex) {
                log.error("Error connecting to service");
            }
            return result;
        }
    }

Once the class is in the servers classpath the search channel is available in searches as channel with id "MyChannel".

If you want to whitelist only relevant search channels you can define channel id's in oskari-ext.properties:

    search.channels=OPENSTREETMAP_CHANNEL,MyChannel

If you want the new channel to be used by default (without listing it as target when making searches)
it needs to be included to the list of default search channels:

    search.channels.default=MyChannel

If you only want to use it when GetSearchResult action handler is called. You can add it to this property:

    actionhandler.GetSearchResult.channels=MyChannel, OPENSTREETMAP_CHANNEL
