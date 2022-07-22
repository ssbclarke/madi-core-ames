import React, { useContext, useMemo } from "react";
import { CheckboxGroup } from './EntityFilter/EntityCheckboxes';
import { generateList } from './generate-list';
import { EntityFilterContext } from "./EntityFilter/FilterContext";
import { TagFilterContext } from "../TagFilter/TagContext";

const list = generateList(2000)


// this SHOULD be a search filter of some sort.
// but we'll do local tag filtering for now.
function filterList({entityFilterStore, tagFilterStore, list}){
  // let tagTypes = Object.keys(tagFilterStore)
  // let tags = []
  // tagTypes.forEach(type=>{ tags = [...tags, ...tagFilterStore[type]]})
  let filteredList = list
    .filter(x=>entityFilterStore[x.type])

  return filteredList
}

const ComplexList = () => {
  const { entityFilterStore, setEntityFilterStore } = useContext(EntityFilterContext)
  const { tagFilterStore, setTagFilterStore } = useContext(TagFilterContext)

  return (
    <div className="overflow-x-auto w-full">
        <CheckboxGroup/>
        <table className="table w-full">
            <tbody>
              {filterList({entityFilterStore, tagFilterStore, list}).map(item => ( 
                  <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.firstname}</td>
                      <td>{item.lastname}</td>
                      <td>{item.type}</td>
                  </tr>
              ))}
            </tbody>     
        </table>
    </div>
  );
};

export default ComplexList;