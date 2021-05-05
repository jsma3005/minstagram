import { GET_ALL_USERNAMES } from "./constants"

export const getAllUsernamesAction = data => {
    return {
        type: GET_ALL_USERNAMES,
        payload: data
    }
}