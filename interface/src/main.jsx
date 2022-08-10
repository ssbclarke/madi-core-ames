import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App'
import { AuthProvider } from './components/Auth/AuthProvider';
import { EntityFilterProvider } from './components/EntityList/EntityFilterContext';
import { TagFilterProvider} from './components/TagFilter/TagContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <EntityFilterProvider>
    <TagFilterProvider>
    <AuthProvider>
        <App tab="home" />
    </AuthProvider>
    </TagFilterProvider>
    </EntityFilterProvider>
);