import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { fire } from '../../../services/firebase';
import cls from './Login.module.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const signIn = e => {
        e.preventDefault();

        if(email !== '' && password !== ''){
            fire.auth().signInWithEmailAndPassword(email, password)
            .then(res => {
                alert(`Добро пожаловать, ${res.user.displayName}!`);
                setEmail('');
                setPassword('');
                localStorage.setItem('minstagramAuth', res.user.uid);
            })
            .then(() => {
                history.push('/');
            })
            .catch(err => {
                console.log(err);
                alert(err.message);
            })
        }else{
            alert('Не все поля заполнены!')
        }
    }

    return (
        <form className={cls.root}>
            <div className='card'>
                <div className='card-header'>
                    <h5 className='card-title mb-0 text-center'>Авторизация</h5>
                </div>
                <div className='card-body'>
                    <div className='mb-3'>
                        <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' className='form-control' />
                    </div>
                    <div className='mb-3'>
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' className='form-control' />
                    </div>
                    <div className='text-center'>
                        <button onClick={signIn} className='btn btn-primary'>Авторизация</button>
                        <p className='mt-3'>Нет аккаунта? <Link to='/auth/register'>зарегистрироваться</Link></p>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Login