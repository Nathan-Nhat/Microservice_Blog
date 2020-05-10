import React from 'react';
import './App.css';
import AppbarComponent from "./Component/Appbar.Component";
import MainComponent from "./Component/Main.Component";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {MuiThemeProvider} from '@material-ui/core/styles'
import {theme as defaultTheme} from './Themes'
import storeConfig from "./redux/store/storeConfig";
import {Provider} from 'react-redux'
import WritePostComponent from "./Component/WritePost.Component";
import Notification from './Component/Notifycation.Component'
import AuthComponent from "./AuthComponent";

const store = storeConfig();

function App() {
    return (
        <Provider store={store}>
            <AuthComponent/>
            <MuiThemeProvider theme={defaultTheme}>
                <div>
                    <Router>
                        <AppbarComponent/>
                        <MainComponent/>
                        <Route path = '/add_post' component={WritePostComponent}/>
                    </Router>
                </div>
                <Notification/>
            </MuiThemeProvider>
        </Provider>
    );
}

export default App;
