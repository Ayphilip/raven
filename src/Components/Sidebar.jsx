import { usePrivy } from '@privy-io/react-auth'
import React, { useEffect } from 'react'
import Img from '../assets/img/hackfu/logo.png';
import { useNavigate } from 'react-router-dom';

function Sidebar  ({ items, onDataSend }) {
    const { authenticated, ready, user, login, logout } = usePrivy();

    const navigate = useNavigate()

    // const [rInformation, setRInformation] = useState(null)


    const sendDataToHomepage = (item) => {
        const data = {
          message: "Hello from Sidebar!",
          timestamp: Date.now(),
        };
        onDataSend(item); // Send data to Homepage
      };

    
    useEffect(() => {
        if (ready && !authenticated) {
            navigate('/')
        }
        

        return () => {

        }
    }, [login, logout, user])
    return (
        <div>
            <div class="nav-header">
                <a class="brand-logo">
                    <img src={Img} style={{ width: 20 + '%' }} />
                </a>
                <div class="nav-control">
                    <div class="hamburger">
                        <span class="line"></span><span class="line"></span><span class="line"></span>
                    </div>
                </div>
            </div>

            <div class="header">
                <div class="header-content">
                    <nav class="navbar navbar-expand">
                        <div class="collapse navbar-collapse justify-content-between">
                            <div class="header-left">
                                <div class="dashboard_bar">

                                </div>
                            </div>
                            <ul class="navbar-nav header-right">

                                <li class="nav-item dropdown notification_dropdown">
                                    <a class="nav-link bell dz-theme-mode p-0" >
                                        <i id="icon-light" class="fas fa-sun"></i>
                                        <i id="icon-dark" class="fas fa-moon"></i>

                                    </a>
                                </li>

                                <li class="nav-item">
                                    <a  class="btn btn-primary d-sm-inline-block d-none">{user?.wallet?.address.slice(0, 10)}<i class="las la-wallet ms-3 scale5"></i></a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <div class="dlabnav">
                <div class="dlabnav-scroll">
                    <ul class="metismenu" id="menu" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                        {items?.map(item =>

                            <li key={item.id}>
                                <a class="has-arrow ai-icon" style={{cursor: 'pointer'}} onClick={()=>sendDataToHomepage(item)} aria-expanded="false">
                                    <i class="mdi mdi-door"></i>
                                    <span class="nav-text">{item.name}</span>
                                </a>

                            </li>
                        )}









                        <li class="dropdown header-profile">
                            <a class="nav-link"  role="button" data-bs-toggle="dropdown">
                                {/* <img src="https://dompet.dexignlab.com/codeigniter/demo/public/assets/images/profile/pic1.jpg" width="20" alt="" /> */}
                                <i className="mdi mdi-wallet"></i>

                                <div class="header-info ms-3">
                                    <span class="font-w600 "><b>{user?.wallet?.address.slice(0, 10)}</b></span>
                                    <small class="text-end font-w400">{user?.wallet?.chainType}</small>
                                </div>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a href="https://dompet.dexignlab.com/codeigniter/demo/app_profile" class="dropdown-item ai-icon">
                                    <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" class="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    <span class="ms-2">Profile </span>
                                </a>

                                <a onClick={logout} class="dropdown-item ai-icon" style={{ cursor: 'pointer' }}>
                                    <svg id="icon-logout" xmlns="http://www.w3.org/2000/svg" class="text-danger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    <span class="ms-2">Logout </span>
                                </a>
                            </div>
                        </li>
                    </ul>



                </div>
            </div>
        </div>
    )
}

export default Sidebar