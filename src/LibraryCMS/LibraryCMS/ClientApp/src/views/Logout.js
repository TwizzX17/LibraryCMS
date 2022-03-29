import React, { Component } from 'react';
import { Link, useHistory } from "react-router-dom";
import AuthService from './../components/AuthService';
import './../style/login.css';

let Auth = new AuthService();

const Logout = (props) => {
    const history = useHistory();
    Auth.signOut();
    const [loggedIn, isAdmin] = props.checkUserLevel();
    props.authorizedStatusHandler(loggedIn, isAdmin);
    
    history.push('/');

    return null;
}

export default Logout;