import React from 'react';
import ReactDOM from 'react-dom';
import './resources/css/main.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var insightsRenderDiv = document.getElementById('insights-ex-uk-react');

if (insightsRenderDiv){
    ReactDOM.render(<App />, insightsRenderDiv);
    registerServiceWorker();
}


