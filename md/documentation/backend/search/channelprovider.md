# ChannelProvider customizations

Search channels can sometimes be generated based on some configuration and need to be created dynamically. One example of this in Oskari is configuring registered WFS-services as datasources for search (see `WFSChannelProvider` below).

### Custom ChannelProvider

Creating a channel provider needs to extend `fi.nls.oskari.search.channel.ChannelProvider` and implement the `getChannels()` method. The method should return a set of `SearchChannel` objects.

	package fi.nls.oskari.search.channel;

	import fi.nls.oskari.annotation.Oskari;

	import java.util.HashSet;
	import java.util.Set;

	@Oskari
	public class WFSChannelProvider extends ChannelProvider {

	    public Set<SearchChannel> getChannels() {
	        Set<SearchChannel> channels = new HashSet<>();
	        // TODO: populate set with SearchChannels
	        return channels;
	    }
	}


The provider also implements a simple listener interface for observing channel changes. The search service registers as a listener to adjust usable search channels based on currently available ones as they can change at runtime. The provider class needs to be annoted with `@Oskari` for search service to find it in the classpath.

The search functionality should be notified of any runtime changes to channels the provider creates by calling the `channelAdded()` and `channelRemoved()` methods on the provider.

### WFSChannelProvider

There is an admin bundle available (`tampere/admin-wfs-search-channel`) providing user interface for selecting a registered wfs-service and attribute(s) in that service to query against for results. The backend that is managing the WFS channels is implemented as a ChannelProvider. Check `fi.nls.oskari.search.channel.WFSChannelProvider` in `oskari-server/service-search-wfs` for the implementation. This reads the database for configurations based on registered WFS-services and creates a set of `WFSSearchChannel` objects to be used as datasources. These can be further customized by creating `WFSChannelHandlers`. WFSChannelHandler can be selected with database table `oskari_wfs_search_channels` column `config` with JSON value like this:

	{
		"handler" : "ExampleHandlerID"
	}

#### WFSChannelHandler

The WFSChannelHandlers can be used to modify the WFS-filter that is used when calling the service by overriding the `createFilter()` method.

	package fi.nls.oskari.search.channel;

	import fi.mml.portti.service.search.SearchCriteria;
	import fi.nls.oskari.annotation.Oskari;
	import fi.nls.oskari.wfs.WFSSearchChannelsConfiguration;

	import java.util.List;

	@Oskari("ExampleHandlerID")
	public class ExampleHandler extends WFSChannelHandler {
	    private Logger log = LogFactory.getLogger(this.getClass());

	    public String createFilter(SearchCriteria sc, WFSSearchChannelsConfiguration config) {
	        // custom filter handling
	        String searchStr = sc.getSearchString();
	        StringBuffer filter = new StringBuffer("<Filter>");
	        // TODO: create filter contents
	        filter.append("</Filter>");
	        return filter.toString().trim();
	    }
	}
