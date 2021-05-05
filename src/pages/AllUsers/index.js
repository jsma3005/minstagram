import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserCard from '../../components/UserCard';
import { fire } from '../../services/firebase';
import { getAllUsersAction } from '../../store/actions/allUsersAction';
import cls from './AllUsers.module.scss';

const AllUsers = () => {
    const dispatch = useDispatch();
    const { users } = useSelector(s => s.allUsers);

    useEffect(() => {
        if(users){
            return
        }else{
            fire.database().ref('/users').on('value', res => {
                const users = res.val() ? Object.values(res.val()).map(item => item) : false;
                dispatch(getAllUsersAction(users));
            })
        }
    }, [dispatch, users])

    const handleSearch = e => {
        const searchString = e.target.value.toUpperCase();
        fire.database().ref('/users').on('value', res => {
            const fetchedUsers = res.val() ? Object.values(res.val()).map(item => item) : false;
            if(searchString !== ''){
                const filteredUsers = fetchedUsers.filter(item => item.username.toUpperCase().includes(searchString));
                // setUsers(filteredUsers);
                dispatch(getAllUsersAction(filteredUsers))
            }else{
                // setUsers(fetchedUsers);
                dispatch(getAllUsersAction(fetchedUsers))
            }
        })
    }

    return (
        <div className={cls.root}>
            <div className={`${cls.searchBar} text-center`}>
                <input onChange={handleSearch} placeholder='Поиск пользователей по никнейму' className='form-control' />
            </div>
            <div className='row m-0'>
                {
                    users ? users.map(({uid, avatar, username}) => (
                        <UserCard uid={uid} avatar={avatar} username={username} key={uid} />
                    )) : (
                        users === null ? (
                            <h5 className='text-center w-100'>Загрузка...</h5>
                        ) : <h5 className='text-center w-100'>Данные пустые</h5>
                    )
                }
            </div>
        </div>
    )
}

export default AllUsers;