import DestinationActivityPage            from "../screens/destination/activity";
import DestinationCulturePage             from "../screens/destination/culture";
import DestinationOverviewPage            from "../screens/destination/destination-overview";
import DestinationGalleryPage             from "../screens/destination/gallery";
import DestinationHistoriquePage          from "../screens/destination/historical";
import DestinationPraticalInformationPage from "../screens/destination/pratical-info";
import DestinationReviewsPage             from "../screens/destination/reviews";


const routes = [
    {path:'/destination/activity',     elemen  :<DestinationActivityPage/> },
    {path:'/destination/cultura',      element : <DestinationCulturePage/> },
    {path:'/destination/overview',     element :<DestinationOverviewPage/> },
    {path:'/destination/gallery',      element :<DestinationGalleryPage/>  },
    {path:'/destination/history',      element :<DestinationHistoriquePage/>},
    {path:'/destination/usefull-info', element : <DestinationPraticalInformationPage/>},
    {path: '/destination/review',      element : <DestinationReviewsPage/>}

];




export default routes;