# Cloud SQL Connections

This readme documents how to connect to Cloud SQL instances, given the firewall restrictions that may be in place for internal users.


## Download the proxy
    
    https://cloud.google.com/sql/docs/postgres/sql-proxy


```shell
    # Mac M1
    curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.9.0/cloud-sql-proxy.darwin.arm64
    chmod +x cloud-sql-proxy
```

## Run the Proxy
```shell
    ./cloud-sql-proxy --address 0.0.0.0 --port 1234 INSTANCE_CONNECTION_NAME

    ./cloud-sql-proxy --address 0.0.0.0 --port 1235 --private-ip --credentials-file ./terraform/credentials.json hq-madi-dev-4ebd7d92:us-east4:postgres-hq-madi-dev-4ebd7d92-28e2

    # ./cloud-sql-proxy --address 0.0.0.0 --port 1235 --credentials-file ./terraform/credentials.json hq-madi-dev-4ebd7d92:us-east4:postgres-hq-madi-dev-4ebd7d92-28e2

    ./cloud-sql-proxy --private-ip --credentials-file ./credentials.json --port 3306 hq-madi-dev-4ebd7d92:us-east4:postgres-hq-madi-dev-4ebd7d92-28e2 


    gcloud compute ssh --zone "us-east4-a" "bastion-vm" --tunnel-through-iap --project "hq-madi-anchor-proj-654cb100"

    gcloud compute ssh --zone us-east4-a bastion-vm --tunnel-through-iap --project hq-madi-anchor-proj-654cb100 -- -N -L 3306:localhost:3306


    gcloud sql connect --project hq-madi-dev-4ebd7d92  --credentials-file ./credentials.json postgres-hq-madi-dev-4ebd7d92-28e2


    gcloud auth login

    # Copy and paste the code

    gcloud config set project hq-madi-dev-4ebd7d92


    psql "host=localhost port=5432 user=postgres dbname=main"


    ./cloud-sql-proxy --private-ip --credentials-file ./credentials.json --port--instances=hq-madi-dev-4ebd7d92:us-east4:postgres-hq-madi-dev-4ebd7d92-28e2=tcp:5432
```



<!-- 
```shell
gcloud auth login;
gcloud config set project hq-madi-dev-4ebd7d92;
 ../../cloud-sql-proxy --private-ip  --port 3307 hq-madi-dev-4ebd7d92:us-east4:postgres-hq-madi-dev-4ebd7d92-28e2 

 gcloud compute ssh --zone us-east4-a bastion-vm --tunnel-through-iap --project hq-madi-anchor-proj-654cb100 -- -N -L 3306:localhost:3306
``` -->



# Run the following commands
Open a terminal window and run the following commands

# Step 1 - Establishing SSH tunnel to Bastion VM
 ```shell
ANCHOR_PROJ_ID=hq-madi-dev-4ebd7d92
ZONE=us-east4-a
gcloud compute ssh bastion-vm --tunnel-through-iap --project=$ANCHOR_PROJ_ID --zone=$ZONE
```

You should see `Last login: Fri Mar  8 15:34:19 2024 from 35.235.241.225`

# Step 2 - From inside the Bastion VM
```shell
# DB_PROJ_ID=hq-madi-dev-4ebd7d92
# INSTANCE_ID=postgres-hq-madi-dev-4ebd7d92-28e2 
# ../../cloud-sql-proxy --private-ip  --port 3307 "${DB_PROJ_ID}:${ZONE}:${INSTANCE_ID}"
INSTANCE_LOC=hq-madi-dev-4ebd7d92:us-east4:postgres-hq-madi-dev-4ebd7d92-28e2 
../../cloud-sql-proxy --private-ip  --port 3307 $INSTANCE_LOC
 ```

 You should see `The proxy has started successfully and is ready for new connections!`

# Step 3 - Create tunnel from local machine via second SSH connection.
Open a new terminal tab.  Keep the Bastion VM proxy thread running.  Run the following in a new tab
```shell
gcloud compute ssh bastion-vm --tunnel-through-iap --project=$ANCHOR_PROJ_ID --zone=$ZONE -- -N -L 3307:localhost:3306
```

This will create a local port on your machine 3306 that is mapped to the cloud proxy port of 3307 through SSH.  The proxy is connected, inside the VPC, to the database.

