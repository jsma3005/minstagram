import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from "react-router";
import { fire } from "../../services/firebase";
import { getUserAction } from "../../store/actions/currentUserAction";
import Sidebar from "../Sidebar";
import cls from './PrivateRoute.module.scss';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const dispatch = useDispatch();
    const {user} = useSelector(s => s.user);
    const currentUser = localStorage.getItem('minstagramAuth');

    useEffect(() => {
        if(!user){
            fire.database().ref(`/users/${currentUser}`).on('value', res => {
                dispatch(getUserAction(res.val()))
            })
        }else{
            return;
        }
    }, [user, currentUser, dispatch])


    return (
        <Route 
            {...rest}
            render={props => 
                currentUser ? (
                    <div className={cls.root}>
                        <div className={cls.sidebar}>
                            <Sidebar />
                        </div>
                        <div className={cls.content}>
                            <Component {...props} />
                        </div>
                    </div>
                ) : (
                    <Redirect 
                        to={{
                            pathname: '/auth',
                            state: {
                                from: props.location
                            }
                        }}
                    />
                )
            }
        />
    )
}