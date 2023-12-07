# Customizing service logo

The logo of the service is by default displayed on the:
- LogoPlugin (lower left corner on the map by default)
- On printouts when the print functionality is enabled
- Browser tab/favicon

You can customize these on the server by adding binary images on the server classpath (or package them inside the war-file) and referencing them on the `oskari-ext.properties` configuration file:
```
# These are the built-in logos for Oskari
# You can override them by changing the path to point to a png on the server classpath (for example resources under jetty)
logo.path.print=/org/oskari/util/logo_print.png
logo.path=/org/oskari/util/logo.png

# Or if they are under jetty/resources/images
#  logo.path.print=/images/logo_print.png
#  logo.path=/images/logo.png
```

Optionally you can also overwrite the image from LogoPlugin with CSS (for example on the overwritten.css file when having a my_logo.png on the same folder) with:
```
.logoplugin .logo {
    content: url('my_logo.png');
}
```

If the logo is not square you might need this selector for set the size of the container for it, but otherwise the server configuration is the preferred method.

## Custom favicon

Easiest way to override the browser tab icon (favicon.ico) is to replace the file under `webapp-map/src/main/resources/favicon.ico` on your server repository. You can configure another location with `oskari-ext.properties`, but the file name needs to match `favicon.ico` regardless: 
```
# under jetty-resources (when working folder is jetty-server folder)
#   favicon.path=file:resources/img/favicon.ico
# with absolute path on the server
#   favicon.path=file:/opt/public/img/favicon.ico
# reference file inside oskari-map.war
#   favicon.path=classpath:images/favicon.ico
```
