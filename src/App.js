import React from 'react';
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
	<AuthWrapper>
   <Router>
   <Switch>
   <PrivateRoute path='/' exact={true}>
	<Dashboard/>
   </PrivateRoute>
   {/* <Route path="/" component={Dashboard} exact={true}/> */}
	<Route path="/login" component={Login}/>
	<Route path="*" component={Error}/>
   </Switch>
	
   </Router>
   </AuthWrapper>
  );
}

export default App;
