const express = require("express");
let router = express.Router();
const config = require('../config')
const axios = require("axios");

/**
 * If someone has not been authenticated, you can request a url from this endpoint to redirect them to
 * first. You can optionally pass a `state` query parameter and a `redirectUri` query parameter.
 * @param state
 * @param redirectUri
 */
router.get(
  "/auth",
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  (req, res) => {
    // decide where we are redirecting after being authenticated.
    const redirectUri = req.query.redirectUri
      ? req.query.redirectUri.toString()
      : undefined;
    // is there any state that needs to be passed through the auth process
    const state = req.query.state ? req.query.state.toString() : undefined;
    const query = new URLSearchParams();
    query.set("client_id", config.clientId);
    query.set("redirect_uri", config.redirectUri);
    query.set("response_type", "code");

    console.log(config)
    if (state) {
      query.set("state", state);
    }

    if (config.scopes && config.scopes.length) {
      query.set("scope", config.scopes.join(" "));
    }
    // This will return a url string that will allow you to authenticate your app
    // and it can also redirect back to your client application
    res.cookie('redirectUri', redirectUri)
    res.redirect(302, `${config.authorizationUri}?${query}`);
  }
);

function setCookieAndRedirect(data, redirect, res){
  res.cookie("access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  .cookie("refresh_token", data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  .redirect(302, redirect);
}

router.get(
    '/auth/token',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (
        req,
        res,
    ) => {

      // console.log(req)
      // console.log(req.cookies)
      // console.log(req.protocol)
      // console.log(req.hostname)
      // console.log(req.cookies.redirectUri || req.protocol+'://'+req.hostname+'/')

      const redirectUrl = new URL(req.cookies.redirectUri || req.protocol+'://'+req.hostname+'/');

      // console.log(req.cookies.redirectUri, redirectUrl.href);

      const payload = {
        data: {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: req.query.code,
          grant_type: 'authorization_code',
          redirect_uri: req.query.redirectUri || config.redirectUri,
        },
        method: 'POST',
        url: config.accessTokenUri
      };

      const response = await axios.request(payload);
      if (response.status !== 200) {
        throw 'token request failed';
      }

      return setCookieAndRedirect(response.data, redirectUrl.href, res)


    },
);

router.get(
    '/auth/refresh',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {

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

      const response = await axios.request(payload);
      if (response.status !== 200) {
        console.error('REFRESH TOKEN REQUEST FAILED. CLEARING COOKIES AND STARTING OVER.')
        res.clearCookie('refresh_token')
          .clearCookie('auth_token')
          .redirect('/auth')
        // throw 'refresh token request failed';
      }
      
      return setCookieAndRedirect(response.data, req.cookies.redirectUri, res)
    },
);

module.exports = router