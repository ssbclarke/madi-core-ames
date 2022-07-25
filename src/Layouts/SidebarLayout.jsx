import { useState, cloneElement, useContext, createContext} from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

export const SidebarContext = createContext(null)




export const SidebarLayout = ({children})=>{
  const [sidebarStore, setSidebarStore] = useState({
    collapsed: false,
    rtl: false,
    toggled: false,
  });

  const toggleSidebar = (value) => {
    console.log('toggling from Layout')
    setSidebarStore({...sidebarStore, toggled:value})
  };

  return (
    <SidebarContext.Provider value={[sidebarStore, setSidebarStore]}>
    <div className={`w-full h-screen flex flex-no-wrap ${sidebarStore.toggled ? 'toggled' : ''}`}>
      <ProSidebar
        toggled={sidebarStore.toggled}
        collapsed={sidebarStore.toggled}
        onToggle={toggleSidebar}

      >
 <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          sidebarTitle
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            // icon={<FaTachometerAlt />}
            suffix={<span className="badge red">new</span>}
          >
            dashboard
          </MenuItem>
          <MenuItem 
          // icon={<FaGem />}
          > components</MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            suffix={<span className="badge yellow">3</span>}
            title='withSuffix'
            // icon={<FaRegLaughWink />}
          >
            <MenuItem>1</MenuItem>
            <MenuItem>2</MenuItem>
            <MenuItem>3</MenuItem>
          </SubMenu>
          <SubMenu
            prefix={<span className="badge gray">3</span>}
            title='withPrefix'
            // icon={<FaHeart />}
          >
            <MenuItem>1</MenuItem>
            <MenuItem> 2</MenuItem>
            <MenuItem>3</MenuItem>
          </SubMenu>
          <SubMenu title={`$2`} 
          // icon={<FaList />}
          >
            <MenuItem>1 </MenuItem>
            <MenuItem>2 </MenuItem>
            <SubMenu title={`$3`}>
              <MenuItem>3.1 </MenuItem>
              <MenuItem>3.2 </MenuItem>
              <SubMenu title={`$3.3`}>
                <MenuItem>3.3.1 </MenuItem>
                <MenuItem>3.3.2 </MenuItem>
                <MenuItem>3.3.3 </MenuItem>
              </SubMenu>
            </SubMenu>
          </SubMenu>
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://github.com/azouaoui-med/react-pro-sidebar"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            {/* <FaGithub /> */}
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              viewSource
            </span>
          </a>
        </div>
      </SidebarFooter>
      </ProSidebar>
      {/* {cloneElement(children, {
        toggled,
        handleToggleSidebar
      })} */}
            <div
          className="relative
            md:ml-20
            peer-checked:lg:ml-64
            transition-all duration-200 ease
            transform	
            translate-x-0
            w-full
            ">
      {children}
      </div>
    </div>
    </SidebarContext.Provider>

  )
}


export const SidebarLayoutOld = ({ children, sidebarComponent }) => {
  // const [sidebarStatus]
  return (
    <div className="w-full h-screen flex flex-no-wrap">
      <input className="peer hidden" type="checkbox" id="sidebar-toggle" />
      <nav className="
        hidden
        md:left-0 
        md:block 
        md:fixed 
        md:top-0 md:bottom-0 
        md:overflow-y-auto 
        md:flex-row md:flex-nowrap 
        md:overflow-hidden 
        bg-gray-800 flex flex-wrap items-center 
        justify-between relative 
        z-10 py-4 px-6
        w-20
        peer-checked:lg:w-64
        will-change-transform	
        transition-all duration-200 ease
        transform	
        translate-x-0
        ">
        {sidebarComponent}
      </nav>
      <div
          className="relative
            md:ml-20
            peer-checked:lg:ml-64
            transition-all duration-200 ease
            transform	
            translate-x-0
            w-full
            ">
          {children}
      </div>

    </div>
  );
};
