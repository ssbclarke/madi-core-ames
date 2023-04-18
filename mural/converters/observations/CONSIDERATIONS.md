# Considerations

* Redis vs TxtAI vs BigQuery for vector Search
    * TxtAI is deployable on serverless
        * requires complex caching and cloud storage saves
    * Redis is more standard (and probably performant)
        * must be self hosted, which may be costly for usage that is bursted
    * BigQuery is a managed service, but has no explicit hnsw index capability  