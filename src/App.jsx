import { useState } from 'react';
import './App.css';
import Navbar from './Main/navbar/navbar';
import ComplexList from './Main/List/List';
import { EntityFilterProvider } from './Main/List/EntityFilter/FilterContext';
import { TagSection } from './Main/TagFilter/TagSection';
import { Sidebar } from './Sidebar/Sidebar';
import { TagFilterProvider} from './Main/TagFilter/TagContext';
import { Main } from './Main/Main'
import Selector from './selector'

function App() {
  return (
    <EntityFilterProvider>
    <TagFilterProvider>
    {/* <Selector/> */}
    {/* Should be visible. */}
      <div className="App w-full h-screen flex flex-no-wrap">
        <Sidebar/>
        <Main/>
        


      </div>
      </TagFilterProvider>
      </EntityFilterProvider>
  );
}

export default App;
