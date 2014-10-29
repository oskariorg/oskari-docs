## Creating a custom location search channel

The server-side search functionality in Oskari has a concept called search channel. Search channel means
a handler for one kind of service to make queries to. When using the search functionality one can specify which
channels to search from e.g. which services to search from and calling the common API the results will be combined.

All search channels need to implement the `SearchableChannel` interface from the
file `service-search/src/main/java/fi/nls/oskari/search/channel/SearchableChannel.java`. The easiest way to add a
custom search channel is to extend the class `service-search/src/main/java/fi/nls/oskari/search/channel/SearchChannel.java`
and annotate the class with `@Oskari("channelID")`:

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

If you want to whitelist search channels and use only relevant ones for your application you can define a list of channel id's in oskari-ext.properties:

    search.channels=OPENSTREETMAP_CHANNEL,MyChannel

If you don't want to specify searches to use your channel explicitly you can add it to a list of default channels to be used.
These channels are *always* added as target channels when making searches in addition to the ones defined explicitly:

    search.channels.default=MyChannel

If you only want to use it when GetSearchResult action handler is called. You can add it to this property:

    actionhandler.GetSearchResult.channels=MyChannel, OPENSTREETMAP_CHANNEL

## More examples

There is an example search channel for OpenStreetMap available in the
file `servlet-map/src/main/java/fi/nls/oskari/search/OpenStreetMapSearchService.java` and several more in service-search-nls.

Notice that when returning results the location should be in the same projection as specified in the criteria!

## Things to improve (TODO)

* Parallel search
* Maybe add result SRS and have a common transformation so channels don't need to care about it
* Logic for result ordering
* Describe result items in more detail and make them more generic to support more properties