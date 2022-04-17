// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@primer/react';

import App from '../components/App';

const storedColorMode = localStorage.getItem('WHOIS_mode');

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ThemeProvider dayScheme="light" nightScheme="dark_dimmed" colorMode={storedColorMode || 'day'} >
      <App />
    </ThemeProvider>,
    document.body.appendChild(document.createElement('div'))
  );
});
