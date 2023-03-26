import React from 'react';
import { Navigate, Redirect, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({ children,...res }) => {
	const {isAuthenticated,user}=useAuth0();
  const isUser=isAuthenticated && user;
  return <Route {...res} render={()=>{
	return isUser?children:<Redirect to='/login'></Redirect>
  }}></Route>
};
export default PrivateRoute;