import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import BlogCard from '../../components/BlogCard';
import { fire } from '../../services/firebase';
import cls from './SingleUserPosts.module.scss';

const SingleUserPosts = () => {
    const { uid } = useParams();
    const [posts, setPosts] = useState(null);
    
    useEffect(() => {
        fire.database().ref(`/posts`).on('value', res => {
            if(res.val()){
                const response = Object.entries(res.val()).map(item => {
                    return {
                        ...item[1],
                        id: item[0]
                    }
                });

                const filteredPosts = response.filter(item => item.uid === uid);
                if(filteredPosts.length !== 0){
                    setPosts(filteredPosts);
                }else{
                    setPosts(false);
                }
            }else{
                setPosts(false);
            }
        })
    }, [setPosts, uid])

    return (
        <div className={cls.root}>
            <div className='row m-0'>
                {
                    posts === null ? (
                        <h4 className='text-center w-100'>Загрузка...</h4>
                    ) : !posts ? (
                        <h4 className='text-center w-100'>Данные пусты...</h4>
                    ) : posts.map(({username, date, id, description, images}) => (
                        <BlogCard key={id} username={username} date={date} id={id} description={description} images={images} />
                    ))
                }
            </div>
        </div>
    )
}

export default SingleUserPosts;