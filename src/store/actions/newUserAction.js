import { SET_NEW_USER } from "./constants"

export const newUserAction = data => {
    return {
        type: SET_NEW_USER,
        payload: data
    }
}