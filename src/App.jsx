import './App.css';
import { EntityFilterProvider } from './components/EntityList/EntityFilterContext';
import { Sidebar } from './components/Sidebar/SidebarOLD';
import { TagFilterProvider} from './components/TagFilter/TagContext';
import { EntityList } from './components/EntityList/EntityList'
import { SidebarLayout} from './Layouts/SidebarLayout'
import { SidebarProvider } from "./components/Sidebar/SidebarContext";

function App() {
  return (
    <EntityFilterProvider>
    <TagFilterProvider>
      
      <SidebarLayout>
        <EntityList/>
      </SidebarLayout>
    
    </TagFilterProvider>
    </EntityFilterProvider>
  );
}

export default App;
