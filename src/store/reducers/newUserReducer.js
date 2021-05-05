import { SET_NEW_USER } from "../actions/constants";

const initialState = {
    newUser: null
}

const newUserReducer = (state = initialState, { type, payload }) => {
    switch(type){
        case SET_NEW_USER: 
            return {
                ...state,
                newUser: payload
            };
        default:
            return state;
    }
};

export default newUserReducer;