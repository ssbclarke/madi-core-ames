
/v1/
    /observations
        # clean (open AI, grammar correction)
        # fill (open AI, fill in missing info)
        # summarize (open AI, create title and summary text)
        # createEmbedding (open AI)
        .sources    string[]
        .summary    string
        .trends     foreignKey[] @trends
        .images     foreignKey[] @trends
        .quotes     string[]
        .actors     string[]
        .solutions  string[]
        .createdBy  foreignKey @user
        .deletedBy  foreignKey @user
        .updatedBy  foreignKey @user
        .createdOn  datetime
        .deletedOn  datetime
        .updatedOn  datetime

    /trends
    /users
    /scenarios
    /prompts
    /reports
    /investigations

    /actors (optional)

    # TABLE INTERNAL
    /images 
    /observations_observations
    /obersvations_trends
    /observations_scenarios
    /observations_investigations
    /trends_trends
    /prompts_trends

    # PROCESS INTERNAL
    /categories
    /subcategories
    /needs
    /ilities

    /sources (serves as a cache)
        # fetch (parser)
        # summarize (open AI, create title and summary text)
    
    # PROCESS INTERNAL
    /

    # PROXIES INTERNAL
    /openai/
    /