import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home } from './home';
import { DoSearch } from './search';
import { User, RandomUser } from './user';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/search/:needle" component={DoSearch}/>
      <Route path="/random" component={RandomUser}/>
      <Route path="/:user" component={User}/>
    </Switch>
  </BrowserRouter>
);

export function renderApp() {
    ReactDOM.render(
            <App />,
        document.getElementById('container')
    );
}
