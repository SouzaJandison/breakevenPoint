import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import Logon from './pages/Logon';
import Register from './pages/Register';
import Point from './pages/Point';
import NewPoint from './pages/NewPoint';

export default function Routes() {
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Point} />
        <Route path="/new" component={NewPoint} />
      </Switch>
    </BrowserRouter>
  );
}