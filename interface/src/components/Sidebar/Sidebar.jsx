import { useState, cloneElement, useContext, createContext } from "react";
import { FaGem, FaGithub, FaCog, FaRegQuestionCircle, FaConfluence, FaCubes, FaBookmark } from 'react-icons/fa'
import { SiNotion, SiAirtable } from 'react-icons/si'
import { FiLogOut } from 'react-icons/fi'
import { TagFilterContext } from "../TagFilter/TagContext";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
  } from "react-pro-sidebar";
  import "react-pro-sidebar/dist/css/styles.css";
import { SidebarContext } from "./SidebarContext";
import './Sidebar.css'
import { investigations } from "../../config/options";

export const Sidebar = () => {
  const [sidebarStore, setSidebarStore] = useContext(SidebarContext)
  const {investigationStore, setInvestigationStore} = useContext(TagFilterContext)

  return (
        <ProSidebar
          collapsed={sidebarStore.collapsed}
          >
          <SidebarHeader>
            <div className={`flex flex-1 max-h-20 justify-left text-white h-16 transition-all pl-4 pt-1
            overflow-hidden nowrap
            ${sidebarStore.collapsed?"w-20": "w-full"}`}>
                <Logo/>
                {!sidebarStore.collapsed?
                    <LogoName/>
                    :  null }
            </div>
          </SidebarHeader>

          <SidebarContent>
            <Menu iconShape="circle">
              <SubMenu 
                // defaultOpen	
                icon={<FaBookmark />}
                title="My Investigations"
              >
                {investigations.map((investigation,i)=>{
                  return(
                    <MenuItem key={i} onClick={()=>setInvestigationStore(investigation.id)}>
                      {investigation.name}
                    </MenuItem>
                  )
                })}
              </SubMenu>
            </Menu>

            <Menu iconShape="circle">
              <SubMenu
                // defaultOpen	
                icon={<FaCubes />}
                title="Document Repositories"
              >
                <MenuItem icon={<SiNotion />}>Notion</MenuItem>
                <MenuItem icon={<FaConfluence />}>Confluence</MenuItem>
                <MenuItem icon={<SiAirtable />}>Airtable</MenuItem>
              </SubMenu>
            </Menu>
          </SidebarContent>

          <SidebarFooter>
            <Menu iconShape="circle">
              <MenuItem icon={<FaGithub />}>View Source</MenuItem>
              <MenuItem icon={<FaCog />}>Settings</MenuItem>
              <MenuItem icon={<FaRegQuestionCircle />}>Help</MenuItem>
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </Menu>
           
            {/* <div
              className="sidebar-btn-wrapper"
              style={{
                padding: "20px 24px",
              }}>
              <a
                href="https://github.com"
                target="_blank"
                className="sidebar-btn"
                rel="noopener noreferrer">
                <span
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}>
                  viewSource
                </span>
              </a>
            </div> */}
          </SidebarFooter>
        </ProSidebar>
  );
};




const Logo = ({className})=>{
    return (
      <div className="relative flex pt-1">
        <svg className="w-12 h-14 pt-0 "                        fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M144.3 32.04C106.9 31.29 63.7 41.44 18.6 61.29c-11.42 5.026-18.6 16.67-18.6 29.15l0 357.6c0 11.55 11.99 19.55 22.45 14.65c126.3-59.14 219.8 11 223.8 14.01C249.1 478.9 252.5 480 256 480c12.4 0 16-11.38 16-15.98V80.04c0-5.203-2.531-10.08-6.781-13.08C263.3 65.58 216.7 33.35 144.3 32.04zM557.4 61.29c-45.11-19.79-88.48-29.61-125.7-29.26c-72.44 1.312-118.1 33.55-120.9 34.92C306.5 69.96 304 74.83 304 80.04v383.1C304 468.4 307.5 480 320 480c3.484 0 6.938-1.125 9.781-3.328c3.925-3.018 97.44-73.16 223.8-14c10.46 4.896 22.45-3.105 22.45-14.65l.0001-357.6C575.1 77.97 568.8 66.31 557.4 61.29z"/></svg>
        <svg className="w-9  h-14 pb-4 -ml-10"
          style={{width: "2.4rem", marginLeft: "-2.8rem"
        }} fill="white"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"/></svg>
        <svg className="w-8  h-14 pb-3 -ml-9 z-10 text-primary" 
        style={{ filter: "drop-shadow(1px 4px 0px white)", marginLeft: "-2.28rem"}}      
        fill="currentColor"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"/></svg>
      </div>
  )}

  
  const LogoName = ()=>{
    return(
      <h1 className="
      pl-5 self-center text-4xl font-black text-neutral-content items-center hidden lg:block
      ">
        <span className="">
          Ma<span className="text-indigo-500">DI</span>
        </span>
      </h1>
  )}

