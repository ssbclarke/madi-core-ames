
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const typeOut = async (str,
    thinkingDelay = 3000,
    minTypingDelay = 200,
    maxTypingDelay = 700,
    prePause = 0,
    splitByLetter= false
) => {
    await delay(Math.random() * prePause);
    for (const word of splitByLetter ? str.split("") : str.split(" ")) {

        const wordLength = word.length;

        let typingDelay = Math.floor(
            Math.ceil(Math.random() * 1) * (maxTypingDelay - minTypingDelay) +
            minTypingDelay
        );

        if (wordLength > 15) {
            typingDelay = Math.floor(typingDelay * 3);
        } else if (wordLength > 10) {
            typingDelay = Math.floor(typingDelay / 2.5);
        } else if (wordLength < 8) {
            typingDelay = Math.floor(typingDelay / 2);
        } else if (wordLength > 8) {
            typingDelay = Math.floor(typingDelay / 1.5);
        } else if (wordLength < 5) {
            typingDelay = Math.floor(typingDelay / 0.1);
        }
        typingDelay += thinkingDelay * 0.01;

        if(splitByLetter){
            process.stdout.write(word)
        }else{
            process.stdout.write(word + " ");
        }
        await delay(Math.random() * typingDelay);
    }
}

