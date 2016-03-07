# Configuring nginx

This guide gives an example for configuring a reverse proxy for Oskari-server using [nginx](http://nginx.org/).
The latest nginx version at the time of writing is 1.8.1 which has been used to test these configurations.

*Using a reverse proxy is not required for development, but is recommended for production use*

You can find example configurations in https://github.com/nls-oskari/sample-configs/tree/master/nginx

In `/etc/nginx/nginx.conf` turn on gzip to

    gzip  on;

Any other configs can be done in `/etc/nginx/conf.d/default.conf`

## Assumptions

### Oskari frontend code.

Oskari frontend code should be made available in the server directory `/opt/public/oskari`.
This can be changed by modifying these lines:


```
    root /opt/public/;

    location ^~ /Oskari.*$ {
        try_files /oskari/$1 oskari/$1/ =404;
    }

```

### Oskari-server

Oskari server should be running on localhost in port 8080.
This can be changed by modifying these lines:


```
upstream oskariserver {
    server localhost:8080;
}

```

### Oskari transport

Oskari transport should be running on localhost in port 8081.
This can be changed by modifying these lines:


```
upstream transport {
    server localhost:8081;
}

```

### Geoserver for myplaces/analysis/userlayers

Geoserver should be running on localhost in port 8082.
This can be changed by modifying these lines:


```
upstream geoserver {
    server localhost:8082;
}

```

#### Security on user-generated content

**Note! Geoserver does not need to be publicly available for Oskari to work. Just configure the direct address to `oskari-ext.properties`**

Geoserver access should be restricted so anonymous users can't download user-generated content.
This can be done by configuring geoservers access rules or by restricting external access in the nginx configuration.
The sample contains an ip-based restriction so geoserver admin interface is accessible when configuring the service.
Edit the following line to match the IP-address you wish to grant access to Geoserver (Replace `1.2.3.4` with IP):


```
    location ^~ /geoserver {
		# Restrict connections to single ip - EDIT IP FOR YOU ENVIRONMENT
		allow 1.2.3.4/32; deny all;
		...
	}

```

## HTTPS-configuration

The following enables HTTPS on the server. Add the certificates on:
- `/etc/nginx/ssl/public.crt` for public key
- `/etc/nginx/ssl/private.rsa` for private key

or chance the configuration accordingly.


```
    # ssl config - optional, but recommended for offering https-urls
    listen       443 ssl;
    ssl_certificate /etc/nginx/ssl/public.crt;
    ssl_certificate_key /etc/nginx/ssl/private.rsa;

    # ssl security settings - optional, but recommended
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";
    server_tokens off;
    # /ssl config

    location ^~ /tiles/ {
    	...
    }

```

### The /tiles configuration

Oskari-server can be configured to modify any maplayer urls to be prefixed with a value stripping the protocol part of the url.
This requires the application server to be aware of the secure request.
In Jetty this can be accomplished by forwarding some headers to Jetty hosting oskari-map:


```
    location / {
    	...
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        ...
    }

```

The Jetty must also be configured to be aware that it has a reverse-proxy. This is done by modifying `{jetty.home}/etc/jetty.xml`:


```
    <Call name="addConnector">
      <Arg>
          <New class="org.eclipse.jetty.server.nio.SelectChannelConnector">
            <Set name="host"><Property name="jetty.host" /></Set>
            <Set name="port"><Property name="jetty.port" default="8080"/></Set>
            <Set name="forwarded">true</Set>
            ...

```
Add the `forwarded=true` setting for the connector. This allows Oskari-server to get the secure request information.
For secure requests the maplayer urls will be prefixed by a property-value (configured in `oskari-ext.properties`, defaults to `https://`):


```
	maplayer.wmsurl.secure=/tiles/

```

This allows you to support HTTPS for maplayers that don't support it on the mapservice.

**Note! This also adds a great amount of network traffic going through your server!**

The final piece missing for HTTPS is configuring nginx to proxy anything starting with `/tiles` to the correct servers:


```
    # SSL maplayer tile proxying (optional, required for https tiles from services without https-support)
    # requires DNS resolver configured in ../nginx.conf -> resolver a.b.c.d;
    location ^~ /tiles/ {
        # Restrict accesss to requests with current domain as referer - EDIT THE DOMAIN
        if ($http_referer !~ "https://your.host.com/"){
          return 403;
        }

        rewrite ^/tiles/(.*)$ $1 break;
        proxy_pass http://$1$is_args$args;
    }

```

You will also need to configure a DNS resolver for these requests. It's done in `/etc/nginx/nginx.conf`:

```
    # from /etc/resolv.conf to get the nameserver
    # required for /tiles proxying when HTTPS
    # if not using /tiles this can be removed
    resolver 8.8.8.8;

```

**Note! You will want to restrict the traffic** so only legit maplayer tile requests are being passed.
In the sample the referer-header is checked to see that it matches the site hosting Oskari. 
Modify `your.host.com` to match the domain.





