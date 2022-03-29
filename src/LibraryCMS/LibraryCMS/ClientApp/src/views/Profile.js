import React, { Component } from 'react'
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import AuthService from './../components/AuthService';
import moment from 'moment';
import './../style/profile.css';

let Auth = new AuthService();

export class Profile extends Component {
    static displayName = Profile.name;
    constructor(){
        super();
        this.state = {
            user:{
                Email: "",
                FullAddress: "",
                
            },
            oldPassword: "",
            newPassword: "",
            repeatNewPassword: "",
            rental: [
                {
                BookTitle: "",
                RentalDate: "",
                ReturnDeadline: ""
            }
        ]
        };
    }

/*
 
                */


    async componentDidMount() {
        const user = await this.userAction(undefined, 'GetUser', 'GET');
        this.setState({user: user});
        const rentalHistory = await this.rentalAction(undefined, 'GetRentals', 'GET');
        if(rentalHistory.status !== 200 && rentalHistory.status){
            console.error('No rentals could be fetched')
            this.setState({rental: [
                
            ]});
        } else {
            this.setState({rental: rentalHistory});
        }
        
    }

    handleFormChange = (e) =>{
        let user = this.state.user;
        user[e.currentTarget.id] = e.currentTarget.value;
        this.setState({user: user})
    }

    handleOldPasswordChange = (e) =>{
        this.setState({oldPassword: e.currentTarget.value})
    }

    handlenewPasswordChange = (e) =>{
        this.setState({newPassword: e.currentTarget.value})
    }

    handleRepeatNewPasswordChange = (e) =>{
        this.setState({repeatNewPassword: e.currentTarget.value})
    }


    handleSaveUser = async (e) => {
        try {
            const user = this.state.user;
            console.log(user)

            if(this.state.newPassword !== this.state.repeatNewPassword){
                throw "Passwords doesnt match";
            }

            user.Password = this.state.newPassword
            const response = await this.userAction(user, 'UpdateUser', 'PUT', `?oldpassword=${this.state.oldPassword}`);
            console.log(response);
            if(!response.Email){
                throw response;
            }
        } catch(e){
            console.error(e);
        }
        
    }

   /**
   * 
   * @param {object} user User object
   * @param {object} method GET / POST / PUT / DELETE 
   * @returns {boolean} HTTP Response
   */
    userAction = async (user, endpoint, method, paramQuery) => {
        let url = `/User/${endpoint}`;
        if(paramQuery){
            url = url + paramQuery;
        }
        const response = await fetch(url, {
            method: method,
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`,
            },
            body: JSON.stringify(user)
        })
        .then(function (response) {
            if(response.status !== 200){
                throw response.text();
            }
            return response.json();
        }).then((response) => {
            return response;
        })
        .catch(error => {
            console.log(error)
            return error;
        });
        return response;
    };

     /**
   * 
   * @param {object} rental Rental object
   * @param {object} method GET / POST / PUT / DELETE 
   * @returns {boolean} HTTP Response
   */
      rentalAction = async (rental, endpoint, method) => {
        const response = await fetch(`/Rental/${endpoint}`, {
            method: method,
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`,
            },
            body: JSON.stringify(rental)
        })
        .then(function (response) {
            if(response.status !== 200){
                return response;
            }
            return response.json();
        }).then((response) => {
            return response;
        });
        return response;
    };




    render(){
        return (
        <div>
            <div className="profile-container">
                <div id="profile-welcome">
                    <h5 >Velkommen til din side</h5>
                </div>
                <div id="profile-history">
                    <h5>Udlån / Info om udlånsrettigheder</h5>
                </div>
                <div className="profile-information-container">
                    <h6>Brugeroplysninger</h6>
                    <TextField id="Email" label="Email" variant="outlined" className="user-input-field"
                        value={this.state.user.Email} 
                        onChange={event => this.handleFormChange(event)}
                    />

                    <TextField id="FullAddress" label="Adresse" variant="outlined" className="user-input-field"
                        value={this.state.user.FullAddress} 
                        onChange={event => this.handleFormChange(event)}
                    />

                    <h6>Konto styrring</h6>
                    
                    <TextField id="oldPassword" label="Gammelt kodeord" variant="outlined" 
                    className="user-input-field" type="password"
                        value={this.state.oldPassword} 
                        onChange={event => this.handleOldPasswordChange(event)}
                    />
                
                    <TextField id="newPassword" label="Nyt Kodeord" variant="outlined" 
                    className="user-input-field" type="password"
                        value={this.state.newPassword} 
                        onChange={event => this.handlenewPasswordChange(event)}
                    />
                
                    <TextField id="repeatNewPassword" label="Gentag Kodeord" variant="outlined" 
                    className="user-input-field" type="password"
                        value={this.state.repeatNewPassword} 
                        onChange={event => this.handleRepeatNewPasswordChange(event)}
                    />
                
                    <Button id="user-save-button" variant="contained" size="large" onClick={this.handleSaveUser}>
                        Gem ændringer
                    </Button>
                </div>
                <div>
                    <h6>Udlånshistorik</h6>
                    <table className="profile-table" width="100%">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Udlåns dato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.rental.map((item, key ) => {
                                    const element =
                                    <tr key={key}>
                                        <td>{item.BookTitle}</td>
                                        <td>{moment(item.RentalDate).format("DD/MM/YYYY") + ' - ' + moment(item.ReturnDeadline).format("DD/MM/YYYY")}</td>
                                    </tr>
                                    return element;
                                })
                            }
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        )}
}