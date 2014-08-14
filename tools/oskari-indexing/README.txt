1) Install: 
* Apache Nutch 1.8 http://nutch.apache.org/
* Solr 4.9 http://lucene.apache.org/solr/

2) Configuration between the two: Replace solr/example/solr/collection1/conf/schema.xml with nutch/conf/schema-solr4.xml

3) Configuring indexing
See attached solr/nutch dirs for premade configs
Based on xpaths to get H1 tags as articleTitle and div with class 'main-content' as articleContent (ignoring header/footer): 
* See http://www.atlantbh.com/precise-data-extraction-with-apache-nutch/
* fixed plugin: https://github.com/ZakarFin/nutch-plugins.git
* plugin is built with maven:
  - mvn clean install
  - mvn assemly:single
* target folder has needed jar-files in zip + xpath-filter-1.4-RELEASE.jar
* unzip jars and plugin.xml to nutch/plugins/xpath-filter with xpath-filter-1.4-RELEASE.jar renamed to xpath-filter.jar (referenced in plugin.xml)

4) Startup SOLR (defaults to http://localhost:8983/solr/ change parameter for crawl if different)

Run "java -jar start.jar" in ${SOLR_HOME}/example

5) Start crawling with Nutch

Run "bin/crawl oskari.urls <anything> http://localhost:8983/solr/ 3" in ${NUTCH_HOME} where
 * oskari.urls refers to file in ${NUTCH_HOME}
 * <anything> is crawldb name (like "moi" or "oskari")
 	- to start fresh -> keep changing this
 	- to keep previous result as basis -> use the same one each time
 * 3 is depth for crawling, bigger == slower == more results

 6) Checkout the results in SOLR

 http://localhost:8983/solr/#/collection1/query