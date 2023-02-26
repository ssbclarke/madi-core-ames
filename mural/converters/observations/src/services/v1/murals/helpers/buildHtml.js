function buildHtml(path, query, data){
    // decide where we are redirecting after being authenticated.
    
    let parserResponse = ""
    if(query.actId && query.muralId){
        let params = new URLSearchParams(query).toString()
        parserResponse = `
            <div>
                Account: ${query.actId}
            <div>
            <div>
                Mural ID: ${query.muralId}
            </div>
            <div>
                <a href="${path}?${params}"> ${path}?${params}</a>
            </div>
        `
    }

    let dataResponse = ''
    if(data){
        dataResponse = `
        <h3>Data:</h3>
        <pre>${JSON.stringify(data,null,2)}</pre>
        `
    }

    let url = 'https://app.mural.co/t/mtcleverest3967/m/mtcleverest3967/1660683804692/38f361c7e6640a55066d88d828ecbf2409fabed7'
    let response = `
    <div>
        <form action="/submit" method="POST">
            <div>
                <label for="to">Mural Address?</label>
                <input name="mural" id="mural" value="${url}" />
            </div>
            <div>
                <button>Send</button>
            </div>
        </form>
        ${parserResponse}
        ${dataResponse}
    </div>
    `

    return response
}

module.exports = buildHtml