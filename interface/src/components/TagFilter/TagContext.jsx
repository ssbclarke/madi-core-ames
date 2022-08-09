import { createContext, useState } from 'react';

export const TagFilterContext = createContext(null);

export const TagFilterProvider = ({children}) => {
    const [tagFilterStore, setTagFilterStore] = useState({
        topic:[],
        thrust:[],
        ility:[],
        need:[],
        category:[],
        subcategory:[],
    });
    const [tagAnyAllStore, setTagAnyAllStore] = useState('any');
    const [tagBookmarkStore, setTagBookmarkStore] = useState(false);
    const [investigationStore, setInvestigationStore] = useState(null);

    return (
		<TagFilterContext.Provider value={{
            tagFilterStore, setTagFilterStore,
            tagAnyAllStore, setTagAnyAllStore,
            tagBookmarkStore, setTagBookmarkStore,
            investigationStore, setInvestigationStore
        }}>
			{children}
		</TagFilterContext.Provider>
	)
}
