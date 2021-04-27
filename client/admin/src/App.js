import { useState } from "react";
import "./App.css";
//import Main from "./components/main/Main";
import Dashboard from './components/dashboard/Dashboard'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from "./components/pages/login/Login";
import { ProtectedRoute } from './protected.route'
import { Redirect } from 'react-router-dom';

const App = () => {

  { document.title = "EzRecovery Dashboard" }
  const [username, setUsername] = useState(localStorage.getItem('username'));
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => {
            if (username == null)
              return <Login setUsername={setUsername} />;
            else
              return <Redirect push to='/app' />;
          }
          }>
          </Route>
          <ProtectedRoute path='/app' isAuth={username} setUsername={setUsername} />

        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
