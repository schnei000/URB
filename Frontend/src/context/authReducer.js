export const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null
}

export default function authReducer(state,action) {
    switch(action.type) {
        case "RESTORE_SESSION":
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token
            };
            case "AUTH_START":
                return {
                    ...state,
                    loading: true,
                    error: null
                };
            case "AUTH_SUCCESS":
                return {
                    ...state,
                    user: action.payload.user,
                    token: action.payload.token,
                    loading: false,
                    error: null
                };
            case "AUTH_FAILURE":
                return {
                    ...state,
                    loading: false,
                    error: action.error
                };
            case "LOGOUT":
                return {
                    ...initialState
                };
            default:
                return state;

}
}