import { createClient } from "redis";
import { Debug } from './logger.js';

const debug = Debug(import.meta.url);


export let redisClient
(async ()=>{
    redisClient = createClient({
        url: process.env.REDIS_URL ?? "redis://localhost:6379",
    });
    redisClient.on('error', err => console.log('Redis Client Error', err));

    redisClient.on('ready', () => {
        debug("Client connected.");
    });
})();