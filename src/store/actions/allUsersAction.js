import { GET_ALL_USERS } from "./constants"

export const getAllUsersAction = data => {
    return {
        type: GET_ALL_USERS,
        payload: data
    }
}