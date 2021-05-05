import { useState } from 'react';
import { useHistory } from 'react-router';
import { fire } from '../../../services/firebase';
import cls from './ChangePassword.module.scss';

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const passwordType = showPassword ? 'text' : 'password';
    const history = useHistory();

    const changeHandle = e => {
        e.preventDefault();

        if(password === '' && passwordCheck === ''){
            alert('Поля не должы быть пустыми!')
        }else{
            if(password !== passwordCheck){
                alert('Пароли не совпадают!');
            }else{
                fire.auth().currentUser.updatePassword(password)
                .then(() => {
                    alert('Успешно обновлено!');
                    setPassword('');
                    setPasswordCheck('');
                    history.goBack();
                })
                .catch(() => {
                    alert('Что-то пошло не так! Повторите позже!');
                    setPassword('');
                    setPasswordCheck('');
                })
            }
        }
    }

    const showPasswordHandle = e => {
        e.preventDefault();
        setShowPassword(prev => !prev);
    }

    return (
        <div className={cls.root}>
            <div className={`${cls.card} card`}>
                <div className='card-header'>
                    <h5 className='mb-0 text-center'>Изменение пароли</h5>
                </div>
                <div className='card-body'>
                    <div className='mb-3 d-flex align-items-center'>
                        <input type={passwordType} className='form-control' placeholder='Новый пароль' value={password} onChange={e => setPassword(e.target.value)} />
                        <button onClick={showPasswordHandle} className='btn btn-primary ml-2'>Показать</button>
                    </div>
                    <div>
                        <input type={passwordType} className='form-control' placeholder='Повторите новый пароль' value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} />
                    </div>
                </div>
                <div className='card-footer text-center'>
                    <button onClick={changeHandle} className='btn btn-success'>Поменять</button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;