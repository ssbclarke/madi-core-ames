const express = require("express");
let router = express.Router();
const config = require('../config')
const axios = require('axios');

/**
 *
 * @param {Array} widgetsArray
 */
function rebuildData(widgetsArray){

}



router.get(
    '/converter',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      let state = req.query.state ? req.query.state.toString() : undefined;
      let query = req.query
      let authToken = req.query.accessToken;

      // console.log("QUERY", req.query)
      // if it doesn't have an auth token, redirect to auth.
      if(!authToken){
        query = new URLSearchParams();
        query.set("redirectUri", req.protocol + '://' + req.get('host') + req.originalUrl)
        if (state) {
          query.set("state", state);
        }
        res.redirect(302, `${config.authUri}?${query}`);
      }


      let stored_elements = []
      let requestConfig = {
        method: 'get',
        url: `${config.apiBase}/api/public/v1/murals/${query.actId}.${query.muralId}/widgets`,
        headers: { 
          'accept': 'application/json', 
          'Authorization': `Bearer ${authToken}`
        }
      };
      async function requestWidgets(next){
        let localConfig = Object.assign({},requestConfig)
        if(next){
          localConfig.url = localConfig.url+`?next=${next}`
        }
        return axios(localConfig)
          .then(function (response) {
            let { next, value } = response.data
            if(next){
              console.log('fetching next: ', next, value.length)
              stored_elements.push(...value)
              return requestWidgets(next)
            }else{
              return stored_elements
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      if(query.actId && query.muralId && authToken){
        let final_elements = await requestWidgets();
        let convertedElements = rebuildData(final_elements);
        res.send(convertedElements)

      }else{
        res.send("Your initial query must include Account ID (actId) and the Mural ID (muralId).")
      }

      
    },
);

module.exports = router