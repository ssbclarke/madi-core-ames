import { useState, useContext, useEffect } from 'react';
import { EntityFilterContext } from './FilterContext';
const checkboxes = [
    {
      name: 'filter-checkbox-scenario',
      label: 'Scenario',
    },
    {
      name: 'filter-checkbox-report',
      label: 'Report',
    },
    {
      name: 'filter-checkbox-problem',
      label: 'Problem',
    },    
    {
      name: 'filter-checkbox-solution',
      label: 'Solution',
    },
    {
      name: 'filter-checkbox-observation',
      label: 'Observation',
    },    
    {
      name: 'filter-checkbox-trend',
      label: 'Trend',
    }
  ];
  
  
const Checkbox = ({ isChecked, label, name, checkHandler, index }) => {

    return (
      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            checked={isChecked}
            onChange={checkHandler}
            name={name}
            className="checkbox checkbox-primary"
          />
          <span className="label-text px-2" htmlFor={`checkbox-${index}`}>{label}</span>
        </label>
      </div>
    )
  }
  
export const CheckboxGroup = ()=>{

    const { entityFilterStore, setEntityFilterStore } = useContext(EntityFilterContext)
    const handleChange = (event) => {
        // console.log(event)
        // console.log([event.target.name], !!event.target.checked)
        setEntityFilterStore({...entityFilterStore, [event.target.name] : event.target.checked });
    }
    useEffect(() => console.log(entityFilterStore), [entityFilterStore]);

    return (
      <div className="flex flex-row">
        {checkboxes.map((entity, index) => (
          <Checkbox
            key={entity.name}
            isChecked={entityFilterStore[entity.label.toLowerCase()]}
            checkHandler={handleChange}
            label={entity.label}
            index={index}
            name={entity.label.toLowerCase()}
          />
        ))}
      </div>
    )
  
  }