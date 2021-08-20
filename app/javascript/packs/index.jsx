// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {ThemeProvider} from '@primer/components';

import App from '../components/App';
import reducers from '../reducers';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
      <ThemeProvider>
          <Provider store={createStore(reducers, {})}>
            <App />
          </Provider>
      </ThemeProvider>,
      document.body.appendChild(document.createElement('div')),
  );
})
