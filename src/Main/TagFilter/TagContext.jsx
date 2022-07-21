import { createContext, useState } from 'react';

export const TagFilterContext = createContext(null);

export const TagFilterProvider = ({children}) => {
    const [tagFilterStore, setTagFilterStore] = useState({
        topic:[],
        thrust:[],
        ility:[],
        need:[],
        category:[],
        subcategory:[]
    });
	return (
		<TagFilterContext.Provider value={{tagFilterStore, setTagFilterStore}}>
			{children}
		</TagFilterContext.Provider>
	)
}
