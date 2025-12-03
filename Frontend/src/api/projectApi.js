import {apiFetch} from './apiClient.js';

// recuperons la liste des projets
export async function getProjects() {
    return apiFetch('/projects', {
        method: 'GET'
    });
}

// recuperons un projet par son id
export async function getProjectById(projectId) {
    return apiFetch(`/projects/${projectId}`, {
        method: 'GET'
    });
}

// creer un nouveau projet
export async function createProject(projectData) {
    return apiFetch('/projects', {
        method: 'POST',
        body: projectData
    });
}

// mettre a jour un projet
export async function updateProject(projectId, projectData) {
    return apiFetch(`/projects/${projectId}`, {
        method: 'PUT',
        body: projectData
    });
}

// supprimer un projet
export async function deleteProject(projectId) {
    return apiFetch(`/projects/${projectId}`, {
        method: 'DELETE'
    });
}