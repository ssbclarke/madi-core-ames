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

export const TagBox = ({options, className, value, optionGroup, setValue})=>{

    const handleChange = (indices) => {
      setValue(indices, options, optionGroup)
    };

    let classes = cx(
      "bg-white rounded-lg border w-72 text-gray-900",
      className
    )
    return (
      <List
        className={classes}
        items={buildItems(options)}
        multiple={true}
        onChange={handleChange}
        itemClassName="px-2 py-1 border-b border-gray-200 w-full cursor-pointer"
        focusedClassName="hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-200 focus:text-gray-600"
        selectedClassName="bg-blue-600 text-gray-50 hover:text-gray-50 hover:bg-blue-600"
        disabledClassName="text-gray-900"
      />
    )
}