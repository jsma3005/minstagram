import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { fire } from '../../../services/firebase';
import cls from './GoogleRegister.module.scss';

const GoogleRegister = () => {
    const { users } = useSelector(s => s.allUsers);
    const { newUser } = useSelector(s => s.newUser);
    const history = useHistory();
    const [username, setUsername] = useState('');

    useEffect(() => {
        if(!users){
            history.push('/auth/register');
        }
    }, [users, history]);

    const handleFinishSignUp = e => {
        e.preventDefault();
        
        if(username !== ''){
            fire.database().ref(`/users/${newUser?.uid}`).set({
                ...newUser,
                username: username.trim()
            })
            .then(() => {
                localStorage.setItem('minstagramAuth', newUser.uid);
                history.push('/');
            })
            .catch(() => {
                alert('Что-то пошло не так!');
            })
        }else{
            alert('Поле не заполнено!')
        }
    }

    return (
        <div className={cls.root}>
            <div className={`${cls.card} card`}>
                <div className='card-header'>
                    <h5 className='card-title mb-0 text-center'>Регистрация по Google</h5>
                </div>
                <div className='card-body'>
                    <input value={username} onChange={e => setUsername(e.target.value)} type='text' className='form-control' placeholder='Введите имя пользователя' />
                </div>
                <div className='card-footer text-center'>
                    <button onClick={handleFinishSignUp} className='btn btn-danger'>Зарегистрироваться</button>
                </div>
            </div>
        </div>
    )
}

export default GoogleRegister;