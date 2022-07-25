import { useState } from "react";
import Navbar from "../navbar/navbar";
import ComplexList from "./List";
import { TagSection } from "../TagFilter/TagSection"
import { CheckboxGroup } from "./EntityCheckboxes";

export const Main = ({ children }) => {
  return (
    <div className="h-full w-full overflow-hidden">
      <Navbar />
      <div
        style={{
          height: `calc(100vh - 4rem)`, //height of the navbar
        }}
        className="w-full drawer">
        <input
          type="checkbox"
          id="tag-filter-toggle"
          className="drawer-toggle w-0"
        />
        <div className="drawer-content w-full bg-slate-100">
          <div className="flex flex-wrap justify-between m-5 ">
            <label htmlFor="tag-filter-toggle" className="btn btn-sm mt-1 btn-primary drawer-button rounded">
            <svg class="h-6 w-6 pr-1" stroke="currentColor"  fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
              Search Filters
            </label>
            <CheckboxGroup />
          </div>


          <ComplexList />
        </div>
        <div className="drawer-side">
          <label htmlFor="tag-filter-toggle" className="drawer-overlay"></label>
          <TagSection />
        </div>
      </div>
    </div>
  );
};

// {/* <div className="drawer h-screen">
// <input id="filter-toggle" type="checkbox" className="drawer-toggle"/>

// <main className="drawer-content bg-base-200 lg:p-8 p-4 space-y-8">
//   <label for="filter-toggle" className="btn btn-primary drawer-button">Open drawer</label> */}

// {/* </main>

// <aside className="drawer-side h-screen ">
//   <label htmlFor="filter-toggle" className="drawer-overlay"></label>
//   <div className="p-5 w-1/2 bg-base-200 ">
//     <div className="flex justify-end">
//       <label htmlFor="filter-toggle" className="btn btn-circle btn-outline">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
//       </label>
//     </div> */}
