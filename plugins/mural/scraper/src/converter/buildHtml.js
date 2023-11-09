


function buildHtml(actId, muralId, data){
    // decide where we are redirecting after being authenticated.
    
    let parserResponse = ""
    if(actId &&  muralId ){
        parserResponse = `
            <div class="px-2">
                Account: ${actId}
                <br/>
                Mural ID: ${muralId}
            </div>
        `
    }

    let dataResponse = ''
    if(data){
        dataResponse = `
        <h3 class="h3">Data:</h3>
        <button id="save">Save</button>
        <script>
        function saveTextAsFile()
        {
            var textToWrite = document.getElementById('muraldata').innerText;
            var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
            var fileNameToSaveAs = "mural-data.txt";
        
            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null)
            {
                // Chrome allows the link to be clicked
                // without actually adding it to the DOM.
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            else
            {
                // Firefox requires the link to be added to the DOM
                // before it can be clicked.
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = function(){
                	document.body.removeChild(downloadLink);
                };
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
        
            downloadLink.click();
        }
    
        var button = document.getElementById('save');
        button.addEventListener('click', saveTextAsFile);

        </script>
        <pre id="muraldata">${JSON.stringify(data,null,2)}</pre>
        `
    }

    let url = 'https://app.mural.co/t/mtcleverest3967/m/mtcleverest3967/1660683804692/38f361c7e6640a55066d88d828ecbf2409fabed7'
    let response = `
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
    <body >
    
        <div class="container mx-auto p-4">
            <h1 class="h1">Mural Data Fetcher</h1>
            <form action="/submit" method="POST">
                <div>
                    <label for="to">Mural Address?</label>
                    <input name="mural" id="mural" value="${url}" type="text"  class="w-full bg-white pl-2 text-base font-semibold outline-0" placeholder="Enter Mural Url"  />
                </div>
                <div>
                    <input type="submit" value="Submit"></input>
                </div>
            </form>
            ${parserResponse}
            ${dataResponse}
        </div>
    </body>
    </html>
    `

    return response
}

module.exports = buildHtml