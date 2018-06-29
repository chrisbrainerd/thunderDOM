import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { google } from './SECRETS.js';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
      
// for twitter, we plug the API key in inside the app - since this needs to be in a script tag 
// and we can't import a variable into the `.html` file, we're building the script tag here and 
// then appending it to the document body on load
function initializeGoogleMapsAPIWithSecret() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + google +'&libraries=places';
  document.body.appendChild(script);
}

window.onload = initializeGoogleMapsAPIWithSecret;