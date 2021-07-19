import Header from "../common/header/Header";
import React,{useState} from "react";
import Home from "./home/Home";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Details from "./details/Details";
import BookShow from "./bookshow/BookShow";
import Confirmation from "./confirmation/Confirmation";

export default function Controller(){

    const [accessToken, setAccessToken] = useState('');
    const [loginButton, setLoginButton] = useState('Login');

    return (
        <Router>
            <div>
                <Route exact path="/" render={(props) =>
                    <Home {...props}
                          accessToken={accessToken} loginButton={loginButton}
                          setAccessToken={setAccessToken} setLoginButton={setLoginButton}
                    />} />
                <Route exact path="/movie/:id" render={({history}, props) =>
                    <Details {...props}
                             accessToken={accessToken} loginButton={loginButton}
                             setAccessToken={setAccessToken} setLoginButton={setLoginButton}
                    />} />
                <Route exact path={"/bookshow/:id"} render={({history}, props) =>
                    <BookShow {...props} baseUrl={'http://localhost:8085/api/v1/'}
                              accessToken={accessToken} loginButton={loginButton}
                              setAccessToken={setAccessToken} setLoginButton={setLoginButton}
                    />} />
                <Route exact path={"/confirm/:id"} render={({history}, props) =>
                    <Confirmation {...props} baseUrl={'http://localhost:8085/api/v1/'}
                              accessToken={accessToken} loginButton={loginButton}
                              setAccessToken={setAccessToken} setLoginButton={setLoginButton}
                    />} />
            </div>
        </Router>
    );
}