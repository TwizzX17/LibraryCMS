import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import './../style/createUser.css';
import AuthService from '../components/AuthService';

let Auth = new AuthService();

 /**
   * 
   * @param {object} user User object
   * @param {object} method GET / POST / PUT / DELETE 
   * @returns {boolean} HTTP Response
   */
  const userAction = async (user, endpoint, method) => {
    return await fetch(`/User/${endpoint}`, {
        method: method,
        mode: "cors",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${Auth.getToken()}`,
        },
        body: JSON.stringify(user)
    })
    .then(function (response) {
    return response.json();
    }).then((response) => {
    return response;
    });
};


const CreateUser = (props) => {
    const history = useHistory();
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleAddressChange = event => setAddress(event.target.value);
    const handleEmailChange = event => setEmail(event.target.value);
    const handlePasswordChange = event => setPassword(event.target.value);

    const createUser = async (address, email, password, userAction) => {
        try{
            const user = {
                Email: email,
                Password: password,
                FullAddress: address
            }
            const response = await userAction(user, 'CreateUser', 'POST');

            if(response.state == "false"){
                throw response.description;
            }

            const authenticationReponse = await Auth.login(email, password)
            if(authenticationReponse.status === 200 || authenticationReponse.token){
                const [loggedIn, isAdmin] = props.checkUserLevel();
                props.authorizedStatusHandler(loggedIn, isAdmin);
                history.push('/profile');
            } else {
                throw 'could not establish authentication';
            }
        } catch(e){
            console.error(e);
        }
    }


    const handleInitiateCreateUser = (e) => {
        if(e.key === 'Enter' || e.key === undefined){
            createUser(address, email, password, userAction);
        }
      }



    return (
        <div id="create-user-container">
            <h3>Opret Konto</h3>
            <p>Indtast dine oplysninger for at oprette en konto</p>
            <div className="create-user-form">
                <TextField id="address" label="Adresse" variant="outlined" 
                        className="login-address-field" type="text"
                        value={address} 
                        onChange={(event) => handleAddressChange(event)}
                        onKeyUp={event => handleInitiateCreateUser(event)}
                />

                <TextField id="email" label="Email" variant="outlined" 
                        className="login-email-field" type="text"
                        value={email} 
                        onChange={event => handleEmailChange(event)}
                        onKeyUp={event => handleInitiateCreateUser(event)}
                />

                <TextField id="password" label="Password" variant="outlined" 
                    className="login-password-field" type="password"
                    value={password} 
                    onChange={event => handlePasswordChange(event)}
                    onKeyUp={event => handleInitiateCreateUser(event)}
                />

                <Button id="user-save-button" variant="contained" size="large" 
                    onClick={(event) => createUser(address, email, password, userAction)}
                >
                    Opret konto
                </Button>
            </div>
        </div>
    )
}
export default CreateUser;