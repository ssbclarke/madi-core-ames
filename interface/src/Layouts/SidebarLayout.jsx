import { useState } from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

export const SidebarLayoutNew = ()=>{
  return (
    <ProSidebar>
      <SidebarHeader>
        {/**
         *  You can add a header for the sidebar ex: logo
         */}
      </SidebarHeader>
      <SidebarContent>
        {/**
         *  You can add the content of the sidebar ex: menu, profile details, ...
         */}
      </SidebarContent>
      <SidebarFooter>
        {/**
         *  You can add a footer for the sidebar ex: copyright
         */}
      </SidebarFooter>
    </ProSidebar>
  )
}


export const SidebarLayout = ({ children, sidebarComponent }) => {
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
