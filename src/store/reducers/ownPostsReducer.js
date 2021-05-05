import { GET_OWN_POSTS } from "../actions/constants"

const initialState = {
    data: null
}

const ownPostsReducer = (state = initialState, { type, payload }) => {
    switch(type){
        case GET_OWN_POSTS:
            return {
                ...state,
                data: payload
            }
        default:
            return state
    }
}

export default ownPostsReducer;