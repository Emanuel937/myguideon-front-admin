import React, { useEffect, useState } from 'react';
import { SmallDestinationPhoto, LargestDestinationPhoto } from '../components/destinationDisplayPhoto';
import '../assets/styles/css/destination.css';
import { useParams } from "react-router-dom";
import HOSTNAME_WEB from '../../admin/constants/hostname';

// Typage des données de destination


const DestinationPreviewGalery = (data:any) => {

  var data = data.data;
 

  const [cover, setCover ]     = useState({img:''});

  const  handleImagePath       = (e:any)=>
  {
      setCover({img:e});
  
  }

  useEffect(()=>{
      setCover({img:`${HOSTNAME_WEB}${data.imageCover}`});
  }, [data])
  
  return (
    <div className="previwGaleryContainer">
      <h1 className="cityNameTitle mb-3">{data.basicInfo?.address}</h1>
      <p className='text-gray'> 
        - some little description of the city can come here to make just more text for SEO
      </p>
      <div className="d-flex">
        <div>
          <LargestDestinationPhoto 
            imageName={data.imageCover ? `${cover.img}` : `${HOSTNAME_WEB}/defaultImage.png`} 
          />
        </div>
        <div className="d-flex flex-wrap">
          {data.gallery?.map((imageBaseName: any, index: React.Key | null | undefined) => (
            <SmallDestinationPhoto 
              key={index}
              img={`${HOSTNAME_WEB}${imageBaseName}`}
              onClick={handleImagePath} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationPreviewGalery;
