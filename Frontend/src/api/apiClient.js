const Base_Url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

function getAuthHeaders(tokenOverride = null) {
    const token = localStorage.getItem('authToken');
    const currentToken = tokenOverride || token;
    return currentToken ? { "Authorization": `Bearer ${currentToken}` } : {};
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
    
    // Pour les requêtes GET, enlever le content-type si pas de body
    if (fetchOptions.method === 'GET' && !fetchOptions.body) {
        delete fetchOptions.headers['content-type'];
    }
    
    console.log('🚀 API Request:', {
        method: fetchOptions.method,
        url: url,
        hasAuth: !!fetchOptions.headers['Authorization']
    });
    
    let res = await fetch(url, fetchOptions);

    if (res.status === 401) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
            .then(token => {
                const newOptions = { ...fetchOptions, headers: { ...fetchOptions.headers, ...getAuthHeaders(token) } };
                return fetch(url, newOptions);
            });
        }

        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.error('❌ No refresh token available. Logging out.');
            // Ici, vous devriez probablement déconnecter l'utilisateur
            window.location.href = '/login'; // ou une autre logique de déconnexion
            return Promise.reject(new Error('No refresh token'));
        }

        try {
            const refreshRes = await fetch(`${Base_Url}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                },
            });

            if (!refreshRes.ok) {
                throw new Error('Failed to refresh token');
            }

            const { access_token } = await refreshRes.json();
            localStorage.setItem('authToken', access_token);
            processQueue(null, access_token);

            // Relancer la requête originale avec le nouveau token
            const newOptions = { ...fetchOptions, headers: { ...fetchOptions.headers, ...getAuthHeaders(access_token) } };
            res = await fetch(url, newOptions);

        } catch (error) {
            console.error('❌ Refresh token failed:', error);
            processQueue(error, null);
            // Déconnexion si le refresh token est invalide/expiré
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(error);
        } finally {
            isRefreshing = false;
        }
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.msg || errorData.message || `API request failed (${res.status})`);
    }

    if (res.status === 204) {
        return null;
    }

    return res.json();
}