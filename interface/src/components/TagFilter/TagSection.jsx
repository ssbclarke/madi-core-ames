import React, { useState, useEffect, useContext } from "react"
import { TagBox } from "./TagBox"
import { TagFilterContext } from "./TagContext"
import { entities, topics, ilities, needs, categories, subcategories } from '../../config/options'
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
            <div className="flex h-full overflow-hidden flex-col min-w-min w-4/5 border-t border-base-300">  
                <div className="min-h-14 bg-base-200 shrink-0 ">
                    <div className="flex m-5 mb-2 justify-between">
                        <div className="flex flex-nowrap">
                            <div class="btn-group min-w-max">
                                <button class="rounded btn btn-sm btn-active btn-outline btn-primary ">
                                    <svg class="h-6 w-6 pr-2" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"  fill="currentColor" viewBox="0 0 512 512"><path d="M88 48C101.3 48 112 58.75 112 72V120C112 133.3 101.3 144 88 144H40C26.75 144 16 133.3 16 120V72C16 58.75 26.75 48 40 48H88zM480 64C497.7 64 512 78.33 512 96C512 113.7 497.7 128 480 128H192C174.3 128 160 113.7 160 96C160 78.33 174.3 64 192 64H480zM480 224C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H192C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224H480zM480 384C497.7 384 512 398.3 512 416C512 433.7 497.7 448 480 448H192C174.3 448 160 433.7 160 416C160 398.3 174.3 384 192 384H480zM16 232C16 218.7 26.75 208 40 208H88C101.3 208 112 218.7 112 232V280C112 293.3 101.3 304 88 304H40C26.75 304 16 293.3 16 280V232zM88 368C101.3 368 112 378.7 112 392V440C112 453.3 101.3 464 88 464H40C26.75 464 16 453.3 16 440V392C16 378.7 26.75 368 40 368H88z"/></svg>
                                    List
                                </button>
                                <button class="rounded btn btn-sm btn-outline btn-primary">
                                    <svg class="h-6 w-6 pr-2" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"  fill="currentColor" viewBox="0 0 448 512"><path d="M448 127.1C448 181 405 223.1 352 223.1C326.1 223.1 302.6 213.8 285.4 197.1L191.3 244.1C191.8 248 191.1 251.1 191.1 256C191.1 260 191.8 263.1 191.3 267.9L285.4 314.9C302.6 298.2 326.1 288 352 288C405 288 448 330.1 448 384C448 437 405 480 352 480C298.1 480 256 437 256 384C256 379.1 256.2 376 256.7 372.1L162.6 325.1C145.4 341.8 121.9 352 96 352C42.98 352 0 309 0 256C0 202.1 42.98 160 96 160C121.9 160 145.4 170.2 162.6 186.9L256.7 139.9C256.2 135.1 256 132 256 128C256 74.98 298.1 32 352 32C405 32 448 74.98 448 128L448 127.1zM95.1 287.1C113.7 287.1 127.1 273.7 127.1 255.1C127.1 238.3 113.7 223.1 95.1 223.1C78.33 223.1 63.1 238.3 63.1 255.1C63.1 273.7 78.33 287.1 95.1 287.1zM352 95.1C334.3 95.1 320 110.3 320 127.1C320 145.7 334.3 159.1 352 159.1C369.7 159.1 384 145.7 384 127.1C384 110.3 369.7 95.1 352 95.1zM352 416C369.7 416 384 401.7 384 384C384 366.3 369.7 352 352 352C334.3 352 320 366.3 320 384C320 401.7 334.3 416 352 416z"/></svg>
                                    Graph
                                </button>
                            </div>
                            <div class="btn-group ml-5 flex-nowrap">
                                <button class="rounded btn btn-sm btn-active btn-outline btn-primary text-primary-content">Any</button>
                                <button class="rounded btn btn-sm btn-outline btn-primary  text-primary-content">All</button>
                                <button class="rounded btn btn-sm btn-outline btn-primary  text-primary-content">SmartMix</button>
                            </div>
                            <button class="w-9 rounded btn btn-sm ml-5 btn-square btn-outline btn-primary">
                                <svg class="h-4 w-5" stroke="currentColor"  fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M160 32V64H288V32C288 14.33 302.3 0 320 0C337.7 0 352 14.33 352 32V64H400C426.5 64 448 85.49 448 112V160H0V112C0 85.49 21.49 64 48 64H96V32C96 14.33 110.3 0 128 0C145.7 0 160 14.33 160 32zM0 192H448V464C448 490.5 426.5 512 400 512H48C21.49 512 0 490.5 0 464V192zM80 256C71.16 256 64 263.2 64 272V368C64 376.8 71.16 384 80 384H176C184.8 384 192 376.8 192 368V272C192 263.2 184.8 256 176 256H80z"/></svg>
                            </button>
                            <button class="w-9 rounded btn btn-sm ml-5 btn-square btn-outline btn-primary">
                                <svg class="h-4 w-5" stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M384 48V512l-192-112L0 512V48C0 21.5 21.5 0 48 0h288C362.5 0 384 21.5 384 48z"/></svg>
                            </button>
                            <button class="rounded btn btn-sm ml-2 btn-link btn-primary"
                                onClick={clearTags}
                            >Clear All</button>
                        </div>

                        {/* <label for="my-drawer" class="drawer-overlay"></label> */}

                        <label htmlFor="tag-filter-toggle" class="drawer-button rounded btn btn-sm ml-5 btn-link btn-primary px-0 mx-0">
                            <svg class="h-6 w-6" stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>                        
                        </label>
                    </div>
                    

                    <div className="max-h-48 overflow-y-scroll mx-5 mb-2">
                        {Object.keys(tagFilterStore).map((group)=>{
                            // each type of tag
                            return tagFilterStore[group].map((tag,i)=>{
                                // let classes = cx('badge',colors[tag])
                                return (
                                    <div key={i} className={`badge badge-md h-6 mb-1 mr-2 ${
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
                    
                </div>
                <div style={{height:"calc(100% - 14rem)"}} // minus height of the settings above
                    className="flex flex-1 bg-base-200 h-full">
                    <div className="flex-col h-full flex ml-5">
                        <TagBox
                            options={topics}
                            optionGroup="topic"
                            selected={tagFilterStore.topic}
                            setValue={handleChange}
                            className="mb-5 overflow-y-scroll shrink-0 max-h-32"
                        />
                        <TagBox
                            options={ilities}
                            selected={tagFilterStore.ility}
                            optionGroup="ility"
                            setValue={handleChange}
                            className="mb-5 overflow-y-scroll shrink-0 max-h-44"
                        />
                        <div className="mb-5 flex-1 overflow-hidden">
                            <TagBox
                                options={needs}
                                selected={tagFilterStore.need}
                                optionGroup="need"
                                setValue={handleChange}
                                className="overflow-y-scroll h-full"
                            />
                        </div>
                        
                    </div>
                    <div className="flex-col h-full flex ml-5">
                        <TagBox
                            options={categories}
                            selected={tagFilterStore.category}
                            optionGroup="category"
                            setValue={handleChange}
                            className="mb-5 overflow-y-scroll"
                        />

                    </div>
                    <div className="flex-col h-full flex ml-5">
                    <TagBox
                            options={subcategories}
                            selected={tagFilterStore.subcategory}
                            optionGroup="subcategory"
                            setValue={handleChange}
                            className="mb-5 overflow-y-scroll"

                        />

                    </div>
                    <div className="flex-col w-5">
                        {/* Saved for later in case drawer icon is used */}
                    </div>
                </div>
           
            </div>
       
    )
}