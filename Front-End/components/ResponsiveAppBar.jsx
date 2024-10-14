import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import useUser from '../src/useUser';
import './ResponsiveAppBar.css'; // Import your CSS file

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen}) {
    const { userInfo, handleLogout } = useUser();

    let pages = [];
    const pageNames = ['Menú','Productos','Inventario', 'Transacciones'];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if(userInfo.userTypeName === 'ADMINISTRADOR'){
        pages = ['menu','admin-productos','inventario', 'transacciones'];
    } else {
        pages = ['menu','admin-productos'];
    }


    return (
        <div>
                <div id="mySidebar" className={`sidebar ${isSidebarOpen ? '' : 'closed'}`} style={{ background: "rgb(22, 26, 48)", height: '100%', width: '250px'}}>
                    <div className="sidebar-header">
                        <img
                            src="../src/assets/img/pollomaxlogo.png"
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "30px",
                                margin: "0px 0px 0px 30px"
                            }}
                            alt="Logo"
                        />
                    </div>
                    <ul className="list-unstyled components" style={{ '--bs-primary': 'rgb(22, 26, 48)', '--bs-primary-rgb': 'rgb(22, 26, 48)', background: 'rgb(22, 26, 48)', borderColor: 'rgb(22, 26, 48)' }}>
                        {pages.map((page, index) => (
                            <li key={index} style={{ backgroundColor: '#161A30', color: 'var(--bs-emphasis-color)', fontSize: '20px', fontFamily: 'Allerta', fontWeight: 'bold' }}>
                                <NavLink to={`/${page}`} className={({isActive}) => `${isActive === true ? 'sidebar-active': ''}`}>{pageNames[index]}</NavLink>
                            </li>
                        ))}
                        <div>
                            <button className='close-session' onClick={handleLogout}>
                                Cerrar sesión, {userInfo.username}
                            </button>
                        </div>
                    </ul>
                </div>
        </div>
    );
}

Sidebar.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
    setIsSidebarOpen: PropTypes.func.isRequired,
};


