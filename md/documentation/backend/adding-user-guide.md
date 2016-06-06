# Adding User Guide

- Add `userguide` bundle to view

### Default user guide

- Modify userguide.html, which is found by default under `{JETTY_HOME}/resources/articlesByTag`
- The folder where the userguide.html is found can be configured to oskari-ext.properties as follows:

`actionhandler.GetArticlesByTag.dir=/articlesByTag/`

### Custom user guide

- Modify `oskari-server/control-example/src/main/java/fi/nls/oskari/control/GetArticlesByTagHandler.java` to return a customized User Guide.