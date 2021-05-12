import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { fire, provider } from '../../../services/firebase';
import { getAllUsersAction } from '../../../store/actions/allUsersAction';
import { newUserAction } from '../../../store/actions/newUserAction';
import cls from './Login.module.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailDirty, setEmailDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [emailError, setEmailError] = useState('Email не может быть пустым!')
    const [passwordError, setPasswordError] = useState('Пароль не может быть пустым!');
    const [isButtonValid, setIsButtonValid] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const { users: allUsers } = useSelector(s => s.allUsers);

    useEffect(() => {
        fire.database().ref('/users').on('value', res => {
            if(res.val()){
                const allUsersResponse = Object.values(res.val()).map(item => item);
                if(allUsersResponse.length !== 0){
                    dispatch(getAllUsersAction(allUsersResponse))
                }else{
                    dispatch(getAllUsersAction(false))
                }
            }else{
                dispatch(getAllUsersAction(false))
            }
        })
    }, [dispatch]);

    useEffect(() => {
        if(emailError || passwordError){
            setIsButtonValid(false)
        }else{
            setIsButtonValid(true)
        }
    }, [emailError, passwordError]);

    const googleAuthHandler = e => {
        e.preventDefault();
        fire.auth().signInWithPopup(provider)
        .then(({ user }) => {
            // проверка уникального uid
            const uidCheck = allUsers.filter(({uid}) => uid.includes(user.uid));

            if(uidCheck.length !== 0){
                localStorage.setItem('minstagramAuth', user.uid);
                history.push('/');
            }else{
                dispatch(newUserAction({
                    uid: user.uid,
                    fullname: user.displayName,
                    email: user.email,
                    avatar: user.photoURL
                }))
                history.push('/auth/register/google');
            }
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    const signIn = e => {
        e.preventDefault();
        setLoading(true);

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
            setLoading(false);
            switch(err.code){
                case 'auth/wrong-password':
                    alert('Неправильный пароль!');
                    setPassword('');
                    setIsButtonValid(false);
                    break;
                case 'auth/user-not-found':
                    alert('Пользователь с таким email не найден! Пожалуйста зарегистрируйтесь!');
                    setEmail('');
                    setPassword('');
                    setIsButtonValid(false);
                    break;
                default: 
                    return;
            }
        })
    }


    // Validation
    const blurHandler = e => {
        const name = e.target.name;

        switch(name){
            case 'email':
                setEmailDirty(true);
                break;
            case 'password':
                setPasswordDirty(true)
                break;
            default: 
                setEmailDirty(false);
                setPasswordDirty(false);
        }
    }

    // Email Handler 
    const emailHandler = e => {
        const value = e.target.value;
        setEmail(value);
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(value).toLowerCase())){
            setEmailError('Некорректный email');
        }else{
            setEmailError('');
        }
    }

    // Password Handler
    const passwordHandler = e => {
        const value = e.target.value;
        setPassword(value);
        if(value.length < 4){
            setPasswordError('Пароль не может быть меньше 4 символов');
            if(!value){
                setPasswordError('Пароль не может быть пустым!');
            }
        }else{
            setPasswordError('');
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
                        {
                            (emailDirty && emailError) && <div style={{color: 'red', marginBottom: '.3rem'}}>{emailError}</div>
                        }
                        <input 
                            onBlur={blurHandler}
                            name='email' 
                            type='email' 
                            value={email} 
                            onChange={emailHandler} 
                            placeholder='Email' 
                            className='form-control' 
                        />
                    </div>
                    <div className='mb-3'>
                        {
                            (passwordDirty && passwordError) && <div style={{color: 'red', marginBottom: '.3rem'}}>{passwordError}</div>
                        }
                        <input 
                            onBlur={blurHandler}
                            name='password' 
                            type='password' 
                            value={password} 
                            onChange={passwordHandler} placeholder='Password' 
                            className='form-control' 
                        />
                    </div>
                    <div className='text-center'>
                        <button disabled={!isButtonValid || loading} onClick={signIn} className='btn btn-primary'>Авторизация</button>
                        <p className='mt-3'>Нет аккаунта? <Link to='/auth/register'>зарегистрироваться</Link></p>
                        <div className='mt-3'>
                            {
                                allUsers ? (
                                    <>
                                        <p>Или авторизуйтесь через: </p>
                                        <button onClick={googleAuthHandler} className={cls.googleAuthBtn}>
                                            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png' title='Google' alt='Google' />
                                        </button>
                                    </>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Login