import { createContext, useReducer, useContext, useCallback } from 'react';
import { getProjects } from '../api/projectApi';

const ProjectContext = createContext();

const initialState = {
    projects: [],
    loading: false,
    error: null
};

function projectReducer(state, action) {
    switch(action.type) {
        case 'LOADING_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'SET_PROJECTS':
            return {
                ...state,
                projects: action.payload,
                loading: false,
                error: null
            };
        case 'SET_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}

export const ProjectProvider = ({ children }) => {
    const [state, dispatch] = useReducer(projectReducer, initialState);

    // `useCallback` pour mémoriser la fonction et éviter les re-créations inutiles
    const fetchProjects = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            dispatch({ type: 'SET_PROJECTS', payload: [] });
            return;
        }

        dispatch({ type: 'LOADING_START' });
        try {
            const projects = await getProjects();
            dispatch({ type: 'SET_PROJECTS', payload: projects || [] });
        } catch (error) {
            console.error('Error fetching projects:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch projects' });
        }
    }, [dispatch]);

    return (
        // Exposer la fonction `fetchProjects` dans la valeur du contexte
        <ProjectContext.Provider value={{ state, dispatch, fetchProjects }}>
            {children}
        </ProjectContext.Provider>
    );
};

export function useProjects() {
    return useContext(ProjectContext);
}

export default ProjectContext;
