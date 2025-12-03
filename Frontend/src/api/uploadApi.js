import {apiFetch} from './apiClient.js';

// Uploader un fichier
export async function uploadFile(formData) {
    return apiFetch('/upload', {
        method: 'POST',
        body: formData
    });
}
    