import cls from './Sidebar.module.scss';
import { profile, sidebar } from '../../utils/siderbar';
import { RiLogoutCircleFill } from 'react-icons/ri';
import { NavLink, useHistory } from 'react-router-dom';
import { fire } from '../../services/firebase';
import { useDispatch } from 'react-redux';
import { signOutAction } from '../../store/actions/currentUserAction';

const Sidebar = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const signOut = e => {
        e.preventDefault();
        fire.auth().signOut();
        dispatch(signOutAction());
        localStorage.removeItem('minstagramAuth');
        history.push('/auth/login')
    }

    return (
        <div className={cls.root}>
            <ul>
                {
                    sidebar.map(({id, icon, link, title}) => (
                        <li title={title} key={id}>
                            <NavLink exact activeClassName={cls.activeLink} className={cls.link} to={link}>{icon}</NavLink>
                        </li>
                    ))
                }
            </ul>
            <ul>
                {
                    profile.map(({id, icon, link, title}) => (
                        <li title={title} key={id}>
                            <NavLink exact activeClassName={cls.activeLink} className={cls.link} to={link}>{icon}</NavLink>
                        </li>
                    ))
                }
                <li title='Выйти из аккаунта' onClick={signOut}><RiLogoutCircleFill /></li>
            </ul>
        </div>
    )
}

export default Sidebar;