import { GET_SINGLE_POST } from "./constants"

export const singlePostAction = data => {
    return {
        type: GET_SINGLE_POST,
        payload: data
    }
}

export const singlePostErrorAction = () => {
    return {
        type: `${GET_SINGLE_POST}_FAILED`
    }
}