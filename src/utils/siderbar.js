import {AiFillPlusCircle, AiTwotoneHome, AiFillAppstore} from 'react-icons/ai';
import {HiUsers} from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';

export const sidebar = [
    {
        id: 1,
        title: 'Домашняя страница',
        icon: <AiTwotoneHome />,
        link: '/'
    },
    {
        id: 2,
        title: 'Новый пост',
        icon: <AiFillPlusCircle />,
        link: '/new-post'
    },
    {
        id: 3,
        title: 'Свои посты',
        icon: <AiFillAppstore />,
        link: '/own-posts'
    },
    {
        id: 4,
        title: 'Все пользователи',
        icon: <HiUsers />,
        link: '/all-users'
    }
];

export const profile = [
    {
        id: 1,
        title: 'Открыть профиль',
        icon: <FaUser />,
        link: '/profile'
    }
]