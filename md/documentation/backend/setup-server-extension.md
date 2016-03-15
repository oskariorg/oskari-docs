# Create a custom Oskari-server extension

This document describes how to use maven artifacts provided in Oskari Maven repository to build customized Oskari-server.

### Requirements

* JDK 1.7+ (tested with Oracle Java 1.7.0_51 and 1.8.0_05)
* [Maven 3+](http://maven.apache.org/) (tested with 3.0.5)
* [Jetty bundle](/download) installed

## 1. Template maven project

[Download](https://github.com/nls-oskari/oskari-server-extension-template) a template for the webapp

## 2. Start modifying the content

- Edit the `pom.xml`s to change the groupId/artifactId and [oskari.version](https://github.com/nls-oskari/oskari-server-extension-template/blob/ba7fffa3fc4bf7c378ba51edd988131fb0abebaa/pom.xml#L13).
- Edit the `pom.xml`s to add/change the included dependencies
- Edit the app-resources to configure app-myapp.json/myapp-view.json/mylayer.json. These are used by default since webapp-map overrides app-default.json.
- Edit the myapp.jsp under webapp-map to modify the base HTML.
- Create your own action routes like [MyAction](https://github.com/nls-oskari/oskari-server-extension-template/blob/master/server-extension/src/main/java/my/app/MyActionHandler.java) under server-extension.

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

**Note!** You will need to adjust oskari-ext.properties accordingly. For example if you only add one view, the id of that view should be the default view in oskari-ext.properties OR you can remove the default view configuration so it will use the view type "DEFAULT" on database to detect the default view.

## Examples

- ELF: https://github.com/elf-oskari/oskari-server-extensions
- ASDI: https://github.com/arctic-sdi/oskari-server-extensions