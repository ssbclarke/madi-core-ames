import json2md from 'json2md'
import fs from 'fs'

function buildObservation(data){
    let children = (data.children && data.children.length >0) 
    ? [
        `**Related to:**`,
        { ul: data.children.map(c=>buildObservation(c))}
    ] : []

    if(data.text && data.text.includes('\n')){
        console.log(data.text)
    }
    let cleanText = data.text

    let sources = (data.sources)
    ? [
        `**Sources:**`,
        { ul: data.sources.map(s=>({link: { title: s, source: s }}))} 
    ] : []

    let type = (data.madiType)? `**${data.madiType.charAt(0).toUpperCase() + data.madiType.slice(1)}**:`:'**[NO TYPE]:**'
    let errors = data.errors && data.errors.length>0
        ? [
            "**Errors:**",
            { ul: data.errors.map(e=>(`<span style="color:red">${e}</span>`))}
        ]
        : []
    return [
        `**${data.id}**`,
        { ul: [
            `${type} ${cleanText}`,//.replace(/\r+/g,"\n")}`,
            ...sources,
            // cleanText,
            ...errors,
            ...children
        ]}
    ]
}





export default function convertToMarkdown(data){
    let output = json2md([
        { h1: "[INVESTIGATION TITLE PLACEHOLDER]" },
        { ul: data.map(d=>buildObservation(d))}
    ])
    return output
}