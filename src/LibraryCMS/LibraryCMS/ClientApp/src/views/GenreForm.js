import React, { Component } from 'react';
import AuthService from './../components/AuthService';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import './../style/genreForm.css';
import { TextField } from '@mui/material';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';

const Input = styled('input')({
    display: 'none',
  });

let Auth = new AuthService();

export class GenreForm extends Component {
    static displayName = GenreForm.name;
    constructor(){
        super();
        this.state = {
            genre: {
                Id: undefined,
                Name: "",
                PicturePath: '/genre/image.png'
            },
            genres: [
            ],
            selectedGenre: {
                Id: undefined,
                Name: "Vælg genre"
                
            },
            selectedGenres: [],
            uploadFile: {}
        };
    }

    async componentWillMount(){
        const genres = await this.getAllGenres();
        this.setState({genres: genres});
    }


    handleSelector = (e, value) => {
        this.setState({genre: value});
    }

    handleFormChange = (e) =>{
        let genre = this.state.genre;
        genre[e.currentTarget.id] = e.currentTarget.value;
        this.setState({genre: genre})
    }

    handleChipSelectorChange = (e) =>{
        this.setState({selectedGenres: e.target.value});
    }


    handlePictureUpload = async (e) => {
        console.log(e.target.files[0]);
        this.setState({uploadFile: e.target.files[0]});
        const response = await this.savePicture(e.target.files[0]);
        console.log(response);
    }

    handleCreateGenre = async (e) => {
        let genre = this.state.genre;
       
        //Remove undefined Id property
        delete genre.Id

        const response = await this.GenreAction(genre,'Creategenre', 'POST');
        console.log(response);
    }

    handleEditGenre = async (e) => {
        let genre = this.state.genre;
        
        const response = await this.GenreAction(genre, 'UpdateGenre', 'PUT');
        console.log(response);
    }
    

    getAllGenres = async () => {
        return await fetch(`/Genre/GetGenres`,{
          method:"get"
        })
        .then(function (response) {
          return response.json();
        }).then((response) => {
          console.log(response)
          return response;
        }).catch(error => {
          console.log(error);
          return error;
        });
    }

      savePicture = async (image) => {
        const data = new FormData();
        data.append('Picture', image);
        return await fetch(`/genre/uploadPicture`,{
            method:"POST",
            headers: {'Content-Type': 'multipart/form-data'},
            body: data

        })
        .then(function (response) {
            return response.json();
        }).then((response) => {
            console.log(response);
            return response;
        }).catch(error => {
            console.log(error);
            return error;
        });
    }

   /**
   * 
   * @param {object} genre Genre object
   * @param {object} method GET / POST / PUT / DELETE 
   * @returns {boolean} HTTP Response
   */
    GenreAction = async (genre, endpoint, method) => {
    return await fetch(`/Genre/${endpoint}`, {
        method: method,
        mode: "cors",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${Auth.getToken()}`,
        },
        body: JSON.stringify(genre)
      })
      .then(function (response) {
        return response.json();
      }).then((response) => {
        console.log(response)
        return response;
      });
    }

    parseDate = date => {
        return moment(date).format("DD-MM-YYYY");
    }


    render(){

        function ComboBox(props){
            let element;
            if(props.type === "edit"){
                element = <Autocomplete
                    id="combo-box-demo"
                    onChange={(event, value) => props.handleEvent(event, value)}
                    options={props.data}
                    getOptionLabel={(option) => option.Name}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label={props.selectedGenre} variant="outlined" />}
              />
            } else {
                element = <div></div>;
            }
            return element
        }

        function ActionButton(props){
            let element;
            if(props.type === "edit"){
                element = <Button id="genre-save-button" variant="contained" size="large" onClick={props.handleEditGenre}>
                    Gem ændringer
                </Button>
            } else {
                element = <Button id="genre-save-button" variant="contained" size="large" onClick={props.handleCreateGenre}>
                    Opret Genre
                </Button>
            }
            return element
        }

        return (
        <div>
            <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
                <MUILink onClick={() => this.props.history.push('/')}>
                    Forside
                </MUILink>
                <MUILink onClick={() => this.props.history.push('/dashboard')}>
                    Dashboard
                </MUILink>
                <Typography color="text.primary">Genre formular</Typography>
            </Breadcrumbs>
            <div className="genreform-container">
                <h5>Genre formular</h5>
                <ComboBox type={this.props.type} data={this.state.genres} handleEvent={this.handleSelector} selectedGenre={this.state.selectedGenre.Name}/>
                
                <TextField id="Name" label="Name" variant="outlined" 
                    value={this.state.genre.Name} 
                    onChange={event => this.handleFormChange(event)}
                />
                <div id="picture-path-column">
                    <TextField
                        disabled
                        label="Coverbillede"
                        variant="filled"
                        value={this.state.genre.picturePath}
                    />
                    <label id="upload-label" htmlFor="contained-button-file">
                        <Input 
                            accept="image/*" 
                            id="contained-button-file" 
                            type="file"
                            onChange={this.handlePictureUpload} 
                        />
                        <Button  variant="contained" component="span">
                            Upload
                        </Button>
                    </label>
                </div>
                
                

                <ActionButton type={this.props.type} handleEditGenre={this.handleEditGenre} handleCreateGenre={this.handleCreateGenre}/>
            </div>
        </div>
        )};
};