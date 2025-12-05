const Base_Url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    console.log('📌 Token from localStorage:', token); // DEBUG
    return token ? { "Authorization": `Bearer ${token}` } : {};
}

export async function apiFetch(endpoint, options = {}) {
    const url = `${Base_Url}${endpoint}`;
    
    const defaultHeaders = {
        "content-type": "application/json",
        ...getAuthHeaders()
    };

    const fetchOptions = {
        method: options.method || 'GET',
        headers: {
            ...defaultHeaders,
            ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : null
    };
    // si Body est un FormData, on ne stringify pas et on enlève le content-type

    if (options.body instanceof FormData){
        delete fetchOptions.headers['content-type'];
        fetchOptions.body = options.body;
    }
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData);
        throw new Error(errorData.message || 'API request failed');
    }
    if (res.status === 204) {
        return null;
    }
    return res.json();
}