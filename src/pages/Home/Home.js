import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogCard from '../../components/BlogCard';
import { fire } from '../../services/firebase';
import { getAllPostsAction } from '../../store/actions/allPostsAction';
import cls from './Home.module.scss';

const Home = () => {
    const dispatch = useDispatch();
    const { data } = useSelector(s => s.allPosts);

    useEffect(() => {
        if(data){
            return;
        }else{
            fire.database().ref(`/posts`).on('value', res => {
                console.log('Request to DB all posts');
                const response = res.val() ? Object.entries(res.val()).map(item => {
                    return {
                        ...item[1],
                        id: item[0]
                    }
                }) : false;
                dispatch(getAllPostsAction(response?.reverse()))
            })
        }
        
    }, [dispatch, data]);

    return(
        <div className={cls.root}>
            <div className='row m-0'>
                {
                    data ? data.map(({images, description, username, date, id}) => (
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

export default Home;