import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Route, NavLink } from 'react-router-dom';
import Dashboard from './screens/Dashboard/Dashboard';
import TestSuites from './screens/TestSuites/TestSuites';
import TestCases from './screens/TestCases/TestCases';
import './App.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <div className="sidenav">
                        <h2>Tingus</h2>
                        <NavLink to="/dashboard">Dasboard</NavLink>
                        <NavLink to="/test-suites">Test Suites</NavLink>
                        <NavLink to="/test-cases">Test Cases</NavLink>
                        <a className="version">Version 0.3.0</a>
                    </div>
                    <div className="main">
                        <Container fluid>
                            <Route path="/" exact component={Dashboard} />
                            <Route
                                path="/dashboard"
                                exact
                                component={Dashboard}
                            />
                            <Route
                                path="/test-suites"
                                exact
                                component={TestSuites}
                            />
                            <Route
                                path="/test-cases"
                                exact
                                component={TestCases}
                            />
                        </Container>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
