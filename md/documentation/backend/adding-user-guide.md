# Adding User Guide

1. Add `userguide` bundle to view in `oskari-server/content-resources` (e.g. `default-view`)

2. Modify `oskari-server/control-example/src/main/java/fi/nls/oskari/control/GetArticlesByTagHandler.java` to return a customized User Guide.

    Ensure the parameters are changed accordingly as well. The parameters are localized in Oskari.

    See http://www.paikkatietoikkuna.fi/web/en/user-guide as a reference.

3. Rebuild and restart using `mvn exec:java` in `oskari-server/standalone-jetty` (use `-Doskari.setup=custom-view` if you want to use another view)