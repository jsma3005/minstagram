import { GET_OWN_POSTS } from "./constants"

export const ownPostsAction = data => {
    return {
        type: GET_OWN_POSTS,
        payload: data
    }
}