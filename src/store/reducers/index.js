import { combineReducers } from "redux";
import currentUserReducer from './currentUserReducer';
import ownPostsReducer from './ownPostsReducer';
import singlePostReducer from './singlePostReducer';
import allPostReducer from './allPostsReducer';
import allUsersReducer from './allUsersReducer';

const rootReducer = combineReducers({
    user: currentUserReducer,
    ownPosts: ownPostsReducer,
    singlePost: singlePostReducer,
    allPosts: allPostReducer,
    allUsers: allUsersReducer
});

export default rootReducer;