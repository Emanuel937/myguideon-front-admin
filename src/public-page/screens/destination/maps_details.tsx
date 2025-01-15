import React from 'react';
import MapComponent from '../../components/map_component';
import HeaderLayout from '../../layout/HeaderLayout';

const DestinationMapsDetails = ()=>{
    return (<div>
                <HeaderLayout/>
                <section className='map_section'>
                <CardOver/>
                <p className='map_back'>
                     <img src={'/assets/img/map_back.svg'}/>  Back to Classic GuideMap
                </p>
                <p className='explore_mode'>
                     <img src={'/assets/img/world.svg'}/>  Exploration mode
                </p>
                <p className='bottom_map_activity_menu'>
                    <img src={'/assets/img/activity.svg'}/>
                    Activities
                </p>
                   
                    <article className='map_article'>
                        <MapComponent/>
                    </article>
                  
                   
                </section>
             </div>)
}

const CardOver = ()=>{
    return (<div className='card_over'>
             <section  className='card_over_container p-2'>
               <p className='text-center'> <span className='card_over_title '> ACTIVITY DETAILS </span> <span> Close </span></p>
                    <section>
                        <div>
                            <div>
                                <section className='row'>
                                    <div className='col-md-5'>
                                        <img src={'/assets/img/destination/swim.png'}
                                            width={'70%'}
                                        />
                                    </div>
                                    <div className=' col-md-7'>
                                        <section>
                                            <div className='d-flex justify-content-between'>
                                                <h2 className='card_over_second_title'>Scuba Diving</h2>
                                                <p  className='heart'> <img  src={'/assets/img/heart.svg'}/></p>
                                            </div>
                                        <p className='over_card'>  
                                            <span>  
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <i className="bi bi-star-fill text-warning"></i> 
                                            </span>
                                            <span> 5.0 (190) See reviews</span>
                                        </p>
                                        <p> <img src={'/assets/img/maps_set.svg'}/> <span> Istanbul, Turkey.</span></p>
                                        <p>Aenean augue justo, feugiat quis ullamcorper sit amet, elementum non elit. See more</p>
                                        <p className='credit'> <img src={'/assets/img/credit.png'}/></p>
                                        <p className='card_over_service'> 
                                            <span> SERVICE PROVIDER</span>
                                            <span> <img src={'/asset/img/user.png'}/> Richard Abhina</span>
                                        </p>
                                        </section>
                                    </div>
                                </section>
                              
                            </div>
                        </div>
                        <div>
                            <button>
                                    + Add to Trip Plan
                            </button>
                            <button>
                                Proceed to Booking
                            </button>
                        </div>
                    </section>
                </section>
            </div>);
}

export default DestinationMapsDetails;