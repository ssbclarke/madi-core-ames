import React, { useContext, useMemo } from "react";
import { CheckboxGroup } from "./EntityCheckboxes";
import { generateList } from "../../utils/generate-list"
import { EntityFilterContext } from "./EntityFilterContext";
import { TagFilterContext } from "../TagFilter/TagContext"
import { EntityRow } from "./EntityRow";



const list = generateList(30);

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
    <div className="overflow-x-auto w-full px-5">
      {filterList({ entityFilterStore, tagFilterStore, list }).map((item,i) => {

        let tags = (item.ilities||[]).map((m)=>(<div class="badge">{m}</div>))

        return (
        <div
          key={item.id}
          tabIndex="0"
          className="collapse collapse-arrow 
            bg-base-100 
            mb-1
          ">
          <input type="checkbox" className="peer" />
          <div className="collapse-title 
            p-0
            border-l-8 border-l-transparent
            transition-color ease-out duration-300
            peer-hover:border-l-indigo-500 
            peer-hover:overflow-hidden
            peer-checked:border-l-indigo-500 
            peer-checked:bg-indigo-200
            peer-checked:text-base-content
            peer-checked:overflow-hidden

            ">
              <div className="flex flex-row">
                {i%4==0?
                  (<img src="https://via.placeholder.com/110x70" className="-ml-4"/>)
                  :<div/>
                }
                <div className="flex flex-col px-4 py-2 h-24">
                  <div className="pb-1">
                    <span className="uppercase font-bold text-xs pr-4 self-center">{item.type}</span>
                    <span className="">{item.Title} This is the title of the Article. It's great.</span> 
                  </div>
                  <div className="text-sm text-ellipsis overflow-hidden">
                    {item.summary}
                  </div>
                </div>
              </div>
          </div>
          <div className="collapse-content 
            border-l-8 border-l-base-100
            transition-color ease-out duration-300
            peer-checked:bg-indigo-200
            peer-checked:text-base-content
            peer-checked:border-l-indigo-500 
            "> 
            <EntityRow title="Summary">{item.summary}</EntityRow>
            <EntityRow title="Description">{item.description}</EntityRow>
            <EntityRow title="Type">{item.type}</EntityRow>
            <EntityRow title="summary">{item.summary}</EntityRow>
            <EntityRow title="tags">{tags}</EntityRow>
            <div>
              <div className="collapse collapse-arrow ">
                <input type="checkbox" /> 
                <div className="collapse-title bg-white">JSON details</div>
                <div className="collapse-content bg-gray-300"> 
                  <pre>{JSON.stringify(item,null,2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )})}
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
