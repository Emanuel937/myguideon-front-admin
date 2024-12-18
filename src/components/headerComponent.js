import '../assets/styles/css/headerMenuComponent.css';
import defaultAvatar from '../assets/img/profil/user/1.png';


const SmallMenuTextIcon = () => {
    return (
        <ul className="custom-menu-list">
            <li className="custom-menu-item">
                <img
                    className="svgIcon"
                    src="/assets/img/turism.svg" 
                    alt="Tourism Icon"
                />
                <span className="menu-text">My Guide</span>
            </li>
            <li className="custom-menu-item">
                <img
                    className="svgIcon"
                    src="/assets/img/airplan.svg" 
                    alt="Tourism Icon"
                />
                <span className="menu-text">My World</span>
            </li>
            <li className="custom-menu-item">
                <img
                    className="svgIcon"
                    src="/assets/img/chat.svg" 
                    alt="Tourism Icon"
                />
                <span className="menu-text">Message</span>
            </li>
        </ul>
    );
};



const SearchInput = () => {
    return (
        <div className="customer-search-container">
          <input
            type="text"
            placeholder="Search your dream destination, activities, quests..."
            name="search_destination"
          />
           <img  src='/assets/img/search.svg'
            className="searchIcon"
           />
     
      </div>
    );
  };
  

const NotificationWidget = ()=>{
    return (
        <div className = "notification">
            <img
                src="/assets/img/notifications.svg"
                alt="notification icon"
            />
        </div>
    );
}

const UserAvatar = ()=>{

    const searchUserPhoto = () =>{

    }

    return (
        <div className="userAvatar">
             <img
                src={defaultAvatar}
            />
        </div>
    )
}


export {SmallMenuTextIcon, SearchInput,  UserAvatar,  NotificationWidget  };
