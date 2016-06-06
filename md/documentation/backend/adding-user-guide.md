# Adding User Guide

- Add `userguide` bundle to view

### Default user guide

- Modify userguide.html, which is found by default under `resources/articlesByTag`
- The folder where the userguide.html is found can be configured to oskari-ext.properties as follows:

`actionhandler.GetArticlesByTag.dir=/pathtomyfolder/`

### Custom user guide

- Modify `oskari-server/control-example/src/main/java/fi/nls/oskari/control/GetArticlesByTagHandler.java` to return a customized User Guide.

    Ensure the parameters are changed accordingly as well. The parameters are localized in Oskari.

    See http://www.paikkatietoikkuna.fi/web/en/user-guide as a reference.

- Rebuild and restart using `mvn exec:java` in `oskari-server/standalone-jetty` (use `-Doskari.setup=custom-view` if you want to use another view)