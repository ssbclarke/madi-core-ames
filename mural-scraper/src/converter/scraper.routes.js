const express = require("express");
let router = express.Router();
const config = require('../config')
const axios = require('axios');
const populateMadiTypeField = require("./populateMadiTypeField");
const addArrowRelations = require("./addArrowRelations");
const stripOrphans = require("./stripOrphans");
const buildSources = require("./buildSources");

function redirectToAuth(req,res){
  let state = req.query.state ? req.query.state.toString() : undefined;
  let query = req.query
  query = new URLSearchParams();
  query.set("redirectUri", req.protocol + '://' + req.get('host') + req.originalUrl)
  if (state) {
    query.set("state", state);
  }
  res.redirect(302, `${config.authUri}?${query}`);
}


async function requestWidgets(query, authToken, storage = [], next){
  let requestConfig = {
    method: 'get',
    url: `${config.apiBase}/api/public/v1/murals/${query.actId}.${query.muralId}/widgets`,
    headers: { 
      'accept': 'application/json', 
      'Authorization': `Bearer ${authToken}`
    }
  };
  let localConfig = Object.assign({},requestConfig)
  if(next){
    localConfig.url = localConfig.url+`?next=${next}`
  }
  return axios(localConfig)
    .then(function (response) {
      let { next, value } = response.data
      if(next){
        console.log('fetching next: ', next, value.length)
        storage.push(...value)
        return requestWidgets(query, authToken, storage, next)
      }else{
        return storage
      }
    })
    .catch(function (error) {
      console.log(error);
    });


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

      if(!query.actId){
        res.send("Your initial query must include Account ID (actId) in the url parameters.")
      }
      if(!query.muralId){
        res.send("Your initial query must include the Mural ID (muralId) in the url parameters.")
      }

      // if it doesn't have an auth token, redirect to auth.
      if(!authToken){
        redirectToAuth(req,res)
      }else{
        let widgets = await requestWidgets(query, authToken);
        let raw = {widgets}
        let typed = populateMadiTypeField({}, raw)
        let arranged = addArrowRelations(typed,raw)
        let sourced = buildSources(arranged)
        let { observations, orphans } = stripOrphans(sourced)
        // console.log({ observations, orphans })
        res.header("Content-Type",'application/json');
        res.send(JSON.stringify({observations, orphans},null,2))
      }
    }
);

module.exports = router