import { useState, useContext } from 'react';
import { SidebarContext } from '../../components/Sidebar/SidebarContext'
import { TagFilterContext } from '../TagFilter/TagContext';
import { investigations } from '../../config/options';
import { LogoutButton } from '../Auth/LogoutButton'
import { LoginButton } from '../Auth/LoginButton'
import { Avatar } from '../Auth/Avatar'
import { useAuth0 } from "@auth0/auth0-react";

const SidebarToggle = ()=>{
    const [sidebarStore, setSidebarStore] = useContext(SidebarContext)

    const toggleSidebar = () => {
        console.log('in the nacbar', sidebarStore.collapsed)
        setSidebarStore({...sidebarStore, collapsed:!sidebarStore.collapsed})
    };
    return (
        <label htmlFor="sidebar-toggle" className="btn btn-link btn-primary pl-0" onClick={toggleSidebar}>
            <svg className="w-6 h-6 stroke-primary fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/></svg>
        </label>
    )
}

function Navbar() {
  const { investigationStore, setInvestigationStore } = useContext(TagFilterContext)
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
        <div className="navbar bg-base-100 max-h-16">

            <div className="flex mx-3 w-full justify-between">
                
                <SidebarToggle/>
                <div className="form-control w-2/5">
                    <div className="input-group">
                        <input type="text" placeholder="Search…" className="input input-bordered border-r-0 text-lg
                        peer
                        outline-0	
                        focus:outline-0
                        focus:border-primary
                        w-full
                        " />
                        <button className="btn btn-square btn-outline btn-primary border-base-300 border-l-0
                        peer-focus:border-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>
                </div>
                <div className="w-2/5 flex">
                    {investigations.filter(i=>investigationStore===i.id).map((inv,i)=>{
                        return(<div key={i}>{inv.name}</div>)
                    })}
                </div>
                {isAuthenticated
                    ?(<div className="flex mr-4"><h2 className="px-5 place-self-center">{user.name.split(' ')[0]}</h2><Avatar/></div>)
                    :null
                }
                
                
                {/*<ul tabIndex="0" className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                    <li>
                    <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                    </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                </ul>
                </div> */}
            </div>
        </div>
  );
}

export default Navbar;