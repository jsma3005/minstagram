import { Link } from 'react-router-dom';
import { cuttedDescription } from '../../utils/funcs';
import cls from './BlogCard.module.scss';

const BlogCard = ({username, date, id, description, images}) => {
    return (
        <div className='col-lg-6 mb-3'>
            <div className='card'>
                <div className='row m-0'>
                    <div className='col-lg-6 p-3'>
                        <p><b>{username}</b></p>
                        <p>
                            <span>{date}</span>
                        </p>
                        <p className={cls.description}>{description ? cuttedDescription(description) : null}</p>
                        <Link className='btn btn-info' to={`/post/${id}`}>Подробнее...</Link>
                    </div>
                    <div className='col-lg-6 m-0 p-0'>
                        <div 
                            className={cls.cardImage} 
                            style={{
                                background: `url('${images[0]}') center / cover no-repeat`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogCard;