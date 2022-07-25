import './App.css';
import { EntityFilterProvider } from './components/EntityList/EntityFilterContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { TagFilterProvider} from './components/TagFilter/TagContext';
import { EntityList } from './components/EntityList/EntityList'
import { SidebarLayout} from './Layouts/SidebarLayout'

function App() {
  return (
    <EntityFilterProvider>
    <TagFilterProvider>
      <SidebarLayout 
      sidebarComponent={<Sidebar/>}>
        <EntityList/>
      </SidebarLayout>
    </TagFilterProvider>
    </EntityFilterProvider>
  );
}

export default App;
