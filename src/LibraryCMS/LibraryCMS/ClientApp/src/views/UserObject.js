import React, { Component } from 'react';
import AuthService from './../components/AuthService';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import './../style/userObject.css';
import { TextField } from '@mui/material';
import moment from 'moment';

let Auth = new AuthService();

export class UserObject extends Component {
    static displayName = UserObject.name;
    constructor(){
        super();
        this.state = {
            userList: [],
            user: {},
            refresh: false,
            endpointList: "",
            endpointAction: ""
        };
    }

    async componentWillMount(){
        let endpoint, endpointList;
        switch(this.props.type){
            case 'confirm':
                endpointList = 'GetUnapprovedUsers';
                endpoint = 'ApproveUser'
                break;
            case 'unconfirm':
                endpointList = 'GetApprovedUsers';
                endpoint = 'DisapproveUser'
                break;
            case 'toAdmin':
                endpointList = 'GetUsers';
                endpoint = 'UpgradeUserToAdmin'
                break;
            case 'fromAdmin':
                endpointList = 'GetAdminUsers';
                endpoint = 'DowngradeAdminToUser'
                break;
            case 'delete':
                endpointList = 'GetUsers';
                endpoint = 'DeleteUser'
                break;
            default:
                endpointList = undefined;
                endpoint = undefined;
        }
        this.setState({endpointList: endpointList, endpointAction: endpoint});

        const users =  await this.userAction(undefined, endpointList, 'GET');
        this.setState({userList: users});
    }

    handleOnSelect = (e, value) => {
        this.setState({user: value});
    }

    handleInputChange = (e, value = "") => {
        this.setState({user: {
            Email: value
        }});
    }

    handleUserAction = async (e) => {
        const response = await this.userAction(this.state.user, this.state.endpointAction, "PUT");
        console.log(response);
        const List = await this.userAction(undefined, this.state.endpointList, 'GET');
        this.setState({userList: List});
        this.setState({user: { Id:0, Email: "" }});
        this.setState({refresh: !this.state.refresh});
    }
    

   /**
   * 
   * @param {object} user User object
   * @param {object} method GET / POST / PUT / DELETE 
   * @returns {boolean} HTTP Response
   */
    userAction = async (user, endpoint, method) => {
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
    }


    parseDate = date => {
        return moment(date).format("DD-MM-YYYY");
    }


    render(){
        return (
            <div>
                <h5>{this.props.title}</h5>
                <Autocomplete
                    id="combo-box-demo"
                    key={this.state.refresh}
                    onChange={(event, value) => this.handleOnSelect(event, value)}
                    onInputChange={(event,value) => this.handleInputChange(event, value)}
                    inputValue={this.state.Email}
                    options={this.state.userList}
                    getOptionLabel={(option) => option.Email}
                    style={{ width: 300 }}
                    renderInput={(params) => 
                    <TextField {...params} label={this.props.title} variant="outlined" />}
                />
                <Button id="user-action-button" variant="contained" size="large" onClick={async () => {await this.handleUserAction()}}>
                            Bekræft Bruger
                </Button>
            </div>
    )};
}