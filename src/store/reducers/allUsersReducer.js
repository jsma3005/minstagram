import { GET_ALL_USERS } from "../actions/constants"

const initialState = {
    users: null
}

const allUsersReducer = (state = initialState, { type, payload }) => {
    switch(type){
        case GET_ALL_USERS:
            return {
                ...state,
                users: payload
            }
        default: 
            return state
    }
}

export default allUsersReducer;