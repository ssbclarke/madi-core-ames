import { useState, cloneElement, useContext, createContext } from "react";

import { Sidebar } from "../Sidebar/Sidebar";
import { SidebarProvider } from "../Sidebar/SidebarContext";

export const SidebarLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className={`h-screen flex`}>
        <Sidebar />
        {children}
      </div>
    </SidebarProvider>
  );
};

// export const SidebarLayoutOld = ({ children, sidebarComponent }) => {
//   // const [sidebarStatus]
//   return (
//     <div className="w-full h-screen flex flex-no-wrap">
//       <input className="peer hidden" type="checkbox" id="sidebar-toggle" />
//       <nav
//         className="
//         hidden
//         md:left-0 
//         md:block 
//         md:fixed 
//         md:top-0 md:bottom-0 
//         md:overflow-y-auto 
//         md:flex-row md:flex-nowrap 
//         md:overflow-hidden 
//         bg-gray-800 flex flex-wrap items-center 
//         justify-between relative 
//         z-10 py-4 px-6
//         w-20
//         peer-checked:lg:w-64
//         will-change-transform	
//         transition-all duration-200 ease
//         transform	
//         translate-x-0
//         ">
//         {sidebarComponent}
//       </nav>
//       <div
//         className="relative
//             md:ml-20
//             peer-checked:lg:ml-64
//             transition-all duration-200 ease
//             transform	
//             translate-x-0
//             w-full
//             ">
//         {children}
//       </div>
//     </div>
//   );
// };
