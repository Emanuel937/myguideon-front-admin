import React, { useState } from 'react';
import { SmallDestinationPhoto, LargestDestinationPhoto } from '../components/destinationDisplayPhoto';
import '../assets/styles/css/destination.css';

const DestinationPreviewGalery = () => {  
    // Les destinations peuvent avoir de nombreuses images
    let destinationImage = [ 
        "image.png", 
        "image_1.png",
        "image_2.png", 
        "image_3.png", 
        "image_4.png", 
        "image_5.png",
        "image_6.png", 
        "image_7.png", 
        "image_8.png", 
        "image_9.png"
    ];


    // Définir l'image par défaut à afficher
    const [photoPath, setPhotoPath] = useState(destinationImage[0]);
    
    // Limiter à 9 images maximum
    if (destinationImage.length > 9) {
        destinationImage = destinationImage.slice(1, 9);
    }
    
    // Fonction pour gérer les clics sur les images
    const handleImagePath = (imageName) => {
        setPhotoPath(imageName); // Met à jour l'image principale avec le nom de l'image cliquée
        console.log('Image sélectionnée :', imageName);
    };

    return (
        <div className="previwGaleryContainer">
            <h1 className="cityNameTitle mb-3">Nom de la ville (Géographiquement)</h1>
            <p className='text-gray'> 
               - some litle description of the city can come here to make juste make it more text to SEO

            </p>
            <div className="d-flex">
                <div>
                    {/* Image principale */}
                    <LargestDestinationPhoto imageName={photoPath} />
                </div>
                <div className="d-flex flex-wrap">
                    {/* Miniatures */}
                    {destinationImage.map((imageBaseName, index) => (
                        <SmallDestinationPhoto 
                            key={index} // Ajout d'une clé unique
                            img={imageBaseName}
                            onClick={() => handleImagePath(imageBaseName)} // Mise à jour de l'image principale
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DestinationPreviewGalery;
