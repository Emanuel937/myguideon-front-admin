import React, {useEffect, useState}  from 'react';
import MapComponent from '../components/map_component';


interface DestinationInfo {icon:string, title:string, description:string}
interface ExporeMoreAboutInterface {img:string, text:string }

const MixDestinationLayout = (data: any) => {
  
  var data= data.data;

    return (
        <div id="Mix">
            <div className='d-flex '>
              <div>
                <h2 className="mt-5">{data?.destinationName}</h2>
                <div className="d-flex">
                    <DestinationInfo
                        icon="dolar.svg"
                        title="Currencies"
                        description={data?.currency}
                    />
                     <DestinationInfo
                        icon="global.svg"
                        title="Languages"
                        description={data.language?.join(" , ")}
                    />
                     <DestinationInfo
                        icon="dollarpack.svg"
                        title="Budget Required for a Trip"
                        description={`${data?.budget} ${data?.currency} for a every week spent`}
                    />
                   
                </div>
                </div>
                <div>
                  <OverallRating/>
           
                </div>
            </div>
            <section className="meteo">
                <img 
                    src="/assets/img/meteo.png"
                />
            </section>
            <section>
              <h3>DESTINATION DETAILS & RATINGS</h3>
              <h4>Explore More about Maldives</h4>
               <section className='d-flex'>
                  <ExporeMoreAbout
                    img="/assets/img/culture.png"
                    text="Cultures"
                  />
                  <ExporeMoreAbout
                    img="/assets/img/thing-to-do.png"
                    text="Things to do"
                  />
                  <ExporeMoreAbout
                    img="/assets/img/pratical-info.png"
                    text="Pratical info"
                  />
                  <ExporeMoreAbout
                    img="/assets/img/galery.png"
                    text="Gallery"
                  />
                    <ExporeMoreAbout
                      img="/assets/img/rating.png"
                      text="Notation"
                  />
               </section>
               <h4>Explore the Map</h4>
               <div className='map_right_margin'>
                  <MapComponent height='50vh'/>
               </div>
            </section>
        </div>
    )
}

const ExporeMoreAbout:React.FC<ExporeMoreAboutInterface> = ({img, text})=>{

  return <section className='explore-more'>
            <article>
                <img
                  src={img}
                />
            </article>
            <p className='expore-more-title'>{text}</p>
         </section>
}



const DestinationInfo:React.FC<DestinationInfo> = ({icon, title, description})=>{
    return (
        <div className='d-flex info-container' >
            <img
             src={`/assets/img/${icon}`}
            />
            <div>
                <p className="small-title"> {title} </p>
                <p className="small-description"> {description}</p>
            </div>
        </div>
    )
}



const OverallRating = () => {
    return (
      <div className="rating-container">
        <div className="overall-rating">
          <img src="/assets/img/person.svg"  className="icon" alt="User Icon" />
          <span className="rating-title">Overall Rating</span>
          <span className="rating-score">7.0/10</span>
        </div>
        <div className='d-flex sub-ratings-cotainer'>
          <div className="sub-ratings">
            <div className="rating-item">
              <img className='rating-iten-icon' src="/assets/img/money.svg" alt="Money Icon" />
              <span className='rating-iten-note'>8.0/10</span>
            </div>
            <div className="rating-item">
              <img src="/assets/img/food.svg" 
                className='rating-iten-icon'  alt="Food Icon" />
              <span  className='rating-iten-note'>9.5/10</span>
            </div>
          </div>
          <div className="sub-ratings">
            <div className="rating-item">
              <img src="/assets/img/castle.svg" className='rating-iten-icon'  alt="Castle Icon" />
              <span  className='rating-iten-note'>7.9/10</span>
            </div>
            <div className="rating-item">
              <img src="/assets/img/security.svg" className='rating-iten-icon'  alt="Security Icon" />
              <span  className='rating-iten-note'> 6.5/10</span>
            </div>
          </div>
         </div>
      </div>
    );
  };

export   {ExporeMoreAbout};
export default MixDestinationLayout;

