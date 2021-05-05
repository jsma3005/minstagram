import { Link } from 'react-router-dom';
import cls from './UserCard.module.scss';

const UserCard = ({uid, avatar, username, link}) => {
    return (
        <div className='col-lg-3 mb-4' key={uid}>
            <div className='card'>
                <div 
                    className={`${cls.cardHeader} card-header`}
                    style={{
                        background: `url('${avatar}') center / cover no-repeat`
                    }}>
                </div>
                <div className='card-body'>
                    <h4 className='text-center mb-0'>{username}</h4>
                </div>
                <div className='card-footer text-center'>
                    <Link className='btn btn-info' to={`/user/${uid}/posts`}>Посты пользователя</Link>
                </div>
            </div>
        </div>
    )
}

export default UserCard;