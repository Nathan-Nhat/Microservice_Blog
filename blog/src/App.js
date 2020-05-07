import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppbarComponent from "./Component/Appbar.Component";
import MainComponent from "./Component/Main.Component";
import {BrowserRouter as Router} from 'react-router-dom'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import {theme as defaultTheme} from './Themes'
function App() {
    return (
        <MuiThemeProvider theme={defaultTheme}>
            <div className="App">
                <Router>
                    <AppbarComponent/>
                    <MainComponent/>
                </Router>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
