import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  let location = useLocation();

  useEffect(() => console.log(user), [user, location]);

  if (!user) {
    return <Navigate to="/auth" replace={true} />
  }
  return children;
};

export default ProtectedRoute;
