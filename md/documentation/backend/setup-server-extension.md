# Create a custom Oskari-server extension

This document describes how to use maven artifacts provided in Oskari Maven repository to build customized Oskari-server.

### Requirements

* JDK 1.7+ (tested with Oracle Java 1.7.0_51 and 1.8.0_05)
* [Maven 3+](http://maven.apache.org/) (tested with 3.0.5)
* [Jetty bundle](/download) installed

## 1. Download a template maven project

[Download](/build/server/oskari-server-extension.zip) a premade package for this webapp

## 2. Start modifying the content

- Edit the `pom.xml`s to change the groupId/artifactId and `oskari.version`.
- Edit the `pom.xml`s to add/change the included dependencies
- Edit the app-resources to configure app-myapp.json/myapp-view.json/mylayer.json. These are used by default since webapp-map overrides app-default.json.
- Edit the myapp.jsp under webapp-map to modify the base HTML.
- Create your own action routes like MyAction under server-extension.

The released Oskari artifacts are downloaded from oskari.org Maven repository:

 	<repositories>
        <repository>
            <id>oskari_org</id>
            <name>Oskari.org release repository</name>
            <url>http://oskari.org/nexus/content/repositories/releases/</url>
        </repository>
        <repository>
            <id>oskari_org_snapshot</id>
            <name>Oskari.org snapshot repository</name>
            <url>http://oskari.org/nexus/content/repositories/snapshots/</url>
        </repository>
 	</repositories>

## 3. Build

This will build your webapp and include your code on top of the Oskari-server.

    cd oskari-server-extension
    mvn clean install

## 4.Deploy to servers

Copy the war packages from under `oskari-server-extension/webapp-map/target/` and `oskari-server-extension/webapp-transport/target/` to your servers deploy folder `{JETTY_HOME}/webapps`
