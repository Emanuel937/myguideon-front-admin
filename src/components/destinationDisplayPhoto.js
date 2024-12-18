/**
 *  this component is used to display photo of destination on the first page of destination 
 *  all first page of every section are named index 
 */

import React from 'react';

const SmallDestinationPhoto = ({img, onClick})=> 
{   
    const avatarPath = require(`../assets/img/destination/user/1/${img}`)
    return (<div className='smallPhoto'>
                <img 
                    alt="destination photo"
                    src={avatarPath}
                    onClick={onClick}
                />
           </div>);
    }

const LargestDestinationPhoto = ({imageName})=>{
    const path =  require(`../assets/img/destination/user/1/${imageName}`)
    return (
        <div className="bigPhoto"> 
            <img
                src={path}
                alt="the biggest destination photo"
            />
        </div>)
}



export {SmallDestinationPhoto, LargestDestinationPhoto}