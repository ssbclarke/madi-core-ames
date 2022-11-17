const express = require("express");
let router = express.Router();
const config = require('../config')
const axios = require("axios");



function setCookieAndRedirect(data, redirect, res){
  res.cookie("access_token", data.access_token, {
    // httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  .cookie("refresh_token", data.refresh_token, {
    // httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  if(!!redirect){
    return res.redirect(302, redirect);
  }else{
    return res
  }
}




/**
 * If someone has not been authenticated, you can request a url from this endpoint to redirect them to
 * first. You can optionally pass a `state` query parameter and a `redirectUri` query parameter.
 * @param state
 * @param redirectUri
 */
router.get(
  config.auth.authUri, //"/auth",
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  (req, res, next) => {
    console.log('\n\n/auth',req.query)

    // decide where we are redirecting after being authenticated.
    const originUri = new URL(req.query?.originUri || req.cookies?.originUri || config.base);
    // const { originUri } = req.query //.originUri ? req.query.originUri.toString() : undefined;
    console.log(req.query)
    
    // is there any state that needs to be passed through the auth process
    const query = new URLSearchParams(req.query)
    query.set("client_id", config.clientId)
    query.set("redirect_uri", config.base + config.auth.tokenUri) // where the authorizer callsback
    query.set("response_type", "code")
    query.set("scope", config.mural.scopes?.join(" "));

  
    // This will return a url string that will allow you to authenticate your app
    // and it can also redirect back to your client application
    console.log(`/auth redirect to ${config.mural.base + config.mural.authorizationUri}?${query}`)
    return res.cookie('originUri', originUri)
    .redirect(307, `${config.mural.base + config.mural.authorizationUri}?${query}`);
  }
);







async function requestToken(req){
  const payload = {
    data: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: req.query.code,
      grant_type: 'authorization_code',
      redirect_uri: config.base + config.auth.tokenUri, //same as above
    },
    method: 'POST',
    url: config.mural.base + config.mural.accessTokenUri
  };
  return await axios.request(payload).catch(e=>{

  })
}
router.get(
    config.auth.tokenUri, //'/auth/token',
    async (
        req,
        res,
    ) => {
      console.log('\n\n/auth/token')
      console.log("cookies", req.cookies)
      const originUri = new URL(req.query?.originUri || req.cookies?.originUri || config.base);
      try{
        let response = await requestToken(req)
        return setCookieAndRedirect(response.data, originUri.href, res)
      }catch(e){
        res.status(e.status || 500);
        return res.json({
          message: e.message,
          error: e
        });
      }
    }
);



async function requestRefresh(req){
  const payload= {
    data: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: req.cookies.refresh_token,
      scope: config.scopes,
    },
    method: 'POST',
    url: config.mural.base + config.mural.refreshTokenUri
  };

  return await axios.request(payload)
}

router.get(
    config.auth.refreshUri, //'/auth/refresh',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      console.log('\n\n/auth/refresh')
      console.log("cookies", req.cookies)
      const originUri = new URL(req.query?.originUri || req.cookies?.originUri || config.base);
      res.cookie('originUri', originUri.href)

      // // const originUri = req.query.originUri
      // // ? req.query.originUri.toString()
      // // : undefined;

      // const state = req.query.state ? req.query.state.toString() : undefined;
      // const query = new URLSearchParams();
      // query.set("redirectUri", config.appBase + redirectUri);
      // console.log('redirectUri', config.appBase + redirectUri)
      console.log('\n\nREFRESHING TOKEN')
      console.log('originUri', originUri.href)

      try{
        let response = await requestRefresh(req)
        return setCookieAndRedirect(response.data, originUri.href, res)
      }catch(e){
        console.log('\n\nREFRESHING TOKEN ERROR')
        console.log(e)
        res.status(e.status || 500);
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify({
          message: e.message,
          error: e,
          response: e.response
          // data:e.response.data
        },null,4));
      }
    },
);

module.exports = router