import './App.css';
import { EntityFilterProvider } from './components/EntityList/EntityFilterContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { TagFilterProvider} from './components/TagFilter/TagContext';
import { Main } from './components/EntityList/Main'
import { SidebarLayout } from './Layouts/SidebarLayout'

function App() {
  return (
    <EntityFilterProvider>
    <TagFilterProvider>

      <SidebarLayout 
      sidebarComponent={<Sidebar/>}>
        <Main/>
      </SidebarLayout>

    </TagFilterProvider>
    </EntityFilterProvider>
  );
}

export default App;
