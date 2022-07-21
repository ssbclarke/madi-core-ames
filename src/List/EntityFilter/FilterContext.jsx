import { createContext, useState } from 'react';

export const EntityFilterContext = createContext(null);

export const EntityFilterProvider = ({children}) => {
    const [entityFilterStore, setEntityFilterStore] = useState({
        'scenario': 1,
        'report': 1,
        'problem': 1,
        'solution': 1,
        'observation': 1,
        'trend': 1
    });
	return (
		<EntityFilterContext.Provider value={{entityFilterStore, setEntityFilterStore}}>
			{children}
		</EntityFilterContext.Provider>
	)
}
