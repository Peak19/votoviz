# Overview
This directory should contain everything you need to Solr index against the VOTO survey schema. Right now this indexes survey titles and question text, and returns survey name and survey id.

# To install
1. Install solr-tomcat (if you're on Ubuntu). On other distros, read the docs here: http://wiki.apache.org/solr/SolrTomcat

2. Install the files in this directory to /etc/solr/conf/

3. Install the MySQL JDBC connector to /usr/share/tomcat6/lib/

4. Add your database connection details to /etc/solr/conf/data-config.xml 

5. Modify /etc/solr/conf/solrconfig.xml and add the following in the requestHandlers tag:

```
   <requestHandler name="/dataimport" class="org.apache.solr.handler.dataimport.DataImportHandler">
    <lst name="defaults">
      <str name="config">/etc/solr/conf/data-config.xml</str>
    </lst>
  </requestHandler>
```
6. Run the following to allow storing offsets:

```
touch /etc/solr/conf/dataimport.properties
chown tomcat6 /etc/solr/conf/dataimport.properties
```

7. Restart tomcat with /etc/init.d/tomcat6 restart

8. To index the whole database (bring the surveys into Solr), browse to http://<Solr host>:8080/solr/dataimport?command=full-import 
