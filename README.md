# DATA DICTIONARY TOOL


## Deployment:

#### **Docker Build and Push - TEST SERVER:**

1. `docker build -t geotab-bi/datadictionary:test .`

2. `docker tag geotab-bi/datadictionary:test gcr.io/geotab-bi/datadictionary:test`

3. `docker push gcr.io/geotab-bi/datadictionary:test`
