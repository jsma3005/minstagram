import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { fire } from '../../../services/firebase';
import cls from './ChangeEmail.module.scss';

const ChangeEmail = () => {
    const [email, setEmail] = useState('');
    const [oldEmail, setOldEmail] = useState('');
    const currentUser = localStorage.getItem('minstagramAuth');
    const history = useHistory();
    
    useEffect(() => {
        fire.database().ref(`/users/${currentUser}`)
        .on('value', res => {
            if(res.val()){
                setOldEmail(res.val().email);
            }else{
                setOldEmail('')
            }
        })
    }, [setOldEmail, currentUser]);

    const handleChangeEmail = e => {
        e.preventDefault();
        
        if(email !== ''){
            if(email.length <= 50){
                fire.auth().currentUser.updateEmail(email)
                .then(() => {
                    fire.database().ref(`/users/${currentUser}`).update({
                        email: email
                    }) 
                    .then(() => {
                        alert('Обновлено успешно!')
                        setEmail('');
                        history.goBack();
                    })
                    .catch(() => {
                        alert('Что-то пошло не так! Повторите позже!');
                        setEmail('');
                    })
                    
                })
                .catch(() => {
                    alert('Что-то пошло не так!');
                })
            }else{
                alert('Почта должна быть меньше 50 символов!');
            }
        }else{
            alert('Поле не должно быть пустым!')
        }
    }

    return (
        <div className={cls.root}>
            <div className={`${cls.card} card`}>
                <div className='card-header'>
                    <h5 className='mb-0 text-center'>Изменение электронной почты</h5>
                </div>
                <div className='card-body'>
                    <div className='mb-0 d-flex align-items-center'>
                        <label htmlFor='oldEmail mr-2'>
                            <span>Старая почта: </span>
                        </label>
                        <input value={oldEmail} id='oldEmail' type='text' disabled className='form-control' />
                    </div>
                    <div>
                        <input type='email' className='form-control' placeholder='Введите новую почту' onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className='card-footer text-center'>
                    <button className='btn btn-success' onClick={handleChangeEmail}>Поменять</button>
                </div>
            </div>
        </div>
    )
}

export default ChangeEmail;