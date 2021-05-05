import { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import GoogleRegister from '../GoogleRegister';
import Login from '../Login';
import Register from '../Register';
import cls from './AuthLayout.module.scss';

const AuthLayout = () => {
    const currentUserUid = localStorage.getItem('minstagramAuth');
    const history = useHistory();

    useEffect(() => {
        if(currentUserUid){
            history.push('/');
        }
    }, [history, currentUserUid])
    
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
                        <Route path='/auth/register/google' component={GoogleRegister} />
                        <Redirect to='/auth/login'/>
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;