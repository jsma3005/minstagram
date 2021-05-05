import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cls from './Register.module.scss';
import { fire } from '../../../services/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsernamesAction } from '../../../store/actions/allUsernamesAction';

const Register = () => {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const dispatch = useDispatch();
    const { users } = useSelector(s => s.allUsernames);

    // получение всех логинов
    useEffect(() => {
        fire.database().ref('/users').on('value', res => {
            if(res.val()){
                const response = Object.values(res.val()).map(item => item.username);
                if(response.length !== 0){
                    dispatch(getAllUsernamesAction(response))
                }else{
                    dispatch(getAllUsernamesAction(false))
                }
            }else{
                dispatch(getAllUsernamesAction(false))
            }
        })
    }, [dispatch]);



    // Sign up handle
    const signUp = e => {
        e.preventDefault();

        if(email !== '' && password !== '' && fullname !== '' && username !== '' && users){
            // проверка уникального логина
            const usernameCheck = users?.includes(username);
            
            if(usernameCheck){
                alert('Указанный логин уже используется!')
            }else{
                fire.auth().createUserWithEmailAndPassword(email, password)
                .then(res => {
                    const user = res.user;
                    user.updateProfile({
                        displayName: fullname
                    });
    
                    fire.database().ref(`users/${user.uid}`).set({
                        uid: user.uid,
                        username,
                        fullname,
                        email,
                        avatar: 'https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png'
                    }).catch(err => {
                        console.log(err);
                        alert(err.message);
                    })
                })
                .then(() => {
                    setFullname('');
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    history.push('/auth/login');
                })
            }
        }else if(users === null || !users){
            alert('Что-то пошло не так!');
        }else{
            alert('Не все поля заполнены!');
        }
    }


    return (
        <form className={cls.root}>
            <div className='card'>
                <div className='card-header'>
                    <h5 className='card-title mb-0 text-center'>Регистрация</h5>
                </div>
                <div className='card-body'>
                    <div className='mb-3'>
                        <input type='text' onChange={e => setFullname(e.target.value)} placeholder='ФИО' className='form-control' />
                    </div>
                    <div className='mb-3'>
                        <input type='text' onChange={e => setUsername(e.target.value)} placeholder='Имя пользователя' className='form-control' />
                    </div>
                    <div className='mb-3'>
                        <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' className='form-control' />
                    </div>
                    <div className='mb-3'>
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' className='form-control' />
                    </div>
                    <div className='text-center'>
                        <button onClick={signUp} type='submit' className='btn btn-primary'>Регистрация</button>
                        <p className='mt-3'>Есть аккаунт? <Link to='/auth/login'>авторизоваться</Link></p>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Register;