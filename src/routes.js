import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './pages/app/App';

import FiveChessReact from './pages/fiveChess';

export default(

    <Route path="/" component={App}>
        <Route path="fiveChess/:type" component={FiveChessReact}/>
    </Route>
);
