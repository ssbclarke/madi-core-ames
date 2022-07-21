import { entities, categories, subcategories } from './options'

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

export const generateList = (count)=>{
    return [...Array(count)].map((x,i)=>{
        return {
            id: i,
            firstname: Math.random().toString(16).substr(2, 4),
            lastname: Math.random().toString(16).substr(2, 10),
            type: getRandomSubarray(entities, 1),
            category: getRandomSubarray(categories, Math.floor(Math.random()*categories.length)),
            subcategory: getRandomSubarray(subcategories, Math.floor(Math.random()*subcategories.length)),
        }
    })
}