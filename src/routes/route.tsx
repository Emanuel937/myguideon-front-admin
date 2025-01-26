import React from "react";
import DestinationActivityPage from "../public-page/screens/destination/activity";
import DestinationCulturePage from "../public-page/screens/destination/culture";
import DestinationOverviewPage from "../public-page/screens/destination/destination-overview";
import DestinationGalleryPage from "../public-page/screens/destination/gallery";
import DestinationHistoriquePage from "../public-page/screens/destination/historical";
import DestinationMapsDetails from "../public-page/screens/destination/maps_details";
import DestinationPraticalInformationPage from "../public-page/screens/destination/pratical-info";
import DestinationReviewsPage from "../public-page/screens/destination/reviews";
import HomePage from "../public-page/screens/homepage";
import NotFoundPage from "../public-page/screens/notfound";
import IndexAdmin from '../admin/index';
import PrivateRoute from './privateroute'; // Import PrivateRoute
import Login from "../admin/screens/login";

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/destination/maps/details/:id', element: <DestinationMapsDetails /> },
  { path: '/destination/culture/:id', element: <DestinationCulturePage /> },
  { path: '/destination/activity/:id', element: <DestinationActivityPage /> },
  { path: '/destination/overview/:id', element: <DestinationOverviewPage /> },
  { path: '/destination/gallery/:id', element: <DestinationGalleryPage /> },
  { path: '/destination/history/:id', element: <DestinationHistoriquePage /> },
  { path: '/destination/usefull-info/:id', element: <DestinationPraticalInformationPage /> },
  { path: '/destination/review/:id', element: <DestinationReviewsPage /> },
   
  // Admin path
  { path: '/admin/login', element: <Login /> },

  // Protect admin routes with PrivateRoute
  {
    path: '/admin',
    element: (
      <PrivateRoute element={<IndexAdmin/>}  path="/admin"/>
    ),
  },

  { path: '*', element: <NotFoundPage /> },
];

export default routes;
