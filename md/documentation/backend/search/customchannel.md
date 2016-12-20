# Creating a custom location search channel

All search channels need to implement the `SearchableChannel` interface from the
file `service-search/src/main/java/fi/nls/oskari/search/channel/SearchableChannel.java`. The easiest way to add a
custom search channel is to extend the class `service-search/src/main/java/fi/nls/oskari/search/channel/SearchChannel.java`
and annotate the class with `@Oskari("channelID")`. This example offers a basic textual search implementation:

    package fi.nls.oskari.search;

    import fi.mml.portti.service.search.ChannelSearchResult;
    import fi.mml.portti.service.search.SearchCriteria;
    import fi.mml.portti.service.search.SearchResultItem;
    import fi.nls.oskari.annotation.Oskari;
    import fi.nls.oskari.search.channel.SearchChannel;
    import fi.nls.oskari.util.IOHelper;

    import java.io.IOException;

    @Oskari("MyChannel")
    public class CustomChannel extends SearchChannel {

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
                throw new RuntimeException("Error searching", ex);
            }
            return result;
        }
    }

Once the class is in the servers classpath the search channel is available in searches as channel with id `MyChannel`.
*Note!* The results location (coordinates) should be in the same projection as specified in the criteria!

## SearchChannel methods to override

### void init();

Any initialization should be performed here. Properties setup for example.

### boolean hasPermission(User user)

Default implementation returns true for all users. Override if the datasource should only be available for some users.

### Default search channels

Default channels are used for searching when no channel has been specified for the search. Search channels can specify if they should be included to be used in such queries. This can be done by returning a boolean value from the `SearchChannel.isDefaultChannel()` method. The default is true and can be configured with channel specific properties:

    public boolean isDefaultChannel() {
        return PropertyUtil.getOptional("search.channel." + getName() + ".isDefault", true);
    }

### SearchableChannel.Capabilities getCapabilities();

Capabilities is an enum with values COORD, TEXT and BOTH. Defaults to TEXT on SearchChannel baseclass.
- TEXT means the channel can be used to search with text.
- COORD means the channel can be used to search with coordinates/reverse geocode.
- BOTH means the channel implements both text and coordinate based searches.

### boolean isValidSearchTerm(SearchCriteria criteria);

This method can be overridden to check whether the criteria makes sense in the context of the channel.
Like is the searchtext in correct syntax for a cadastral parcel id etc.

### ChannelSearchResult reverseGeocode(SearchCriteria criteria) throws IllegalSearchCriteriaException;

Implement this method if you want to use reverse geocoding for the channel.
You will also need to override getCapabilities to return COORD or BOTH.

## More examples

There is an example search channel for OpenStreetMap available in the
file `service-search-opendata/src/main/java/fi/nls/oskari/search/OpenStreetMapSearchService.java` and several more in service-search-nls.

