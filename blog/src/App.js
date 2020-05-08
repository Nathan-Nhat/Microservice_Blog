import React from 'react';
import './App.css';
import AppbarComponent from "./Component/Appbar.Component";
import MainComponent from "./Component/Main.Component";
import {BrowserRouter as Router} from 'react-router-dom'
import {MuiThemeProvider} from '@material-ui/core/styles'
import {theme as defaultTheme} from './Themes'
import storeConfig from "./redux/store/storeConfig";
import {Provider} from 'react-redux'

const store = storeConfig();

function App() {
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={defaultTheme}>
                <div className="App">
                    <Router>
                        <AppbarComponent/>
                        <MainComponent/>
                    </Router>
                </div>
            </MuiThemeProvider>
        </Provider>
    );
}

export default App;
