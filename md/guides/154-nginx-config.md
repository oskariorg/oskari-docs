# Configuring nginx

This guide gives an example for configuring a reverse proxy for Oskari-server using [nginx](http://nginx.org/).
The latest nginx version at the time of writing is 1.8.1 which has been used to test these configurations.

*Using a reverse proxy is not required for development, but is recommended for production use*

You can find example configurations in https://github.com/oskariorg/sample-configs/tree/master/nginx

![Diagram for nginx proxy](/images/documentation/nginx.png)

In `/etc/nginx/nginx.conf` turn on gzip support

    gzip  on;

Most of the other configurations can be done in `/etc/nginx/conf.d/default.conf`

## Assumptions

### Oskari frontend code.

Oskari frontend code should be made available in the server directory `/opt/public/oskari`.
This can be changed by modifying these lines:


```
    root /opt/public/;

    # Oskari frontend files
    location ^~ /Oskari/ {
        rewrite ^/Oskari/(.*)$ $1 break;
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

Oskari-server and Geoserver can both be on the same Jetty, but having Geoserver on the same JVM affects projection
 handling due to this: http://docs.geotools.org/latest/userguide/library/referencing/order.html

Because of this reason it's recommended that Geoserver is not running on the same Jetty as Oskari-server.

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
The sample contains an IP-address based restriction so geoserver admin interface is accessible from the configured IP while setting up the service.
Edit the following line to match the IP-address you wish to grant access to Geoserver (Replace `1.2.3.4` with IP):


```
    location ^~ /geoserver {
		# Restrict connections to single ip - EDIT IP FOR YOU ENVIRONMENT
		allow 1.2.3.4/32; deny all;
		...
	}

```

#### Cross-site request forgery protection

Java libraries don't support the SameSite-flag for cookies yet so we need to protect our service from session manipulation and CSRF by modifying the cookies on nginx.
This snippet modifies the cookie Jetty gives and adds secure, httponly and samesite-flags on it. SameSite-flag means that browsers don't send for example the session cookie when requests originate from a different domain.

```
    # Oskari-server Jetty location
    location / {
        ...

        # set all cookies to secure, httponly and samesite by modifying "path"
        proxy_cookie_path / "/; secure; HttpOnly; SameSite=lax";
    }
```

## HTTPS-configuration

The following enables HTTPS on the server. Add the certificates on:
- `/etc/nginx/ssl/public.crt` for public key
- `/etc/nginx/ssl/private.rsa` for private key

or change the configuration accordingly.


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
```

### Proxying requests to non-secure services

Oskari-server will proxy any map layer services that are not secure (https) to allow browsers show the map on secure domain.
This requires the application server to be aware if the incoming request is secure. 
In Jetty this can be accomplished by forwarding some headers to Jetty hosting oskari-map:

```
    location / {
    	...
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        ...
    }

```

The Jetty must also be configured to be aware that it has a reverse-proxy. This is done by modifying `{jetty.base}/start.d/oskari.ini`:

```
# ---------------------------------------
# Module: http-forwarded
# Enable X-Forwarded-For headers handling
# Needed for:
# - Webpack frontend development
# - forward proxy on production (for example nginx -> jetty) where the proxy is handling TLS etc
# ---------------------------------------
--module=http-forwarded
```

This enables the http-forwarded module for Jetty 9 which allows webapps like Oskari-server get additional information about the requests it receives.
This allows Oskari to proxy requests that don't support HTTPS.

**Note! This also adds a great amount of network traffic going through your server!**

