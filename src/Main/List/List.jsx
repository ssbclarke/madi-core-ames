import React, { useContext, useMemo } from "react";
import { CheckboxGroup } from "./EntityFilter/EntityCheckboxes";
import { generateList } from "./generate-list";
import { EntityFilterContext } from "./EntityFilter/FilterContext";
import { TagFilterContext } from "../TagFilter/TagContext";




const list = generateList(20);

// this SHOULD be a search filter of some sort.
// but we'll do local tag filtering for now.
function filterList({ entityFilterStore, tagFilterStore, list }) {
  // let tagTypes = Object.keys(tagFilterStore)
  // let tags = []
  // tagTypes.forEach(type=>{ tags = [...tags, ...tagFilterStore[type]]})
  let filteredList = list.filter((x) => entityFilterStore[x.type]);

  return filteredList;
}

const ComplexList = () => {
  const { entityFilterStore, setEntityFilterStore } =
    useContext(EntityFilterContext);
  const { tagFilterStore, setTagFilterStore } = useContext(TagFilterContext);

  return (
    <div className="overflow-x-auto w-full">
      <CheckboxGroup />
      {filterList({ entityFilterStore, tagFilterStore, list }).map((item) => (
        <div
          key={item.id}
          tabindex="0"
          class="collapse collapse-arrow 
            bg-base-100 
            mb-2
          ">
          <input type="checkbox" class="peer" />
          <div class="collapse-title 
            border-l-8 border-l-base-100
            transition-color ease-out duration-300
            peer-hover:border-l-indigo-500 
            peer-checked:border-l-indigo-500 
            peer-checked:bg-indigo-200
            peer-checked:text-base-content">
              Click me to show/hide content
          </div>
          <div class="collapse-content 
            border-l-8 border-l-base-100
            transition-color ease-out duration-300
            peer-checked:bg-indigo-200
            peer-checked:text-base-content
            peer-checked:border-l-indigo-500 
            "> 
            <p>{item.id}</p>
            <p>{item.firstname}</p>
            <p>{item.lastname}</p>
            <p>{item.type}</p>
            </div>
        </div>
      ))}
    </div>
  );
};

// <table className="table w-full">
//     <tbody>
//     <tr key={item.id}>
//     <p>{item.id}</p>
//     <p>{item.firstname}</p>
//     <p>{item.lastname}</p>
//     <p>{item.type}</p>
// </tr>
//     </tbody>

// </table>

export default ComplexList;
