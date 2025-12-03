import { createContext, useReducer, useEffect, useContext } from 'react';
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
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                dispatch({ type: 'LOADING_START' });
                const projects = await getProjects();
                dispatch({
                    type: 'SET_PROJECTS',
                    payload: projects
                });
            } catch (error) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: error.message
                });
            }
        };

        // Charger les projets uniquement si un token existe
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchProjects();
        }
    }, []);

    return (
        <ProjectContext.Provider value={{ state, dispatch }}>
            {children}
        </ProjectContext.Provider>
    );
};

export function useProjects() {
    return useContext(ProjectContext);
}

export default ProjectContext;
