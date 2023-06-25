import * as dotenv from 'dotenv'
dotenv.config()
import { Debug } from './utils/logger.js';
import { Configuration, OpenAIApi } from 'openai';
import * as proxyCache from './proxycache/proxycache.js'
const debug = Debug(import.meta.url)
import { parseBoolean } from './utils/boolean.js';
import axios from 'axios';
import fs from 'fs/promises';


if(parseBoolean(process.env.USE_PROXY)){
    process.env.PROXY_PATH  = `http://localhost:${process.env.PROXY_PORT}/v1`
    await proxyCache.initializeProxy()
}else{
    process.env.PROXY_PATH  = 'https://api.openai.com/v1'
}

const imagePrompt = `{"realistic":"A photo of a computer monitor with the WDHD platform open, showing a map of the world with different countries highlighted in different colors. The colors represent the different levels of regulation and monitoring of social media use. The photo is taken from a low angle, giving the viewer a sense of the power and importance of the platform. Shot with Sony Alpha 7R III, ISO 100, 24mm, f/2.8.","artistic":"An abstract painting of lobbyists proposing legislation to limit the amount of time adolescents can spend in the “safe zones”. The painting is in the style of the painter Kandinsky, with bright colors and geometric shapes. The painting is meant to evoke a sense of urgency and importance of the legislation.","scifi":"A shot from a scifi movie of a group of teenagers in a dark alley, illuminated by a single streetlight. One of the teenagers is wearing a mask and looking menacing and holding a bat. The scene is meant to evoke a sense of fear and danger."}`



// Images creation
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: process.env.PROXY_PATH
});
const openai = new OpenAIApi(configuration);

export const ScenarioImages = async (promptObject) => {

    console.log(promptObject);

    // Fetch the URLs of the images
    const images = await Promise.allSettled(
        Object.keys(promptObject).map(key => {
            return openai.createImage({
                prompt: promptObject[key] + " NO TEXT",
                n: 1,
                size: "256x256"
            })
        })
    )

    const fileLocations = await Promise.all(images.map(async i => {
        const url = i.value?.data?.data[0]?.url;
        const path = url.split('?')[0];
        const fileName = path.split('/').pop();
        const filePath = `./images/${fileName}`;

        // Check if the image already exists
        const exists = await fs.access(filePath).then(() => true).catch(() => false);

        if (exists) {
            console.log(`Image ${fileName} exists`);
            return filePath;
        } else {
            console.log(`Fetching image ${fileName}...`);

            // If the image doesn't exist, fetch it with axios and save it
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'arraybuffer'
            });
            await fs.writeFile(filePath, response.data);
            console.log(`Image ${fileName} saved`);
            return filePath;
        }
    }));

    return fileLocations;
}


ScenarioImages(JSON.parse(imagePrompt))