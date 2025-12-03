// Validation d'email
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation du mot de passe
export function validatePassword(password) {
    // Au moins 8 caractères
    return password && password.length >= 8;
}

// Validation du nom
export function validateName(name) {
    // Au moins 2 caractères
    return name && name.trim().length >= 2;
}

// Validation combinée pour l'inscription
export function validateRegisterForm(name, email, password) {
    const errors = {};

    if (!validateName(name)) {
        errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!validateEmail(email)) {
        errors.email = 'Veuillez entrer une adresse email valide';
    }

    if (!validatePassword(password)) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validation combinée pour la connexion
export function validateLoginForm(email, password) {
    const errors = {};

    if (!validateEmail(email)) {
        errors.email = 'Veuillez entrer une adresse email valide';
    }

    if (!password) {
        errors.password = 'Le mot de passe est requis';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
