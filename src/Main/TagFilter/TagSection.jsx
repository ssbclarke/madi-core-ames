import React, { useState, useEffect, useContext } from "react"
import { TagBox } from "./TagBox"
import { TagFilterContext } from "./TagContext"
import { entities, topics, ilities, needs, categories, subcategories } from '../List/options'
import cx from 'classnames'

export const TagSection = ()=>{
    const { tagFilterStore, setTagFilterStore } = useContext(TagFilterContext)
    let selected = [];
    const handleChange = (selectedIndex, options, set) => {
        // console.log('selectedIndex :: ', selectedIndex)
        // console.log('options :: ', options)
        // console.log('set :: ', set)
        // console.log('tagFilterStore::', tagFilterStore)
        
        setTagFilterStore({...tagFilterStore, ...{[set]:options.filter((o,i)=>selectedIndex.includes(i))}})

    }
    useEffect(() => {
      console.log('after: ',tagFilterStore)
    }, [tagFilterStore]);

    const removeTag = (index)=>{

    }

    const clearTags = ()=>{
        setTagFilterStore({...Object.values(tagFilterStore).reduce((o, key) => ({ ...o, [key]:[]}), {})})
    }
    return (
            <div className="flex h-full flex-col w-2/3 w-min overflow-hidden">  
                <div className="min-h-14 bg-secondary shrink-0 ">
                    <button className="btn">Button</button>
                    <div className="max-h-48 overflow-y-scroll">
                        {Object.keys(tagFilterStore).map((group)=>{
                            // each type of tag
                            return tagFilterStore[group].map((tag,i)=>{
                                // let classes = cx('badge',colors[tag])
                                return (
                                    <div key={i} className={`badge mr-2 ${
                                        group==='topic'?'badge-primary':
                                        group==='thrust'?'badge-secondary':
                                        group==='ility'?'badge-accent':
                                        group==='need'?'badge-info':
                                        group==='category'?'badge-warning':
                                        group==='subcategory'?'badge-error':""
                                    }`}>
                                        {tag}
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block w-4 h-4 stroke-current"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                        </svg>
                                    </div>
                                )
                            })  
                        })}
                    </div>
                    <button className="text-right w-full px-8"
                        onClick={clearTags}
                    >Clear All</button>
                </div>
                <div style={{height:"calc(100% - 14rem)"}} // minus height of the settings above
                    className="flex flex-1 bg-accent h-full">
                    <div className="flex-col h-full flex ml-5">
                        <TagBox
                            options={topics}
                            optionGroup="topic"
                            setValue={handleChange}
                            className="mb-5 overflow-y-scroll shrink-0 max-h-32"
                        />
                        <TagBox
                            options={ilities}
                            optionGroup="ility"
                            setValue={handleChange}
                            className="mb-5 overflow-y-scroll shrink-0 max-h-44"
                        />
                        <div className="mb-5 flex-1 overflow-hidden">
                            <TagBox
                                options={needs}
                                optionGroup="need"
                                setValue={handleChange}
                                className="overflow-y-scroll h-full"
                            />
                        </div>
                        
                    </div>
                    <div className="flex-col h-full flex ml-5">
                        <TagBox
                            options={categories}
                            optionGroup="category"
                            setValue={handleChange}
                            className="mb-5 overflow-y-scroll"
                        />

                    </div>
                    <div className="flex-col h-full flex ml-5">
                    <TagBox
                            options={subcategories}
                            optionGroup="subcategory"
                            setValue={handleChange}
                            className="mb-5 overflow-y-scroll"

                        />

                    </div>
   
                    <div className="flex-col w-5 bg-primary"></div>

                </div>
           
            </div>
       
    )
}