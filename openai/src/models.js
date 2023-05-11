




async function buildDiscriminatorPrompt(context, question, random=false, related=false){
    if(random){
        if(!related){
            // search for random context not from same doc
            let randomContext = searchRelated(context)
            return { "prompt": randomContext + "\nQuestion: " + question.slice(2).trim() + "\n Related:", "completion": " no"}    
        }else{
            // search for related context not from same doc
            let relatedContext = searchRelated(context)
            return { "prompt": relatedContext + "\nQuestion: " + question.slice(2).trim() + "\n Related:", "completion": " no"}
        }
    }else{
        // use the original context 
        return { "prompt": context + "\nQuestion: " + question.slice(2).trim() + "\n Related:", "completion": " yes"}
    }
}

async function buildQAPrompt(context, question, answer, random=false, related=false){
    if(random){
        if(!related){
            // search for random context not from same doc
            let randomContext = searchRelated(context)
            return { "prompt": randomContext + "\nQuestion: " + question.slice(2).trim() + "\n Answer:", "completion": "  No appropriate information found to answer the question."}

        }else{
            // search for related context not from same doc
            let relatedContext = searchRelated(context)
            return { "prompt": relatedContext + "\nQuestion: " + question.slice(2).trim() + "\n Answer:", "completion": "  No appropriate information found to answer the question."}

        }
    }else{
        // use the original context and answer the question
        return { "prompt": context + "\nQuestion: " + question.slice(2).trim() + "\n Answer:", "completion": " " + answer.slice(2).trim()}
    }
}


async function buildPromptsForChunk(chunk, discriminator, numWrongEasy, numWrongHard){
    let quesCount = chunk.questions
    let rightPrompts = chunk.questions.map((q,i)=>{
        if(discriminator){
            buildDiscriminatorPrompt(chunk.text, q, chunk.answers[i], false, false)
        }else{
            buildQAPrompt(chunk.text, q, chunk.answers[i], false, false)
        }
    })

    let wrongEasyPrompts = Array(numWrongEasy).map((q,i)=>{
        if(discriminator){
            buildDiscriminatorPrompt(chunk.text, q, chunk.answers[i], false, false)
        }else{
            buildQAPrompt(chunk.text, q, chunk.answers[i], false, false)
        }
    })

}