import DestinationActivityPage from "../screens/home/destination/activity";
import DestinationCulturePage from "../screens/home/destination/culture";
import DestinationOverviewPage from "../screens/home/destination/destination-overview";
import DestinationGalleryPage from "../screens/home/destination/gallery";
import DestinationHistoriquePage from "../screens/home/destination/historical";
import DestinationPraticalInformationPage from "../screens/home/destination/pratical-info";
import DestinationReviewsPage from "../screens/home/destination/reviews";


const routes = [
    {
       path:'/destination/activity',    element:<DestinationActivityPage/>,
       path:'/destination/cultura',     element: <DestinationCulturePage/>,
       path:'/destination/overview',    element:<DestinationOverviewPage/>,
       path:'/destination/gallery',      element:<DestinationGalleryPage/>,
       path:'/destination/history',      element:<DestinationHistoriquePage/>,
       path:'/destination/usefull-info', element : <DestinationPraticalInformationPage/>,
       path: '/destination/review',      element : <DestinationReviewsPage/>

    }
]




export default routes;