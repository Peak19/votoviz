votoviz
=======

Search and visualization for Voto's mobile survey results. Built at Canadian Development Hackathon 2013. 

##API
The REST API is a simple Sinatra app with two features:

- GET /surveys without arguments lists all the surveys. 
With the text parameter provides a search interface which searches Solr for all surveys containing the specified terms
- GET /surveys/survey_id gives all the details of the survey with the given id.
With the segments parameter, you can specify a JSON array of objects containing a question_id and a response_id. 
The results will only include users who gave the specific answers to the given questions. This allows you to segment the population based on demographic questions, for instance.

Note: The REST API is currently configured to use PostgresSQL. It should be trivial to use other databases, there's nothing Postgres-specific in the query

##Frontend
Included are two sample consumers of the REST API:

- index.html is a simple search interface
- survey.html provides a stacked bar-graph visualization of the data. Clicking on a given segment of the bar will filter by that segment.

##Solr
The solr_config directory includes a sample schema and solrconfig to pull data from the database and index it. See the Solr-specific README.me for details
