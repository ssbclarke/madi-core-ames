const express = require("express");
let router = express.Router();
const axios = require('axios');
const rateLimit = require('axios-rate-limit');

const config = require('../config')

const populateMadiTypeField = require("./helpers/populateMadiTypeField");
const addArrowRelations = require("./helpers/addArrowRelations");
const stripOrphans = require("./helpers/stripOrphans");
const buildSources = require("./helpers/buildSources");
const requestWidgets = require('./helpers/requestWidgets')
const buildHtml = require('./helpers/buildHtml')

const throttledAxios = rateLimit(axios.create(), { maxRPS: 24 })


function checkAuth(req,res){
  const token = req.cookies.access_token;
  if(!token){
    redirectToAuth(req,res)
  }
  console.log('Authenticated!')
  return token
}

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


/* THE FLOW
    /converter
      if(cookieAuth = true)
        send html response
      else
        send to /auth
        set cookieAuth
        redirect to /converter
*/



router.get(
    '/converter',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      // let state = req.query.state ? req.query.state.toString() : undefined;
      let { path, query={} } = req
      let { mural, actId, muralId } = query
      let data = {}

      // if it doesn't have an auth token, redirect to auth.
      let authToken = checkAuth(req, res)
      
      // if it only has a raw mural element, redirect back with new url
      if(mural && !actId && !muralId){
        let regex = /\/m\/(.*?)\/(.*?)\//gm
        let matches = [...mural.matchAll(regex)][0]
        actId = matches[1]
        muralId = matches[2]
        res.redirect(`${path}?${new URLSearchParams({actId, muralId}).toString()}`)
      }

      // if it has a mural and account id, fetch the widgets
      if(muralId && actId) {
        
        let widgets = await requestWidgets(query, authToken).catch(e=>{
          console.log('\n\n**** ERROR ****')
          console.log(e.config.url)
          console.log(e.message)
          console.log(e.response.status)
          if(e.response.status === 401){
            res.clearCookie('auth_token')
              .redirect(`/auth/refresh`)
          }else{
            res.send(e)
          }
        })
        let raw = {widgets}
        let typed = populateMadiTypeField({}, raw)
        let arranged = addArrowRelations(typed,raw)
        let sourced = buildSources(arranged) 
        let { observations, orphans } = stripOrphans(sourced)
        let errorIds = getErrorIds(observations, orphans)
        // let errorPromises = errorIds.map(id => {
        //   return updateSticky(req, id)
        // })
        // await Promise.all(errorPromises)
        // // console.log(errorPromises)
        // console.log({ observations, orphans })
        
        data = {
          observations, orphans, errorIds
        }
      }
      
      res.send(buildHtml(req.path, req.query, data))




      // console.log('sending response')




    }
);


function getErrorIds(observations, orphans){
  let orphanIds = Object.keys(orphans)
  let obsvIds = Object.keys(observations).reduce((agg, id, index)=>{
    if(observations[id].errors && observations[id].errors.length > 0){
      agg.push(id)
    }
    return agg
  },[])
  return [...orphanIds, ...obsvIds]
}

async function updateSticky(req, id, update){
  let query = req.query
  let authToken = req.query.accessToken;

  update = update || {"style":{"backgroundColor":"#FF0000FF","border":true}}
  var data = JSON.stringify(update);

  let requestConfig = {
    method: 'patch',
    url: `${config.apiBase}/api/public/v1/murals/${query.actId}.${query.muralId}/widgets/sticky-note/${id}`,
    headers: { 
      'accept': 'application/json', 
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    data : data
  };
  return throttledAxios(requestConfig)
    .then(()=>{
      console.log('marking ', id)
    })
    .catch(error=>{
      if(error.response && error.response.status !== 429 ){
        console.error(id, error.message)
      }
    })
}


router.post(
  '/modifier',
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
      res.send(JSON.stringify({
        observations, orphans
      },null,2))
    }
  }
);

module.exports = router