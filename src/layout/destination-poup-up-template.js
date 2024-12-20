import React from 'react';
import HeaderLayout from './HeaderLayout';

const DestinationInfoTemplate = ()=>{

    return <div>
                <HeaderLayout/>
                <section class="body">
                    <section className='bg-black-transparent'>
                        <article className='bg-white customer-modal'>
                              <div class="display-flex">
                                    <div
                                        className='custom-modal-back'
                                    >
                                        <img 
                                            src="/assets/img/back.svg"
                                        />
                                        <span>Back to main</span>
                                    </div>
                                    <div className='custom-modal-title'>
                                        <h6>USER REVIEWS & FEEDBACKS </h6>
                                    </div>
                                    <div>
                                        <img
                                            src='/assets/img/close.svg'
                                        />
                                    </div>

                              </div>
                        </article>
                    </section>
                </section>
            </div>
}



export default DestinationInfoTemplate;