import React, { useContext, useMemo } from "react";
import { CheckboxGroup } from "./ListCheckboxes";
import { generateList } from "../../utils/generate-list";
import { EntityFilterContext } from "./EntityFilterContext";
import { TagFilterContext } from "../TagFilter/TagContext";
import { Attribute } from "./Attribute";

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

export const EntityRow = ({ item, index }) => {
  return (
    <div
      key={index}
      tabIndex="0"
      className="
        collapse collapse-arrow 
        bg-base-100 
        mb-1
      ">
      <input type="checkbox" className="peer" />
      <div
        className="
          collapse-title 
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
          {index % 4 == 0 ? (
            <img src="https://via.placeholder.com/110x70" className="-ml-4" />
          ) : (
            <div />
          )}
          <div className="flex flex-col px-4 py-2 h-24">
            <div className="pb-1">
              <span className="uppercase font-bold text-xs pr-4 self-center">
                {item.type}
              </span>
              <span className="">{item.title}</span>
            </div>
            <div className="text-sm text-ellipsis overflow-hidden">
              {item.summary}
            </div>
          </div>
        </div>
      </div>
      <div
        className="
          collapse-content 
          border-l-8 border-l-base-100
          transition-color ease-out duration-300
          peer-checked:bg-indigo-200
          peer-checked:text-base-content
          peer-checked:border-l-indigo-500 
        ">
        <EntityExpanded item={item} index={index} />
      </div>
    </div>
  );
};

let Badge = ({children})=>(<div class="badge">{children}</div>)

export const EntityExpanded = ({ item, index }) => {
  return (
    <>
      <Attribute title="Summary">{item.summary}</Attribute>
      <Attribute title="Description">{item.description}</Attribute>
      <Attribute title="Type">{item.type}</Attribute>
      <Attribute title="Summary">{item.summary}</Attribute>
      <Attribute title="Topic">{item.topic.map((m,i) => (<Badge key={i}>{m}</Badge>))}</Attribute>
      <Attribute title="Needs">{item.need.map((m,i) => (<Badge key={i}>{m}</Badge>))}</Attribute>
      <Attribute title="Ility">{item.ility.map((m,i) => (<Badge key={i}>{m}</Badge>))}</Attribute>
      <Attribute title="Category">{item.category.map((m,i) => (<Badge key={i}>{m}</Badge>))}</Attribute>
      <Attribute title="Subcategory">{item.subcategory.map((m,i) => (<Badge key={i}>{m}</Badge>))}</Attribute>

      <div>
        <div className="collapse collapse-arrow ">
          <input type="checkbox" />
          <div className="collapse-title bg-white">JSON details</div>
          <div className="collapse-content bg-gray-300">
            <pre>{JSON.stringify(item, null, 2)}</pre>
          </div>
        </div>
      </div>
    </>
  );
};

export const List = () => {
  const { entityFilterStore, setEntityFilterStore } =
    useContext(EntityFilterContext);
  const { tagFilterStore, setTagFilterStore } = useContext(TagFilterContext);

  return (
    <div className="overflow-x-auto w-full px-5">
      {filterList({ entityFilterStore, tagFilterStore, list }).map(
        (item, i) => {
          return(<EntityRow item={item} index={i} key={i}/>)
        }
      )}
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
