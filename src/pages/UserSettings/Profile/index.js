import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fire } from '../../../services/firebase';
import cls from './UserProfile.module.scss';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const currentUserUid = localStorage.getItem('minstagramAuth');

    

    useEffect(() => {
        fire.database().ref(`/users/${currentUserUid}`).on('value', res => {
            setUser(res.val());
        })
    }, [setUser, currentUserUid])

    if(!user){
        return (
            <h1 className='pt-4 text-center'>Загрузка...</h1>
        )
    }
    return (
        <div className={cls.root}>
            <div className={`${cls.card} card`}>
                <div className='card-header p-0'>
                    <div 
                        className={cls.cardImage}
                    >
                        <img alt='User logo' src={user.avatar} />
                    </div>
                </div>
                <div className={`${cls.cardBody} card-body`}>
                    <ul>
                        <li>
                            <span>ФИО: </span>
                            <b>{user.fullname}</b>
                        </li>
                        <li>
                            <span>Логин:</span>
                            <b>{user.username}</b>
                        </li>
                        <li>
                            <span>Электронная почта: </span>
                            <b>{user.email}</b>
                        </li>
                    </ul>
                </div>
                <div className='card-footer'>
                    <div className={cls.buttons}>
                        <Link to='/change-password' className='btn btn-danger'>Поменять пароль</Link>
                        <Link to='/change-username' className='btn btn-success'>Поменять логин</Link>
                        <Link to='/change-email' className='btn btn-info'>Поменять почту</Link>
                        <Link to='/change-user-profile' className='btn btn-primary'>Редактировать данные</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile