import './App.css';
import { EntityFilterProvider } from './components/EntityList/EntityFilterContext';
import { Sidebar } from './components/Sidebar/SidebarOLD';
import { TagFilterProvider} from './components/TagFilter/TagContext';
import { ListLayout } from './components/EntityList/ListLayout'
import { SidebarLayout} from './components/Layouts/SidebarLayout'
import { SidebarProvider } from "./components/Sidebar/SidebarContext";
import Loading from "./components/Loading";

import { Router, Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import { Login } from './Pages/Login'


function App() {
  const { isLoading, error, isAuthenticated, user } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  if (isLoading){
    return <div>is loading</div>;
  }
  console.log('app login', isLoading, error, isAuthenticated, user)
  
  return (

        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/" element={
                  <SidebarLayout>
                    <ListLayout/>
                  </SidebarLayout>
                } />
            </Route>
            <Route path="/login" element={<Login/>} />
          </Routes>
        </BrowserRouter>

  );
}

export default App;
