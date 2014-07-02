# Using pre-compiled maven artifacts

This document describes how to use maven artifacts provided in Oskari Maven repository to build the oskari-map webapp.

### Assumes pre-installed:

* JDK 1.7+ (tested with Oracle Java 1.7.0_51 and 1.8.0_05)
* [Maven 3+](http://maven.apache.org/) (tested with 3.0.5)

## 1. Create your maven project

Edit the `pom.xml` in `<work-dir>/my-app`.

Add Oskari.org as repository:

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

Add some Oskari artifact as dependency:

    <dependencies>
        <dependency>
            <groupId>fi.nls.oskari</groupId>
            <artifactId>map-servlet</artifactId>
            <version>${oskari.version}</version>
        </dependency>
    </dependencies>

Add oskari.version property for easy updating:

    <properties>
    	<oskari.version>1.23-SNAPSHOT</oskari.version>
    </properties>

## 2. Add JSPs and web.xml to your webapp

The default setup uses index.jsp as default page so you should include at least that. This is configurable/view in the database (portti_view.page).

You can take a look at oskari-server/webapp-map for examples:

* web.xml: https://github.com/nls-oskari/oskari-server/blob/master/webapp-map/env/default/WEB-INF/web.xml
* JSP: https://github.com/nls-oskari/oskari-server/tree/master/webapp-map/src/main/webapp

## 3. Build

This will build your webapp and use the Oskari artifacts from oskari.org repository.

    cd <work-dir>/my-app
    mvn clean install

## 4.Deploy to servers

Copy the war package from under `<work-dir>/my-app/target/` to your servers deploy folder `{jetty.home}/webapps` (or `{tomcat.home}/webapps`)

## Example

[Download](/build/server/example-oskari.zip) a premade package for this webapp