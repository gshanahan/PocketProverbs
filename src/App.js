import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/profile" component={Profile} />
          {/* More routes as needed */}
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
