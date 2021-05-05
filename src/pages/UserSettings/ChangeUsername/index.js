import { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { fire } from '../../../services/firebase';
import cls from './ChangeUsername.module.scss'

const ChangeUsername = () => {
    const [newUsername, setUsername] = useState('');
    const currentUserUid = localStorage.getItem('minstagramAuth');
    const [users, setUsers] = useState(null);
    const history = useHistory();


    // получение нынешнего логина
    useEffect(() => {
        fire.database().ref(`/users/${currentUserUid}`).on('value', res => {
            if(res.val()){
                setUsername(res.val().username)
            }else{
                setUsername('');
            }
        })
    }, [setUsername, currentUserUid])


    // получение всех логинов
    useEffect(() => {
        fire.database().ref('/users').on('value', res => {
            if(res.val()){
                const response = Object.values(res.val()).map(item => item.username);
                if(response.length !== 0){
                    setUsers(response);
                }else{
                    setUsers(false);
                }
            }else{
                setUsers(false);
            }
        })
    }, [setUsers]);

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
                        <input value={newUsername} onChange={e => setUsername(e.target.value)}className='form-control' placeholder='Введите новый логин' />
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