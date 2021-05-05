import { GET_USER, SIGN_OUT } from "./constants"

export const getUserAction = data => {
    return {
        type: GET_USER,
        payload: data
    }
};

export const signOutAction = () => {
    return {
        type: SIGN_OUT
    }
}