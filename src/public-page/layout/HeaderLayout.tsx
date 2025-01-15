import React from 'react';
import {SmallMenuTextIcon, SearchInput,  UserAvatar,  NotificationWidget  } from '../components/headerComponent'

const HeaderLayout = () => {

    return (
        <header>
            <nav>
                <div className="d-flex">
                    <div className="logo">
                        <img 
                            src='/assets/img/logo.png' 
                            alt="Logo"
                        />
                    </div>
                    <div className="menu-main-container">
                        <SmallMenuTextIcon />
                    </div>
                </div>
                <div className="rightMenuItens d-flex">
                    <SearchInput/>
                    <NotificationWidget/>
                    <UserAvatar/>
                </div>
            </nav>
        </header>
    );
};


export default  HeaderLayout;