# Setup Redis for Oskari

Redis is used for caching data for example from statistical datasources to provide a cleaner user experience for statistical map functionalities (optional part of `oskari-map` webapp).

### 1. Get Redis

Install binaries from http://redis.io/ or from your platforms package repository.

### 2. Install

And startup `redis-server`. The default port Redis listens to is `6379`.

### 3. Configure Oskari (Optional)

Oskari expects Redis to be found in the default port (6379) on the same server as Oskari ("localhost"). If you have it running on another host/port you need
to change the `oskari-ext.properties`:

	redis.hostname=localhost
	redis.port=6379