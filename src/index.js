import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './app/App';
import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
const render = (Component) => {
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <Component />
            </Provider>
        </React.StrictMode>
    );
};

render(App);

if (module.hot) {
    module.hot.accept('./app/App', () => {
        const NextApp = require('./app/App').default;
        render(NextApp);
    });
}
