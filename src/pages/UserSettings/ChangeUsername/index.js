import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { fire } from '../../../services/firebase';
import { getAllUsernamesAction } from '../../../store/actions/allUsernamesAction';
import cls from './ChangeUsername.module.scss'

const ChangeUsername = () => {
    const [newUsername, setNewUsername] = useState('');
    const currentUserUid = localStorage.getItem('minstagramAuth');
    const history = useHistory();
    const dispatch = useDispatch();
    const { users } = useSelector(s => s.allUsernames);
    const { user } = useSelector(s => s.user);

    // получение нынешнего логина
    useEffect(() => {
        if(user){
            setNewUsername(user.username);
        }else{
            setNewUsername('');
        }
    }, [user])

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
                dispatch(dispatch(getAllUsernamesAction(false)))
            }
        })
    }, [dispatch]);

    const handleChange = e => {
        e.preventDefault();

        if(newUsername !== ''){
            // проверка уникального логина
            const usernameCheck = users?.includes(newUsername);

            if(usernameCheck){
                alert('Указанный логин уже используется!')
            }else{
                fire.database().ref(`users/${currentUserUid}`).update({
                    username: newUsername
                })
                .then(() => {
                    alert('Успешно обновлено!')
                    history.goBack();
                })
                .catch(err => {
                    console.log(err);
                    alert(err.message);
                })
            }
        }else{
            alert('Поле не должно быть пустым!');
        }
    }

    return (
        <div className={cls.root}>
            <div className={`${cls.card} card`}>
                <div className='card-header'>
                    <h5 className='text-center mb-0'>Изменение логина</h5>
                </div>
                <div className='card-body'>
                    <div className='mb-0'>
                        <input value={newUsername} onChange={e => setNewUsername(e.target.value)}className='form-control' placeholder='Введите новый логин' />
                    </div>
                </div>
                <div className='card-footer text-center'>
                    <button className='btn btn-success' onClick={handleChange}>Изменить</button>
                </div>
            </div>
        </div>
    )
}

export default ChangeUsername