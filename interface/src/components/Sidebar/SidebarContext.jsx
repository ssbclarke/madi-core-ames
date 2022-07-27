import { createContext, useState } from 'react';

export const SidebarContext = createContext(null);

export const SidebarProvider = ({children})=>{
  const [sidebarStore, setSidebarStore] = useState({
    'collapsed': false,
    'rtl': false,
    'toggled': false,
  });
  return (
    <SidebarContext.Provider value={[sidebarStore, setSidebarStore]}>
      {children}
    </SidebarContext.Provider>
  )
}