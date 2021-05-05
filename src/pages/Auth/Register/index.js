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



    // Sign up handle
    const signUp = e => {
        e.preventDefault();

        if(email !== '' && password !== '' && fullname !== '' && username !== '' && users){
            // проверка уникального логина
            const usernameCheck = users?.includes(username);
            
            if(usernameCheck){
                alert('Указанный логин уже используется!')
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
        }else{
            alert('Не все поля заполнены!');
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
                        <button disabled={loading ? true : false} onClick={signUp} type='submit' className='btn btn-primary'>Регистрация</button>
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