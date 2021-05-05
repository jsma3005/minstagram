import { Redirect, Route, Switch } from 'react-router';
import Login from '../Login';
import Register from '../Register';
import cls from './AuthLayout.module.scss';

const AuthLayout = () => {
    return (
        <div className={cls.root}>
            <div className="row m-0">
                <div className={`${cls.left} col-lg-5`}>
                    <h1>
                        Welcome to
                        <br />
                        <span>Minstagram</span>
                    </h1>
                </div>
                <div className={`${cls.right} col-lg-7`}>
                    <Switch>
                        <Route path='/auth/login' exact component={Login} />
                        <Route path='/auth/register' exact component={Register} />
                        <Redirect to='/auth/login'/>
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;