import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import "./index.scss";
import 'react-notifications/lib/notifications.css';
import { QueryClient, QueryClientProvider } from "react-query";

ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root')
);