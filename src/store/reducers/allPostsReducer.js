import { GET_ALL_POSTS } from "../actions/constants"

const initialState = {
    data: null
}

const allPostsReducer = (state = initialState, { type, payload }) => {
    switch(type){
        case GET_ALL_POSTS:
            return {
                ...state,
                data: payload
            }
        default: 
            return state
    }
}

export default allPostsReducer;