import { GET_ALL_USERNAMES } from "../actions/constants"

const initialState = {
    users: null
}

const allUsernamesReducer = (state = initialState, { type, payload }) => {
    switch(type){
        case GET_ALL_USERNAMES:
            return {
                ...state,
                users: payload
            }
        default: 
            return state
    }
}

export default allUsernamesReducer;