# Create a custom Oskari-server extension

This document describes how to use maven artifacts provided in Oskari Maven repository to build customized Oskari-server.

### Requirements

* JDK 8
* [Maven 3+](http://maven.apache.org/) (developed using 3.5.0)
* [Jetty bundle](/download) installed

## 1. Template maven project

[Generate](https://github.com/oskariorg/sample-server-extension/generate) a copy for an Oskari based server webapp from our template

## 2. Start modifying the content

- Edit the `pom.xml`s to change the groupId/artifactId and [oskari.version](https://github.com/oskariorg/sample-server-extension/blob/1.2.1/pom.xml#L13).
- Edit the `pom.xml`s to add/change the included dependencies
- The [app-resources](https://github.com/oskariorg/sample-server-extension/tree/1.2.1/app-resources) contain configurations what functionalities, users, map layers and other content to initialize for the Oskari-based server.
- Edit the [geoportal.jsp](https://github.com/oskariorg/sample-server-extension/blob/1.2.1/webapp-map/src/main/webapp/WEB-INF/jsp/geoportal.jsp) under webapp-map to modify the base HTML.
- Create your own action routes like [MyAction](https://github.com/oskariorg/sample-server-extension/blob/1.2.1/app-specific-code/src/main/java/org/oskari/example/MyActionHandler.java) under server-extension.

The Oskari dependencies are downloaded from oskari.org Maven repository:

 	<repositories>
        <repository>
            <id>oskari_org</id>
            <name>Oskari.org release repository</name>
            <url>https://oskari.org/nexus/content/repositories/releases/</url>
        </repository>
        <repository>
            <id>oskari_org_snapshot</id>
            <name>Oskari.org snapshot repository</name>
            <url>https://oskari.org/nexus/content/repositories/snapshots/</url>
        </repository>
 	</repositories>

## 3. Build

This will build your webapp and include your code on top of the Oskari-server.

    cd sample-server-extension
    mvn clean install

## 4.Deploy to servers

Copy the `oskari-map.war` file from under `sample-server-extension/webapp-map/target/` to your servers deploy folder `{JETTY_HOME}/webapps` replacing the old one.

**Note!** You will need to adjust oskari-ext.properties accordingly. For example if you only add one view, the id of that view should be the default view in oskari-ext.properties OR you can remove the default view configuration so it will use the view type "DEFAULT" on database to detect the default view.

## Examples

- National Geoportal of Finland: https://github.com/nls-oskari/kartta.paikkatietoikkuna.fi
- Arctic-SDI geoportal: https://github.com/arctic-sdi/oskari-server-extensions