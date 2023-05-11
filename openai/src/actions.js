import {store, getIdFromText} from './storage.js'
import { search } from './search.js'
import urls from './data/urls.json' assert { type: 'json' };
import { getEmbedding, openai } from './qg.js'



export async function buildData(urls){
    return Promise.all(
        urls.map(
            async url=>{
                let observation = await store.observations.create({id:getIdFromText(url), url})
                console.log(` - Fetching ${url.replace(/https?:\/\//gi,"").slice(0,50)}...`)
                observation     = await store.observations.fetchText(observation.id)
                // console.log(observation.id)
                console.log(` - Chunking ${url.replace(/https?:\/\//gi,"").slice(0,50)}...`)
                let chunks      = await store.observations.buildChunks(observation.id)
                return Promise.all(chunks.map(store.chunks.createVectors))
            }
        )
    ).then(r=>{
        return true
    }).catch(e=>{
        console.log(e)
        return false
    })
    
}



export async function askQuestion(question, answeringModel) {
    let {embedding, tokens} = await getEmbedding(question)
    let query           = await store.queries.create({id:getIdFromText(question),question, embedding, embedding_tokens:tokens})
    let { documents }   = await search(embedding)
    let relatedChunks   = await Promise.all(documents.map(d=>store.chunks.get(store.chunks.splitKey(d.id).id)))

    let context = relatedChunks.map(c=>c.text).join("\n")
    const prompt = `${context}\nQuestion: ${question}\nAnswer:`;
    return openai.createCompletion({
      model: "davinci-instruct-beta-v3",
      prompt,
      max_tokens: 200,
      temperature: 0,
      top_p: 1,
      n: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    //   stop: ['.', '\n']
    }).then(response => response.data['choices'][0]['text'].trim())
}
  


//* PARAMS
// Discriminator    bool : True, Return yes or no if the question is answerable based on context
// Random           bool : True, add prompt with an incorrect context instead of the right one
// Related          bool : With Random=true, use a close context to make a harder question

//* DISCRIMINATOR | RANDOM   | RELATED

//* 'modelDiscriminator'
//  true          | true     | true       Random  + question + related=no (hard)
//  true          | true     | false      Random  + question + related=no (easy)
//  true          | false    | --         Context + question + related=yes

//* 'modelQA'
//  false         | true     | true       Random  + question + answer="Sorry"
//  false         | true     | false      Random  + question + answer="Sorry"
//  false         | false    | --         Context + question + answer=answer




// model_discriminator = "curie:ft-openai-internal-2021-08-23-23-58-57"
// model_qa = "curie:ft-openai-internal-2021-08-23-17-54-10"



// function create_fine_tuning_dataset(data, discriminator = false, n_negative = 1, add_related = false) {
//     let rows = [];


//     data.forEach(function(chunk, i) {
//         // gets the list of answers and questions
//         let q = chunk.questions
//         let a = chunk.answers
//         q.forEach(function(question, index) {
//             if (question.length > 10 && a[index].length > 10) {
//                 // if this is going to be a discriminator or it will be an answer
//                 if (discriminator) {
//                     // related = yes
//                   rows.push({"prompt": chunk.context + "\nQuestion: " + question.slice(2).trim() + "\n Related:", "completion": " yes"});
//                 } else {
//                     // answer = ...
//                   rows.push({"prompt": chunk.context + "\nQuestion: " + question.slice(2).trim() + "\nAnswer:", "completion": " " + a[index].slice(2).trim()});                }
//             }
//         });

//         let subset = data.filter(function(row2) {
//             // get subset of data where titles are the same (same observation), but chunks are different  
//             return (row2.title === row1.title) && (row2.context !== row1.context);
//         });

//         q.forEach(function(question) {
//             if (question.length > 10) {
//                 for (let j = 0; j < n_negative + (add_related ? 2 : 0); j++) {
//                     let random_context = "";
//                     if (j === 0 && add_related && subset.length > 0) {
//                         random_context = subset[Math.floor(Math.random() * subset.length)].context;
//                     } else if (j === 1 && add_related) {
//                         random_context = get_random_similar_contexts(question.slice(2).trim(), row1.context, 'ada', 10);
//                     } else {
//                         let random_row;
//                         do {
//                             random_row = df[Math.floor(Math.random() * df.length)];
//                         } while (random_row.context === row1.context);

//                         random_context = random_row.context;
//                     }

//                     // get a rnadom context
//                     // get a random context that is similar but not right
//                     // 
//                     if (discriminator) {
//                         // related = no
//                         rows.push({"prompt": random_context + "\nQuestion: " + question.slice(2).trim() + "\n Related:", "completion": " no"});
//                     } else {
//                         // Answer: No appropriate context
//                         rows.push({"prompt": random_context + "\nQuestion: " + question.slice(2).trim() + "\nAnswer:", "completion": " No appropriate context found to answer the question."});
//                     }
//                 }
//             }
//         });
//     });

//     return rows;
// }
