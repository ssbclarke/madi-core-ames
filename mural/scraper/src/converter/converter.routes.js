const express = require("express");
let router = express.Router();
const axios = require('axios');
const rateLimit = require('axios-rate-limit');

const config = require('../config')

// const populateMadiTypeField = require("./helpers/populateMadiTypeField");
// const addArrowRelations = require("./helpers/addArrowRelations");
// const stripOrphans = require("./helpers/stripOrphans");
// const buildSources = require("./helpers/buildSources");
const requestWidgets = require('./requestWidgets')
const buildHtml = require('./buildHtml')
// const updateSticky = require('./helpers/updateSticky');
// const { workerData } = require("worker_threads");

// const throttledAxios = rateLimit(axios.create(), { maxRPS: 24 })
// let redirect = false;

// returns exit?
function isAuthenticated(req){
  return !!(req.cookies.access_token && req.cookies.refresh_token)
}

function useRedirect(res, path, download){
  if(download){
    // res.set({
    //   'Location': path
    // });
    res.set({
      'Content-Type': 'text/plain',
      'Location': path
    });
    res.end(download);
  }
  return res.redirect(303, path);
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

router.get('/download', (req, res) => {
  var text = 'Hello world!'
  res.attachment('filename.txt')
  res.type('txt')
  res.send(text)
})

router.get('/converter/:actId/:muralId',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
  async (req, res) => {
    console.log('IN THE NEW ROUTE')
    await requestWidgets(req.params.actId, req.params.muralId, req.cookies.access_token)
    .then((data)=>{
      return res.send(buildHtml(req.params.actId, req.params.muralId, data))
    })
    .catch(e=>{
      // response: {
      //   status: 401,
      //   statusText: 'Unauthorized',
      if(e && e.response && e.response.status === 401){
        console.log('NOT AUTHED')
        return useRedirect(res,`${config.auth.authUri}`)
      }
      else {
        console.log('OTHER ERROR', e)
        throw new Error(e)
      }
    })
  }
)


router.post('/submit',
  async (req, res) => {
    let { path, body={} } = req
    // console.log('Got body:', req.body);
    let { mural } = body
    let regex = /\/m\/(.*?)\/(.*?)\//gm
    let matches = [...mural.matchAll(regex)][0]
    let actId = matches[1]
    let muralId = matches[2]
    console.log(`REDIRECTING /converter/${actId}/${muralId}}`)
    
    return useRedirect(res, `/converter/${actId}/${muralId}`)
  }
)

router.get('/', (req, res) => useRedirect(res, `/converter`))

router.get(
    '/converter',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      // console.log('SENDING',req.path, req.query, data)
      return res.send(buildHtml())
    }
);

      // console.log(`\n\n${req.originalUrl}`)
      // let state = req.query.state ? req.query.state.toString() : undefined;
      // let { path, query={} } = req
      // let { mural, actId, muralId } = query
      // let redirect = false
      // let originUri = req.headers['x-forwarded-proto'] + '://' + req.headers['x-forwarded-host'] + req.originalUrl

      // console.log(query)



      // // if coming from submit, redirect back with new url
      // console.log('hasMuralOnly', !!(mural && !actId && !muralId))
      // if(mural && !actId && !muralId){
      //   let regex = /\/m\/(.*?)\/(.*?)\//gm
      //   let matches = [...mural.matchAll(regex)][0]
      //   actId = matches[1]
      //   muralId = matches[2]
      //   return useRedirect(res, `${path}?${new URLSearchParams({actId, muralId}).toString()}`)
      // }



      // // if it doesn't have an auth token, redirect to auth.
      // console.log('isAuthenticated', isAuthenticated(req))
      // if(!isAuthenticated(req)){
      //   let query = (new URLSearchParams(req.query))
      //   query.set("originUri", originUri)

      //   console.log('REDIERCT TO AUTH query', query.toString())
      //   return useRedirect(res,`${config.auth.authUri}?${query}`)
      // }
      

      // // if it has a mural and account id, fetch the widgets
      // if(muralId && actId) {
      //   try{
      //     // let redirect = false


      //     let widgets = require('./widgets.json')
      //     console.log(widgets)

      //     // let widgets = await requestWidgets(query, req.cookies.access_token)
      //     // try {
      //     //   fs.writeFileSync('./widgets.json', JSON.stringify(widgets,null,2));
      //     //   // file written successfully
      //     // } catch (err) {
      //     //   console.error(err);
      //     // }


      //     // console.log("\n\n **** NO REDIRECT ****")
      //     // let raw = { widgets }
      //     // let typed = populateMadiTypeField({}, raw)
      //     // let arranged = addArrowRelations(typed,raw)
      //     // let sourced = buildSources(arranged) 
      //     // let { observations, orphans } = stripOrphans(sourced)
      //     // let [ errorIds ] = getErrorIds(observations, orphans)
      //     // let errorPromises = errorIds.map(id => {
      //     //   return updateSticky(req, id, null, throttledAxios)
      //     // })
      //     // await Promise.all(errorPromises)
      //     // console.log(errorPromises)
      //     // console.log({ observations, orphans })
      //     // data = {
      //     //   observations, orphans, errorIds
      //     // }
      //     return 
      //   }catch(e){
      //     console.error(`\n\n**** ERROR ****\n`)
      //     console.error(e.message)
      //     console.error(e.response?.status)
      //     console.error(e.response?.statusText)
      //     // e.response,
      //     console.error(e.response?.config?.url)
      //     // e.response.request.path,
      //     // e.response.data
          
      //     if(e.response?.status === 401){
      //       // redirect = true
      //       console.log('\n\n HEADING TO REFRESH')
      //       // res.clearCookie('access_token')
      //       let params = new URLSearchParams()
      //       params.set('originUri', config.base + req.originalUrl)
      //       console.log(params)
      //       return res.redirect(302, `/auth/refresh?${params}`)
      //     }else{
      //       res.status(e.status || 500);
      //       res.setHeader('Content-Type', 'application/json');
          
      //       return res.send(JSON.stringify({
      //         message: e.message,
      //         // error: e,
      //         data: e?.response?.data || {}
      //       },null,4));
      //     }
      //   }
      // }





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




// router.post(
//   '/modifier',
//   /**
//    *
//    * @param {import('express').Request} req
//    * @param {import('express').Response} res
//    */
//   async (req, res) => {
//     let state = req.query.state ? req.query.state.toString() : undefined;
//     let query = req.query
//     let authToken = req.query.accessToken;

//     if(!query.actId){
//       res.send("Your initial query must include Account ID (actId) in the url parameters.")
//     }
//     if(!query.muralId){
//       res.send("Your initial query must include the Mural ID (muralId) in the url parameters.")
//     }

//     // if it doesn't have an auth token, redirect to auth.
//     if(!authToken){
//       redirectToAuth(req,res)
//     }else{
//       let widgets = await requestWidgets(query, authToken);
//       let raw = {widgets}
//       // let typed = populateMadiTypeField({}, raw)
//       // let arranged = addArrowRelations(typed,raw)
//       // let sourced = buildSources(arranged)
//       // let { observations, orphans } = stripOrphans(sourced)
//       // console.log({ observations, orphans })
//       res.header("Content-Type",'application/json');
//       res.send(JSON.stringify({
//         observations, orphans
//       },null,2))
//     }
//   }
// );

module.exports = router