/**
 * This component is used to display photos of destinations on the first page of the destination.
 * All first pages of every section are named index.
 */

import React from 'react';

interface SmallDestinationPhotoProps {
    img: string;
    onClick: () => void;
}

const SmallDestinationPhoto: React.FC<SmallDestinationPhotoProps> = ({ img, onClick }) => {
    const avatarPath = `../assets/img/destination/user/1/${img}`;
    return (
        <div className="smallPhoto">
            <img
                alt="destination photo"
                src={avatarPath}
                onClick={onClick}
            />
        </div>
    );
};

interface LargestDestinationPhotoProps {
    imageName: string;
}

const LargestDestinationPhoto: React.FC<LargestDestinationPhotoProps> = ({ imageName }) => {
    const path = `../assets/img/destination/user/1/${imageName}`;
    return (
        <div className="bigPhoto">
            <img
                src={path}
                alt="the biggest destination photo"
            />
        </div>
    );
};

export { SmallDestinationPhoto, LargestDestinationPhoto };
