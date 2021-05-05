import { useCallback, useEffect, useState } from 'react';
import { fire } from '../../services/firebase';
import cls from './NewPost.module.scss';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router';
import moment from 'moment';
import { useSelector } from 'react-redux';

const NewPost = () => {
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState('');
    const [imageURL, setImageURL] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const currentTime = moment().format();
    const { user } = useSelector(s => s.user);

    const addPost = useCallback(() => {
        fire.database()
        .ref(`posts/`)
        .push({
            username: user.username,
            uid: user.uid,
            description: content,
            images: imageURL,
            comments: [],
            likes: [],
            date: `${moment().format('L')} - ${moment().format('LTS')}`
        })
        alert('Пост добавлен!');
        setLoading(false)
        history.push('/');
    }, [content, history, imageURL, user?.uid, user?.username])


    useEffect(() => {
        if(files.length === 0) return;
        if(files.length === imageURL.length){
            addPost();
        }
    }, [imageURL, addPost, files.length])

    const handleSetFile = e => {
        const allFiles = [...e.target.files];
        setFiles(allFiles)
    }

    const submitPost = e => {
        e.preventDefault();
        const randomUid = uuidv4();

        if(content !== '' && user !== null && files.length !== 0){
            if(content.length <= 1000){
                const promises = [];
                files.forEach(item => {
                    const uploadTask = fire.storage()
                    .ref(`posts/${user.uid}/${currentTime}/${item.name}-${randomUid}`)
                    .put(item)
                    uploadTask.on('state_changed', 
                        res => {
                            setLoading(true);
                            const progress = (res.bytesTransferred / res.totalBytes) * 100;
                            if(res.state === fire.storage.TaskState.RUNNING){
                                console.log(`Progress: ${progress}%`);
                            }
                        },
                        err => {
                            console.log(err);
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                                setImageURL(prev => [...prev, url]);
                            })
                        }
                    )
                    promises.push(uploadTask);
                })

                Promise.all(promises)
            }else{
                alert('Описание не должно быть больше 1000 символов!')
            }
        }else{
            alert('Не все поля заполнены!');
        }
    }

    return(
        <div className={cls.root}>
            <div className={`card ${cls.card}`}>
                <div className={`card-header ${cls.cardHeader}`}>
                    <h3 className='text-center mb-0'>Новый пост</h3>
                </div>
                <div className={`card-body ${cls.cardBody}`}>
                    <form className={cls.form}>
                        <div className='mb-3'>
                            <textarea rows='5' onChange={e => setContent(e.target.value)} value={content} type='text' placeholder='Описание' className='form-control' />
                        </div>
                        <div className='mb-3 text-center'>
                            <input multiple type='file' onChange={handleSetFile} />
                        </div>
                    </form>
                </div>
                <div className={`card-footer ${cls.cardFooter} text-center`}>
                    <button disabled={loading ? true : false} onClick={submitPost} className='btn btn-primary btn-lg'>Создать</button>
                </div>
            </div>
        </div>
    )
}

export default NewPost;