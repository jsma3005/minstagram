import { GET_SINGLE_POST } from "../actions/constants"

const initialState = {
    singlePost: null
}

const singlePostReducer = (state = initialState, { type, payload }) => {
    switch(type){
        case GET_SINGLE_POST:
            return {
                ...state,
                singlePost: payload
            };
        case `${GET_SINGLE_POST}_FAILED`:
            return {
                ...state,
                singlePost: false
            }
        default: 
            return state
    }
}

export default singlePostReducer