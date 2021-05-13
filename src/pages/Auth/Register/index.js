import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cls from './Register.module.scss';
import { fire, provider } from '../../../services/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsernamesAction } from '../../../store/actions/allUsernamesAction';
import { getAllUsersAction } from '../../../store/actions/allUsersAction';
import { newUserAction } from '../../../store/actions/newUserAction';

const Register = () => {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [fullnameDirty, setFullnameDirty] = useState(false);
    const [usernameDirty, setUsernameDirty] = useState(false);
    const [emailDirty, setEmailDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);

    const [fullnameError, setFullnameError] = useState('ФИО не может быть пустым!')
    const [usernameError, setUsernameError] = useState('Имя пользователя не может быть пустым!');
    const [emailError, setEmailError] = useState('Email не может быть пустым!');
    const [passwordError, setPasswordError] = useState('Пароль не может быть пустым!');
    const [isButtonValid, setIsButtonValid] = useState(false);

    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const { users } = useSelector(s => s.allUsernames);
    const { users: allUsers } = useSelector(s => s.allUsers);

    // получение всех логинов
    useEffect(() => {
        fire.database().ref('/users').on('value', res => {
            if(res.val()){
                const response = Object.values(res.val()).map(item => item.username);
                const allUsersResponse = Object.values(res.val()).map(item => item);
                if(response.length !== 0){
                    dispatch(getAllUsersAction(allUsersResponse))
                    dispatch(getAllUsernamesAction(response))
                }else{
                    dispatch(getAllUsersAction(false))
                    dispatch(getAllUsernamesAction(false))
                }
            }else{
                dispatch(getAllUsernamesAction(false))
            }
        })
    }, [dispatch]);


    useEffect(() => {
        if(emailError || passwordError || usernameError || fullnameError){
            setIsButtonValid(false)
        }else{
            setIsButtonValid(true)
        }
    }, [emailError, passwordError, usernameError, fullnameError]);


    // Sign up handle
    const signUp = e => {
        e.preventDefault();

        if(users){
            // проверка уникального логина
            const usernameCheck = users?.includes(username);
            
            if(usernameCheck){
                alert('Указанный логин уже используется!');
                setIsButtonValid(false);
                setUsername('');
            }else{
                setLoading(true);
                fire.auth().createUserWithEmailAndPassword(email, password)
                .then(res => {
                    const user = res.user;
                    user.updateProfile({
                        displayName: fullname
                    });

                    fire.database().ref(`users/${user.uid}`).set({
                        uid: user.uid,
                        username: username.trim(),
                        fullname: fullname.trim(),
                        email: email.trim(),
                        avatar: 'https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png'
                    }).catch(err => {
                        setLoading(false);
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
        }
    }

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
            case 'username':
                setUsernameDirty(true);
                break;
            case 'fullname':
                setFullnameDirty(true);
                break;
            default: 
                setEmailDirty(false);
                setPasswordDirty(false);
                setFullnameDirty(false);
                setUsernameDirty(false);
        }
    }

    // username and fullname handlers
    const usernameHandler = e => {
        const value = e.target.value;
        setUsername(value);
        if(value.length < 3){
            setUsernameError('Имя пользователя не может быть меньше 3 символов!');
            if(!value){
                setUsernameError('Имя пользователя не может быть пустым!');
            }
        }else{
            setUsernameError('');
        }
    }

    const fullnameHandler = e => {
        const value = e.target.value;
        setFullname(value);
        if(value.length < 3){
            setFullnameError('ФИО не может быть меньше 3 символов!');
            if(!value){
                setFullnameError('ФИО не может быть пустым!');
            }
        }else{
            setFullnameError('');
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
                    <h5 className='card-title mb-0 text-center'>Регистрация</h5>
                </div>
                <div className='card-body'>
                    <div className='mb-3'>
                        {
                            (fullnameDirty && fullnameError) && <div style={{color: 'red', marginBottom: '.3rem'}}>{fullnameError}</div>
                        }
                        <input 
                            name='fullname' 
                            type='text' 
                            onBlur={blurHandler}
                            onChange={fullnameHandler} 
                            placeholder='ФИО' 
                            className='form-control' 
                            value={fullname}
                        />
                    </div>
                    <div className='mb-3'>
                        {
                            (usernameDirty && usernameError) && <div style={{color: 'red', marginBottom: '.3rem'}}>{usernameError}</div>
                        }
                        <input 
                            name='username' 
                            type='text' 
                            value={username}
                            onBlur={blurHandler}
                            onChange={usernameHandler} 
                            placeholder='Имя пользователя' 
                            className='form-control' 
                        />
                    </div>
                    <div className='mb-3'>
                        {
                            (emailDirty && emailError) && <div style={{color: 'red', marginBottom: '.3rem'}}>{emailError}</div>
                        }
                        <input 
                            name='email' 
                            type='email' 
                            value={email} 
                            onBlur={blurHandler}
                            onChange={emailHandler} 
                            placeholder='Email' className='form-control' 
                        />
                    </div>
                    <div className='mb-3'>
                        {
                            (passwordDirty && passwordError) && <div style={{color: 'red', marginBottom: '.3rem'}}>{passwordError}</div>
                        }
                        <input 
                            name='password' 
                            type='password' 
                            value={password} 
                            onBlur={blurHandler}
                            onChange={passwordHandler} placeholder='Password' 
                            className='form-control' 
                        />
                    </div>
                    <div className='text-center'>
                        <button disabled={!isButtonValid || loading} onClick={signUp} type='submit' className='btn btn-primary'>Регистрация</button>
                        <p className='mt-3'>Есть аккаунт? <Link to='/auth/login'>авторизоваться</Link></p>
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

export default Register;