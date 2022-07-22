import React, { useState, useEffect, useContext } from "react"
import { TagBox } from "./TagBox"
import { TagFilterContext } from "./TagContext"
import { entities, topics, ilities, needs, categories, subcategories } from '../List/options'

export const TagSection = ()=>{
    const { tagFilterStore, setTagFilterStore } = useContext(TagFilterContext)
    const handleChange = (event) => {
        console.log('tagSelect handers', event)
        // console.log([event.target.name], !!event.target.checked)
        // setTagFilterStore({...tagFilterStore, [event.target.name] : event.target.checked });
    }
    // useEffect(() => console.log(tagFilterStore), [tagFilterStore]);
 
    return (
            <div className="flex h-full flex-col w-2/3 w-min overflow-hidden">  
                <div className="h-14 bg-secondary shrink-0">
                    Settings
                    <button>

                    </button>
                </div>
                <div style={{height:"calc(100% - 14rem)"}} // minus height of the settings above
                    className="flex flex-1 bg-accent h-full">
                    <div className="flex-col h-full flex ml-5">
                        <TagBox
                            options={topics}
                            value={tagFilterStore.topics}
                            set="topics"
                            setValue={handleChange}
                            className="my-5 overflow-y-scroll shrink-0 max-h-32"
                        />
                        <TagBox
                            options={ilities}
                            set="ilities"
                            value={tagFilterStore.ilities}
                            setValue={setTagFilterStore}
                            className="mb-5 overflow-y-scroll shrink-0 max-h-44"
                        />
                        <div className="mb-5 flex-1 overflow-hidden">
                            <TagBox
                                options={needs}
                                set="needs"
                                value={tagFilterStore.needs}
                                setValue={setTagFilterStore}
                                className="overflow-y-scroll h-full"
                            />
                        </div>
                        
                    </div>
                    <div className="flex-col h-full flex ml-5">
                        <TagBox
                            options={categories}
                            set="categories"
                            value={tagFilterStore.categories}
                            setValue={setTagFilterStore}
                            className="my-5 overflow-y-scroll"
                        />

                    </div>
                    <div className="flex-col h-full flex ml-5">
                    <TagBox
                            options={subcategories}
                            set="subcategories"
                            value={tagFilterStore.subcategories}
                            setValue={setTagFilterStore}
                            className="my-5 overflow-y-scroll"

                        />

                    </div>
   
                    <div className="flex-col w-5 bg-primary"></div>

                </div>
           
            </div>
       
    )
}