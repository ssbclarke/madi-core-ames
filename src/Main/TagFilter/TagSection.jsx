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
        <div className="flex h-full">
            <div className="flex-col">
                <TagBox
                    options={topics}
                    value={tagFilterStore.topics}
                    set="topics"
                    setValue={handleChange}
                    className="mb-5"
                />
                <TagBox
                    options={ilities}
                    set="ilities"
                    value={tagFilterStore.ilities}
                    setValue={setTagFilterStore}
                    className="mb-5 overflow-y-scroll h-full"
                />
                <TagBox
                    options={needs}
                    set="needs"
                    value={tagFilterStore.needs}
                    setValue={setTagFilterStore}
                />
            </div>
            <div className="flex-col">
                <TagBox
                    options={categories}
                    set="categories"
                    value={tagFilterStore.categories}
                    setValue={setTagFilterStore}
                />
            </div>
            <div className="flex-col">
                <TagBox
                    options={subcategories}
                    set="subcategories"
                    value={tagFilterStore.subcategories}
                    setValue={setTagFilterStore}
                />
            </div>

        {/*
        <TagBox
            options={needs}
            set="needs"
            value={tagFilterStore.needs}
            setValue={setTagFilterStore}
        /> */}
        {/* <TagBox
            options={categories}
            value={tagFilterStore.categories}
            setValue={setTagFilterStore}
        />
        <TagBox
            options={needs}
            value={tagFilterStore.needs}
            setValue={setTagFilterStore}
        />
        <TagBox
            options={subcategories}
            value={value2}
            setValue={setValue2}
        /> */}
        </div>
       
    )
}