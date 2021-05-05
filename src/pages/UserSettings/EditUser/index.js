import { useEffect, useState } from 'react';
import { fire } from '../../../services/firebase';
import cls from './EditUser.module.scss';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

const EditUser = () => {
    const unknownImageUrl = 'https://st3.depositphotos.com/3581215/18899/v/600/depositphotos_188994514-stock-illustration-vector-illustration-male-silhouette-profile.jpg';
    const [oldAvatar, setOldAvatar] = useState(null);
    const [newAvatar, setNewAvatar] = useState(null);
    const currentUserUid = localStorage.getItem('minstagramAuth');
    const [loading, setLoading] = useState(false);

    const [newFullname, setNewFullname] = useState('');
    const history = useHistory();
    const { user } = useSelector(s => s.user);

    useEffect(() => {
        if(user){
            setOldAvatar(user.avatar);
            setNewFullname(user.fullname);
        }else{
            setOldAvatar(false)
        }
    }, [user])


    const handleChangeProfile = e => {
        e.preventDefault();
        const randomUid = uuidv4();

        if(newAvatar !== null && newFullname !== ''){
            fire.storage().ref(`/users/${currentUserUid}`).list().then(res => {
                const checkIsEmpty = res._delegate.items;
                if(checkIsEmpty.length === 0){
                    const uploadFile = fire.storage().ref(`/users/${currentUserUid}/${newAvatar.name}-${randomUid}`).put(newAvatar);

                    uploadFile.on('state_changed', 
                        res => {
                            setLoading(true)
                        },
                        err => {
                            console.log('Что-то пошло не так!');
                        },
                        () => {
                            uploadFile.snapshot.ref.getDownloadURL().then(url => {
                                fire.database().ref(`/users/${currentUserUid}`).update({
                                    avatar: url,
                                    fullname: newFullname
                                }).then(() => {
                                    fire.auth().currentUser.updateProfile({
                                        displayName: newFullname
                                    }).then(() => {
                                        setLoading(false);
                                        alert('Успешно обновлено!');
                                        history.goBack();
                                    })
                                })
                            })
                        }
                    )
                    console.log('На пустой был добавлен файл!');
                }else{
                    fire.storage().ref(checkIsEmpty[0]._location.path).delete().then(() => {
                        const uploadFile = fire.storage().ref(`/users/${currentUserUid}/${newAvatar.name}-${randomUid}`).put(newAvatar);

                        uploadFile.on('state_changed', 
                            res => {
                                setLoading(true)
                            },
                            err => {
                                console.log('Что-то пошло не так!');
                            },
                            () => {
                                uploadFile.snapshot.ref.getDownloadURL().then(url => {
                                    fire.database().ref(`/users/${currentUserUid}`).update({
                                        avatar: url,
                                        fullname: newFullname
                                    }).then(() => {
                                        fire.auth().currentUser.updateProfile({
                                            displayName: newFullname
                                        }).then(() => {
                                            setLoading(false);
                                            alert('Успешно обновлено!');
                                            history.goBack();
                                        })
                                    })
                                })
                            }
                        )
                        console.log('Файл который был удален и был добавлен новый');
                    })
                }
            })
        }else if(newAvatar === null && newFullname !== ''){
            fire.database().ref(`/users/${currentUserUid}`).update({
                fullname: newFullname
            }).then(() => {
                fire.auth().currentUser.updateProfile({
                    displayName: newFullname
                }).then(() => {
                    setLoading(false);
                    alert('Успешно обновлено!');
                    history.goBack();
                })
            })
        }else{
            history.goBack();
        }

    }


    return (
        <div className={cls.root}>
            <div className={`${cls.card} card`}>
                <div className='card-header'>
                    <h5 className='text-center mb-0'>Изменение профиля пользователя</h5>
                </div>
                <div className='card-body'>
                    <div className={cls.avatar}>
                        <div className={cls.oldAvatar}>
                            {
                                oldAvatar === null ? (
                                    <p className='text-center'>Загрузка...</p>
                                ) : oldAvatar ? (
                                    <img 
                                        alt='User old logo' src={oldAvatar} 
                                    />
                                ) : <img alt='User unknown logo' src={unknownImageUrl} />
                            }
                        </div>
                        <div className={cls.newAvatar}>
                            <input type='file' className='text-center' onChange={e => setNewAvatar(e.target.files[0])} />
                        </div>
                    </div>
                    <hr className='dropdown-divider mt-4 mb-4' />
                    <div>
                        <div className='mb-3'>
                            <input className='form-control' placeholder='Введите новое ФИО' onChange={e => setNewFullname(e.target.value)} value={newFullname} />
                        </div>
                    </div>
                </div>
                <div className='card-footer text-center'>
                    <button disabled={loading ? true : false} className='btn btn-success' onClick={handleChangeProfile}>Поменять</button>
                </div>
            </div>
        </div>
    )
}

export default EditUser;