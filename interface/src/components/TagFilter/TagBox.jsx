import { useState, useEffect, useContext } from 'react';
import List from './List'
import cx from 'classnames'

function buildItems(options){
  return options.map((o)=>{
    if(typeof o === 'string'){
      return (
        <div className="">{o}</div>
      )
    }else{
      return (
        <div className="">{o.label}</div>
      )
    }})
}

export const TagBox = ({options, className, selected=[], optionGroup, setValue})=>{

    const handleChange = (indices) => {
      setValue(indices, options, optionGroup)
    };

    let classes = cx(
      "bg-white rounded-lg border min-w-48 text-gray-900 text-sm",
      className
    )
    let selectedIndices = selected.map((s,i)=>options.indexOf(s))
    console.log(selectedIndices)
    return (
      <List
        className={classes}
        items={buildItems(options)}
        multiple={true}
        onChange={handleChange}
        selected={selectedIndices}
        itemClassName="px-2 py-0.5 border-b border-gray-200 w-full cursor-pointer"
        focusedClassName="hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-200 focus:text-gray-600"
        selectedClassName="bg-blue-600 text-gray-50 hover:text-gray-50 hover:bg-blue-600"
        disabledClassName="text-gray-900"
      />
    )
}