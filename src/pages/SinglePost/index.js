import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { fire } from "../../services/firebase";
import cls from './SinglePost.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination, Autoplay } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/autoplay';
import moment from "moment";
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { useDispatch, useSelector } from "react-redux";
import { singlePostAction, singlePostErrorAction } from "../../store/actions/singlePostAction";

SwiperCore.use([Pagination, Autoplay]);

const SinglePost = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { singlePost } = useSelector(s => s.singlePost);
    const [comment, setComment] = useState('');
    const { user } = useSelector(s => s.user);
    const [commentsList, setCommentsList] = useState(null);
    const currentTime = `${moment().format('L')} - ${moment().format('LTS')}`;
    const currentUserUid = localStorage.getItem('minstagramAuth');
    const history = useHistory();

    // fetch single post
    useEffect(() => {
        fire.database().ref(`/posts/${id}`).on('value', res => {
            if(res.val()){
                dispatch(singlePostAction(res.val()));
            }else{
                dispatch(singlePostErrorAction())
            }
        })
    }, [id, dispatch]);

    // fetch post's comments
    useEffect(() => {
        fire.database().ref(`/posts/${id}/comments`).on('value', res => {
            if(res.val()){
                const response = Object.entries(res.val()).map(item => {
                    return {
                        ...item[1],
                        id: item[0]
                    }
                });
                setCommentsList(response);
            }else{
                setCommentsList(false);
            }
        })
    }, [setCommentsList, id])


    const handleCommentChange = e => {
        const value = e.target.value;
        setComment(value);
    }

    const addComment = e => {
        e.preventDefault();
        if(comment !== '' && user){
            if(comment.length <= 250){
                fire.database().ref(`/posts/${id}/comments`).push({
                    comment: comment,
                    date: currentTime,
                    user: user
                }).then(() => {
                    alert('?????????????? ??????????????????!')
                    setComment('');
                })
            }else{
                alert('?????????????????????? ???? ???????????? ???????? ?????????? 250 ????????????????!')
            }
        }else if(comment === ''){
            alert('???????? ???? ???????????? ???????? ????????????!')
        }else{
            alert('??????-???? ?????????? ???? ??????!');
        }
    }


    // delete comment
    const deleteComment = (event, commentId) => {
        event.preventDefault();
        const askDelete = window.confirm('???? ??????????????, ?????? ???????????? ???????????????');
        if(!askDelete) return;

        fire.database().ref(`/posts/${id}/comments/${commentId}`).remove()
        .then(() => {
            alert('?????????????? ??????????????!');
        })
        .catch(() => {
            alert('??????-???? ?????????? ???? ??????!');
        })
    }


    // edit comment
    const editComment = (event, currentComment,commentId) => {
        event.preventDefault();
        const askEdit = window.confirm('???? ??????????????, ?????? ???????????? ?????????????????');
        if(!askEdit){
            return
        }else{
            const newComment = prompt('?????????????? ?????????? ??????????', currentComment);
            if(newComment.length >= 250){
                alert('?????????????????????? ???? ???????????? ?????????????????? ?????????? 250 ????????????????!')
            }else if(newComment.length === ''){
                alert('???????? ???? ???????????? ???????? ????????????!')
            }else{
                fire.database().ref(`/posts/${id}/comments/${commentId}`).update({
                    comment: newComment,
                    editState: {
                        state: true,
                        editedDate: currentTime,
                    }
                }).then(() => {
                    alert('?????????????? ??????????????????!')
                }).catch(() => {
                    alert('??????-???? ?????????? ???? ??????!');
                })
            }
        }
    }


    // delete post
    const deletePost = e => {
        e.preventDefault();
        const askDelete = window.confirm('???? ??????????????, ?????? ???????????? ?????????????? ???????????? ?????????');
        if(askDelete){
            fire.database().ref(`/posts/${id}`).remove()
            .then(() => {
                alert('?????????????? ??????????????!');
                history.goBack();
            })
            .catch(() => {
                alert('??????-???? ?????????? ???? ??????!');
            })
        }else{
            return;
        }
    }

    // edit post
    const editPost = e => {
        e.preventDefault();

        fire.database().ref(`/posts/${id}`).update({
            description: prompt('?????????????? ?????????? ????????????????', singlePost.description)
        })
        .then(() => {
            alert('?????????????? ??????????????????!');
        })
        .catch(() => {
            alert('??????-???? ?????????? ???? ??????!')
        })
    }

    return (
        <div className={cls.root}>
            {
                singlePost ? (
                    <div className={cls.slider}>
                        <div className={cls.editors}>
                            {
                                currentUserUid === singlePost.uid ? (
                                    <>
                                        <AiFillDelete onClick={deletePost} className={cls.deletePost} />
                                        <AiFillEdit onClick={editPost} className={cls.editPost} />
                                    </>
                                ) : null
                            }
                        </div>
                        <div className='card'>
                            <div className='card-header p-0'>
                                <Swiper
                                    loop={true}
                                    pagination={true}
                                    autoplay={{
                                        delay: 2000
                                    }}
                                >
                                    {
                                        singlePost.images.map((item, index) => (
                                            <SwiperSlide 
                                                className={cls.sliderImg} 
                                                style={{
                                                    background: `url('${item}') center / cover no-repeat`
                                                }}
                                                key={index}
                                            >    
                                            </SwiperSlide>
                                        )) 
                                    }
                                </Swiper>
                            </div>
                            <div className='card-body'>
                                <h5 className='mb-1'>{singlePost.username}</h5>
                                <small>{singlePost.date}</small>
                                <hr className="dropdown-divider" />
                                <p>{singlePost.description}</p>
                                <hr className="dropdown-divider" />
                                <div className={cls.comment}>
                                    <div className={cls.commentList}>
                                        {
                                            commentsList ? (
                                                commentsList.map(({comment, user, date, id, editState}) => (
                                                    <div className='row mb-3 align-items-center' key={id}>
                                                        <div 
                                                            className='col-lg-1'    
                                                        >
                                                            <img 
                                                                src={user.avatar} alt='User logo' 
                                                                className={cls.userLogo}
                                                            />
                                                        </div>
                                                        <div className='col-lg-11 px-0'>
                                                            <div className="alert alert-primary mb-0">{comment}</div>
                                                            <small><b>{user.username}</b> | <span className='text-secondary'>{date}</span> { editState?.state ? <span className='text-secondary'> | ??????. {editState?.editedDate}</span> : null } </small>
                                                            <div className={cls.params}>
                                                                {
                                                                    ( currentUserUid === singlePost.uid || currentUserUid === user.uid) ? (
                                                                        <AiFillDelete className={cls.deleteComment} onClick={e => deleteComment(e, id)} />
                                                                    ) : null
                                                                }

                                                                {
                                                                    currentUserUid === user.uid ? 
                                                                    <AiFillEdit className={cls.editComment} onClick={e => editComment(e, comment, id)} />
                                                                    : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                            : null
                                        }
                                    </div>
                                    <div className={cls.commentInput}>
                                        <textarea onChange={handleCommentChange} className='form-control' placeholder='?????? ?????????????????????? ( ???? ?????????? 250 ???????????????? )' value={comment} />
                                        <button onClick={addComment} className='btn btn-danger mt-2'>???????????????? ??????????????????????</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : singlePost === null ? (
                    <h1 className='text-center mt-3'>????????????????...</h1>
                ) : <h1 className='text-center mt-3'>???????????? ???? ??????????????...</h1>
            }
        </div>
    )
}

export default SinglePost;