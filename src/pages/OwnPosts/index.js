import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogCard from '../../components/BlogCard';
import { fire } from '../../services/firebase';
import { ownPostsAction } from '../../store/actions/ownPostsAction';
import cls from './OwnPosts.module.scss';

const OwnPosts = () => {
    const currentUserUid = localStorage.getItem('minstagramAuth');
    const dispatch = useDispatch();
    const {data} = useSelector(s => s.ownPosts);

    useEffect(() => {
        fire.database().ref('/posts').on('value', res => {
            const response = res.val() ? Object.entries(res.val()).map(item => {
                return {
                    ...item[1],
                    id: item[0]
                }
            }) : false;

            if(response){
                const filteredPosts = response.filter(item => item.uid === currentUserUid);
                dispatch(ownPostsAction(filteredPosts.reverse()));
            }
        })
    }, [currentUserUid, dispatch])

    return (
        <div className={cls.root}>
            <div className='row m-0'>
                {
                    (data && data.length !== 0) ? data.map(({images, description, username, date, id}) => (
                        <BlogCard images={images} description={description} username={username} date={date} id={id} key={id} />
                    )) : (
                        data === null ? (
                            <h5 className='text-center w-100'>Загрузка...</h5>
                        ) : <h5 className='text-center w-100'>Данные пустые</h5>
                    )
                }
            </div>
        </div>
    )
}

export default OwnPosts;