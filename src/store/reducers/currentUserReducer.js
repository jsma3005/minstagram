import { GET_USER, SIGN_OUT } from "../actions/constants";

const initialState = {
    user: null
}

const currentUserReducer = (state = initialState, { type, payload }) => {
    switch(type){
        case GET_USER: 
            return {
                ...state,
                user: payload
            };
        case SIGN_OUT:
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
};

export default currentUserReducer;