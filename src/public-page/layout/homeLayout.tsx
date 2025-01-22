import React, { useEffect, useState } from "react";
import HeaderLayout from "./HeaderLayout";
import "../assets/styles/css/home.css";
import { ExporeMoreAbout } from "./mixedDestinationLayout";
import { Link } from "react-router-dom";
import HOSTNAME_WEB from "../../admin/constants/hostname";
import { hostname } from "os";

// Définition des types pour les composants
interface ContainerDestinationProps {
  componentData:any;
}

interface NavigationItensProps {
  icon: string;
}

interface CustomerActivityBookingMapProps {
  img: string;
  name: string;
}

  
const HomeLayout = () => {

  const [data, setData] =  useState([]);

  const handleFetchData = async()=>{
    const response = fetch(`${HOSTNAME_WEB}/destination`)
         .then((response)=>{
            if(!response.ok){
              throw('there is an error');
            }
            return response.json();
         })
         .then((data)=>{
            setData(data);
            console.log(data);
         }).catch((error)=>{
          console.log(error);
         })

 

  }
  useEffect(()=>{
    handleFetchData();
    console.log();

  }, []);


  return (
    <div className="homeBody">
      <HeaderLayout />
      <section
        className="container_home"
        style={{ backgroundImage: `url('/assets/img/world_tree.png')` }}
      >
        <section className="customer_section d-flex justify-content-between">
          <h1 className="header_title">My World</h1>
          <section className="d-flex">
            <CustomerActivityBookingMap
              img={"booking_map.png"}
              name={"Activities Booking"}
            />
            <Link to="/destination/maps/details">
              <CustomerActivityBookingMap
                img={"map_booking.png"}
                name={"Switch to Guide Map"}
              />
            </Link>
          </section>
        </section>
        <section
          style={{ backgroundImage: `url('/assets/img/world_tree.png')` }}
          className="shadow_"
        >
          <article className="menu_active d-flex justify-content-between container_of_container">
            <section className="d-flex tab">
              <div className="menu_active_tab">
                <p className="tab_title ">
                  <img src={"/assets/img/expore.png"} />
                  Explore Destinations
                </p>
              </div>
              <div>
                <p className="tab_title">
                  <img src={"/assets/img/fly.png"} />
                  Explore Countries
                </p>
              </div>
            </section>
            <section className="d-flex">
              <NavigationItens icon={"left-white.svg"} />
              <NavigationItens icon={"right-white.svg"} />
            </section>
          </article>
          <article className="homeMainContent d-flex">
            {
              data.map((e)=>{
                return  <ContainerDestination componentData={e} />
              })
            }
        
          </article>
        </section>
      </section>
    </div>
  );
};

// Composant ContainerDestination
const ContainerDestination: React.FC<ContainerDestinationProps> = ({
  componentData,
}) => {
   const basicInfo = JSON.parse(componentData.basic_info);
   const gallery  =  JSON.parse(componentData.gallery);

  

  return (
    <div>
      <section className="home_destination_card_container">
        <article
          className="home_destination_card"
          style={{ backgroundImage: `url('${HOSTNAME_WEB}${componentData.imageCover}')` }}
        ></article>
        { gallery.map((image: any)=>
        <article className="absolute_photo">

          <img
            className="smallQuarePhoto"
            src={`${HOSTNAME_WEB}${image}`}
          />
          
        </article>
        )
        }
        <section className="d-flex home_destination_card_title justify-content-between">
          <h2 className="homeMainContentTitle">
           {basicInfo.destinationName}
          </h2>
          <p className="homeMainYellowContainer">
            <img src={"/assets/img/person.svg"} />
            <span>7.0/10 </span>
          </p>
        </section>
        <div className="d-flex justify-content-between">
          <section className="langage_container">
            <article className="d-flex">
              <img
                src={"/assets/img/global.svg"}
                className="iconLangage"
              />
              <div>
                <p>
                  <span className="first_text">Languages</span> <br />
                  <span className="second_text">{basicInfo.language}</span>
                </p>
              </div>
            </article>
          </section>
          <section className="langage_container">
            <article className="d-flex">
              <img
                src={"/assets/img/dolar.svg"}
                className="iconLangage"
              />
              <div>
                <p>
                  <span className="first_text">Currencies</span> <br />
                  <span className="second_text">{basicInfo.currency}</span>
                </p>
              </div>
            </article>
          </section>
        </div>
        <section className="budget_container">
          <article className="d-flex">
            <img
              src={"/assets/img/dollarpack.svg"}
              className="iconLangage"
            />
            <div>
              <p>
                <span className="first_text">Budget Required for a Trip</span>{" "}
                <br />
                <span className="second_text">
                  {basicInfo.budget}{basicInfo.currency} for a every week spent
                </span>
              </p>
            </div>
          </article>
        </section>
        <section
          className="meteo_container"
          style={{
            backgroundImage: `url('/assets/img/destination/meteo/meteo_1.png')`,
          }}
        ></section>
        <p className="expore_more_home">Explore more </p>
        <div className="explore_flex_container">
          <section className=" d-flex exporeMoreHomePage">
            <ExporeMoreAbout img="/assets/img/culture.png" text="Cultures" />
            <ExporeMoreAbout img="/assets/img/historic.svg" text="History" />
            <ExporeMoreAbout img="/assets/img/thing_to_do.svg" text="Things to do" />
            <ExporeMoreAbout img="/assets/img/pratical-info.png" text="Pratical info" />
          </section>
          <section className="see_more">
          <Link to={`/destination/overview/${componentData.id}`}
               aria-label="View Destination Overview">
              <img
                src="/assets/img/right-white.svg"
                alt="Arrow pointing to the right"
              />
            </Link>
          </section>
        </div>
      </section>
    </div>
  );
};

// Composant NavigationItens
const NavigationItens: React.FC<NavigationItensProps> = ({ icon }) => {
  return (
    <div className="nativation_container">
      <p className="navigation bg-primary">
        <span>
          <img src={`/assets/img/${icon}`} />
        </span>
      </p>
    </div>
  );
};

// Composant CustomerActivityBookingMap
const CustomerActivityBookingMap: React.FC<CustomerActivityBookingMapProps> = ({
  img,
  name,
}) => {
  return (
    <div className="CustomerActivityBookingMap">
      <p> {name}</p>
      <img
        className="CustomerActivityBookingMap_img"
        src={`/assets/img/${img}`}
      />
    </div>
  );
};

export default HomeLayout;
