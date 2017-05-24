import React from 'react';
import ReactDOM from 'react-dom';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';
/* eslint-disable import/no-extraneous-dependencies */
import { AppContainer } from 'react-hot-loader';

import routes from './routes';

/* eslint-disable no-undef */
const rootElement = document.getElementById('root');

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Router
        history={browserHistory}
        routes={routes}
        render={applyRouterMiddleware(useScroll())}
      />
    </AppContainer>,
    rootElement,
  );
};

render();

if (module.hot) {
  module.hot.accept('./routes', () => {
    ReactDOM.unmountComponentAtNode(rootElement);
    render();
  });
}
