import { useState } from 'react';
import './App.css';
import Navbar from './Main/navbar/navbar';
import ComplexList from './Main/List/List';
import { EntityFilterProvider } from './Main/List/EntityFilter/FilterContext';
import { TagSection } from './Main/TagFilter/TagSection';
import { Sidebar } from './Sidebar/Sidebar';
import { TagFilterProvider} from './Main/TagFilter/TagContext';
import { Main } from './Main/Main'

function App() {
  return (
    <EntityFilterProvider>
    <TagFilterProvider>
      <div className="App w-full h-screen flex flex-no-wrap">
        <Sidebar/>
        <Main/>
      </div>
{/*         
        <Navbar/>
          <div className="drawer h-screen">
            <input id="filter-toggle" type="checkbox" className="drawer-toggle"/>


            <main className="drawer-content bg-base-200 lg:p-8 p-4 space-y-8">
              <label for="filter-toggle" className="btn btn-primary drawer-button">Open drawer</label>
              <ComplexList/>
            </main>
              

            
            <aside className="drawer-side h-screen ">
              <label htmlFor="filter-toggle" className="drawer-overlay"></label> 
              <div className="p-5 w-1/2 bg-base-200 ">
                <div className="flex justify-end">
                  <label htmlFor="filter-toggle" className="btn btn-circle btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </label>
                </div>
                <TagSection/>
              </div>
            </aside>
          </div>
      </div> */}
      </TagFilterProvider>
      </EntityFilterProvider>
  );
}

export default App;
