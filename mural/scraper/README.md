This file converts a series of "dogbone" structures from a mural link to a yml or json file with the appropriate data.

To become familiar with the Mural API check out the follwoing resources:
* https://developers.mural.co/public/docs/testing-with-postman
* https://developers.mural.co/public/docs/basic-information-page 
* https://developers.mural.co/public/reference/murals 

Make sure to create a /config/{env}.json like /config/production.json to store secret vars injected at build.  For example,
you probably need atleast a client_secret in the production.json like so:
```json
{ 
    "client_secret": "XXXXXXXXXXXX"
}
```

This client secret is provided by the mural.co app.


