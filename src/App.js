import { Redirect, Route, Switch } from "react-router";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import AllUsers from "./pages/AllUsers";
import AuthLayout from "./pages/Auth/AuthLayout/AuthLayout";
import Home from "./pages/Home/Home";
import NewPost from "./pages/NewPost";
import OwnPosts from "./pages/OwnPosts";
import SinglePost from "./pages/SinglePost";
import SingleUserPosts from "./pages/SingleUserPosts";
import ChangeEmail from "./pages/UserSettings/ChangeEmail";
import ChangePassword from "./pages/UserSettings/ChangePassword";
import ChangeUsername from "./pages/UserSettings/ChangeUsername";
import EditUser from "./pages/UserSettings/EditUser";
import Profile from "./pages/UserSettings/Profile";


const App = () => {
    return (
        <Switch>
            <PrivateRoute path='/' exact component={Home} />
            <PrivateRoute path='/post/:id' exact component={SinglePost} />
            <PrivateRoute path='/new-post' component={NewPost} />
            <PrivateRoute path='/own-posts' component={OwnPosts} />
            <PrivateRoute path='/user/:uid/posts' component={SingleUserPosts} />
            <PrivateRoute path='/all-users' component={AllUsers} />
            <PrivateRoute path='/profile' component={Profile} />
            <PrivateRoute path='/change-password' component={ChangePassword} />
            <PrivateRoute path='/change-email' component={ChangeEmail} />
            <PrivateRoute path='/change-user-profile' component={EditUser} />
            <PrivateRoute path='/change-username' component={ChangeUsername} />
            <Route path='/auth' component={AuthLayout} />
            <Redirect to='/' />
        </Switch>
    )
}

export default App;