import React                    from 'react';
import HeaderLayout             from '../../layout/HeaderLayout';
import DestinationPreviewGalery from '../../layout/destinationPreviewGalery';
import MixDestinationLayout     from '../../layout/mixedDestinationLayout';
// the first destination page 
const DestinationOverviewPage = ()=>{

    return (<div>
                <HeaderLayout/>
                <div  
                    className='destinations'>
                    <DestinationPreviewGalery/>
                    <MixDestinationLayout/>
                </div>
            </div>)
}


export default DestinationOverviewPage;