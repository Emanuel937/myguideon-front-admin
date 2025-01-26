import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection

interface PrivateRouteProps {
  element: React.ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('userId'));
  }, []);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    //console.log(`user id is : ${isAuthenticated}`);
   // return <Navigate to="/admin/login" />; // Redirect to login page
   console.log(isAuthenticated);
  }

  return <>{element}</>; // Render the protected element if authenticated
};

export default PrivateRoute;
