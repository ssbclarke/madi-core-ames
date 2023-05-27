import { createClient } from "redis";
import { Debug } from './logger.js';

const debug = Debug(import.meta.url);

export const redisClient = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

redisClient.on('ready', () => {
    debug("Client connected.");
});
