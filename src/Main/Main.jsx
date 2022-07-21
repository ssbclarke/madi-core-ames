import { useState } from 'react';
import Navbar from './navbar/navbar';
import ComplexList from './List/List';
import { TagSection } from './TagFilter/TagSection';

export const Main = ({children}) => {
    return (
      <div className="h-full w-full overflow-hidden">
            <Navbar style/>
            <div 
                style={{ 
                    height: `calc(100vh - 4rem)`, //height of the navbar
                }}
            className="w-full flex">
          {/* <div className="drawer h-screen">
            <input id="filter-toggle" type="checkbox" className="drawer-toggle"/>

    
            <main className="drawer-content bg-base-200 lg:p-8 p-4 space-y-8">
              <label for="filter-toggle" className="btn btn-primary drawer-button">Open drawer</label> */}
              
            {/* </main>
              

            
            <aside className="drawer-side h-screen ">
              <label htmlFor="filter-toggle" className="drawer-overlay"></label> 
              <div className="p-5 w-1/2 bg-base-200 ">
                <div className="flex justify-end">
                  <label htmlFor="filter-toggle" className="btn btn-circle btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </label>
                </div> */}
                <div className="w-2/3 overflow-hidden h-full">
                <TagSection/>
                </div>
                
                <div className="w-1/3 overflow-scroll ">
                    <ComplexList/>
                </div>
                
             {/* </div>
            </aside>
            </div> */}
            </div>
        </div>
    );
  };
  