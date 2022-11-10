const express = require("express");
let router = express.Router();
const config = require('../config')
const axios = require("axios");



export function setCookieAndRedirect(data, redirect, res){
  res.cookie("access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  .cookie("refresh_token", data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  if(redirect){
    res.redirect(302, redirect);
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
    const { originUri } = req.query //.originUri ? req.query.originUri.toString() : undefined;

    
    // is there any state that needs to be passed through the auth process
    const query = new URLSearchParams(req.query)
    query.set("client_id", config.clientId)
    query.set("redirect_uri", config.base + config.auth.tokenUri) // where the authorizer callsback
    query.set("response_type", "code")
    query.set("scope", config.mural.scopes?.join(" "));

  
    // This will return a url string that will allow you to authenticate your app
    // and it can also redirect back to your client application
    return res.cookie('originUri', originUri)
    .redirect(307, `${config.mural.base + config.mural.authorizationUri}?${query}`);
  }
);







export async function requestToken(req){
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
  return await axios.request(payload);
}
router.get(
    config.auth.tokenUri, //'/auth/token',
    async (
        req,
        res,
    ) => {
      console.log('\n\n/auth/token')
      console.log("cookies", req.cookies)
      const originUri = new URL(req.cookies.originUri || config.base);
      let response = await requestToken(req) 
      return setCookieAndRedirect(response.data, originUri.href, res)
    }
);



export async function requestRefresh(req){
  const payload= {
    data: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: req.cookies.refresh_token,
      scope: config.scopes,
    },
    method: 'POST',
    url: config.refreshTokenUri,
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
      // let redirect = false;

      // // const originUri = req.query.originUri
      // // ? req.query.originUri.toString()
      // // : undefined;

      // const state = req.query.state ? req.query.state.toString() : undefined;
      // const query = new URLSearchParams();
      // query.set("redirectUri", config.appBase + redirectUri);
      // console.log('redirectUri', config.appBase + redirectUri)
      // console.log('\n\nREFRESHING TOKEN')


      // .catch(e=>{
      //   redirect = true
      //   console.error('REFRESH TOKEN REQUEST FAILED. CLEARING COOKIES AND STARTING OVER.')
      //   res.clearCookie('refresh_token')
      //     .clearCookie('auth_token')
      //     res.redirect(302, `/auth?${query}`);
      // })
      // if(!redirect){
        return setCookieAndRedirect(response.data, null, res)
      // }
    },
);

module.exports = router