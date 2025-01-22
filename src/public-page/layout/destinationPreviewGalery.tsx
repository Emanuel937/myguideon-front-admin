import React, { useEffect, useState } from 'react';
import { SmallDestinationPhoto, LargestDestinationPhoto } from '../components/destinationDisplayPhoto';
import '../assets/styles/css/destination.css';
import { useParams } from "react-router-dom";
import HOSTNAME_WEB from '../../admin/constants/hostname';

// Typage des données de destination
interface DestinationData {
  imageCover?: string; // `imageCover` est optionnel
  // Ajoutez d'autres propriétés si nécessaire
}

const DestinationPreviewGalery = () => {  
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

  const [photoPath, setPhotoPath] = useState(destinationImage[0]);
  
  if (destinationImage.length > 9) {
    destinationImage = destinationImage.slice(0, 9); // Correction : les 9 premières images
  }

  const handleImagePath = (imageName: string) => {
    setPhotoPath(imageName);
  };

  const { id } = useParams();
  const [data, setData] = useState<DestinationData>({});

  const fetchData = async () => {
    try {
      const response = await fetch(`${HOSTNAME_WEB}/destination/details/${id}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      const responseData = await response.json();
      console.log(responseData[0].id);
      setData(responseData[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="previwGaleryContainer">
      <h1 className="cityNameTitle mb-3">Nom de la ville (Géographiquement)</h1>
      <p className='text-gray'> 
        - some little description of the city can come here to make just more text for SEO
      </p>
      <div className="d-flex">
        <div>
          {/* Image principale */}
          <LargestDestinationPhoto 
            imageName={data.imageCover ? `${HOSTNAME_WEB}${data.imageCover}` : `${HOSTNAME_WEB}/defaultImage.png`} 
          />
        </div>
        <div className="d-flex flex-wrap">
          {/* Miniatures */}
          {destinationImage.map((imageBaseName, index) => (
            <SmallDestinationPhoto 
              key={index}
              img={imageBaseName}
              onClick={() => handleImagePath(imageBaseName)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationPreviewGalery;
