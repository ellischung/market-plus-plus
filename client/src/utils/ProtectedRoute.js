import React from 'react'
import {Navigate, useLocation} from "react-router-dom"

const ProtectedRoute = ({children}) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    let location = useLocation();

    if(!user) {
        return <Navigate to="/landing" state={{ from: location}} replace />
    }
 return children

};

export default ProtectedRoute;