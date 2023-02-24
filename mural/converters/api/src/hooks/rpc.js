const { Unprocessable } = require('@feathersjs/errors');
// parses URL for an RPC verb (between ':' and '?'), 
// extracts and saves it to context.params
// and reattaches any query params to the URL

module.exports = {
    default: function parseRpcVerbFromUrl(allowedRpcVerbs='any'){
        return (req, res, next)=>{
            const { url } = req;

            const allowAny = allowedRpcVerbs === 'any'

            const colonIdx = url.indexOf(':');
            const queryStartIdx = url.indexOf('?');

            // RPC verb is found in '/path/id:__**here**__?query=params'
            // if found (indexof(':') > 0), the below logic
            // removes ':' + {rpc-verb} and assigns it to 
            // req.feathers.rpcVerb (referenced elsewhere with (context || ctx).params.rpcVerb)
            // and then reattaches any queries to the url
            if (colonIdx > 0) {
                req.url = url.slice(0, colonIdx);
                req.feathers.rpcVerb = url.slice(
                    colonIdx + 1, queryStartIdx > 0 ? queryStartIdx : undefined
                );

                // validate allowed verbs, otherwise throw 422 Unprocessable error
                if (!allowAny || !allowedRpcVerbs.includes(req.feathers.rpcVerb)) {
                    throw new Unprocessable('Invalid RPC verb');
                }

                if (queryStartIdx > 0) {
                    req.url = req.url + url.slice(queryStartIdx);
                }
            }

            next();
        }
    }
}