import { GET_ALL_POSTS } from "./constants"

export const getAllPostsAction = data => {
    return {
        type: GET_ALL_POSTS,
        payload: data
    }
}