import React, { Component } from 'react';
import AuthService from './../components/AuthService';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import './../style/bookForm.css';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';
import moment from 'moment';

const Input = styled('input')({
    display: 'none',
  });

let Auth = new AuthService();

export class BookForm extends Component {
    static displayName = BookForm.name;
    constructor(){
        super();
        this.state = {
            book: {
                Id: undefined,
                Title: "",
                Resume: "",
                PicturePath: '/book/image.png',
                PageCount: 0,
                Publisher: "",
                PublishedOn: moment().format("DD-MM-YYYY"),
                Status: 1,
                DefaultRentalDays: 0,
                BooksInStock: 0,
                Author: "",
                Genres: [],
                Rentals: []
            },
            books: [
            ],
            selectedBook: {
                Title: "Vælg bog",
                Id: undefined
            },
            allGenres: [],
            selectedGenres: [],
            uploadFile: {}
        };
    }

    async componentWillMount(){
        const books =  await this.getAllBooks();
        const genres = await this.getAllGenres();

        this.setState({allGenres: genres});
        this.setState({books: books});
    }

    async componentDidUpdate(){
        if(this.state.selectedBook.Id !== this.state.book?.Id && this.state.selectedBook.Id !== undefined){
            let book = await this.getBookById(this.state.selectedBook.Id);
            //Handle date format
            book.PublishedOn = this.parseDate(book.PublishedOn);
            //Delete $id
            delete book.$id;
            //Handle Genres
            let selectedGenres = []
            for(const selected of book.Genres){
                for(const genre of this.state.allGenres){
                    if(selected.GenreId === genre.Id){
                        selectedGenres.push(genre.Name);
                    }
                }
            }
            //book.Genres = []
            this.setState({
                book: book, 
                selectedGenres: selectedGenres
            });
        }
    }

    handleSelector = (e, value) => {
        this.setState({selectedBook: value});
    }

    handleFormChange = (e) =>{
        let book = this.state.book;
        book[e.currentTarget.id] = e.currentTarget.value;
        this.setState({book: book})
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

    handleCreateBook = async (e) => {
        let book = this.state.book;

        //Resolve genres from names to IDs
        let genreArray = [];
        for(const selected of this.state.selectedGenres){
            for(const genre of this.state.allGenres){
                if (selected === genre.Name){
                    genreArray.push({GenreId: genre.Id})
                }
            }
        }
        book.Genres = genreArray;
        
        //Set date to correct format
        book.PublishedOn = moment(book.PublishedOn, "DD-MM-YYYY").format()
        //Remove undefined Id property
        delete book.Id

        const response = await this.BookAction(book,'CreateBook', 'POST');
    }

    handleEditBook = async (e) => {
        let book = this.state.book;

        //Resolve genres from names to IDs
        let genreArray = [];
        for(const [key, value] of Object.entries(this.state.selectedGenres)){
            
            for(const genre of this.state.allGenres){
                if (value === genre.Name){
                    genreArray.push({GenreId: genre.Id})
                    /*
                    let ID;
                    for(const bookGenre of book.Genres){
                        if(bookGenre.GenreId === genre.Id){
                            ID = bookGenre.Id
                            break;
                        }
                    }
                    let obj = {
                        BookId: book.Id,
                        GenreId: genre.Id,
                        Id: (ID ? ID : null),
                        Genre: null
                    }
                    if(obj.Id === null){
                        delete obj.Id;
                    }
                    genreArray.push(obj)
                    */
                }
            }
            
        }
        book.Genres = genreArray;
        
        //Set date to correct format
        book.PublishedOn = moment(book.PublishedOn, "DD-MM-YYYY").format()

        const response = await this.BookAction(book, 'UpdateBook', 'PUT');
    }
    
    getBookById = async (id) => {
        const result = await fetch(`/Book/GetBook/${parseInt(id)}`,{
            method:"get"
        })
        .then(function (response) {
            return response.json();
        }).then((response) => {
            return response;
        });
        return result
    }


    getAllBooks = async () => {
        const result = await fetch(`/Book/GetAllBooks`,{
            method:"get"
        })
        .then(function (response) {
            return response.json();
        }).then((response) => {
            return response;
        });
        return result
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
        return await fetch(`/Genre/GetGenres`,{
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
   * @param {object} book Book object
   * @param {object} method GET / POST / PUT / DELETE 
   * @returns {boolean} HTTP Response
   */
    BookAction = (book, endpoint, method) => {
    fetch(`/Book/${endpoint}`, {
        method: method,
        mode: "cors",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${Auth.getToken()}`,
        },
        body: JSON.stringify(book)
      })
      .then(function (response) {
        return response.json();
      }).then((response) => {
        console.log(response)
        if(response.state === true){
          return true;
        } else {
          return false;
        }
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
                    getOptionLabel={(option) => option.Title}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label={props.selectedBook} variant="outlined" />}
              />
            } else {
                element = <div></div>;
            }
            return element
        }

        function ActionButton(props){
            let element;
            if(props.type === "edit"){
                element = <Button id="book-save-button" variant="contained" size="large" onClick={props.handleEditBook}>
                    Gem ændringer
                </Button>
            } else {
                element = <Button id="book-save-button" variant="contained" size="large" onClick={props.handleCreateBook}>
                    Opret Bog
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
                <Typography color="text.primary">Bog formular</Typography>
            </Breadcrumbs>
            <div className="bookform-container">
                
                <h5>Bog formular</h5>
                <ComboBox type={this.props.type} data={this.state.books} handleEvent={this.handleSelector} selectedBook={this.state.selectedBook.Title}/>
                
                <TextField id="Title" label="Title" variant="outlined" 
                    value={this.state.book.Title} 
                    onChange={event => this.handleFormChange(event)}
                />
                <div id="picture-path-column">
                    <TextField
                        disabled
                        label="Coverbillede"
                        variant="filled"
                        value={this.state.book.PicturePath}
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
                <TextField id="Author" label="Forfatter" variant="outlined" 
                    value={this.state.book.Author} 
                    onChange={event => this.handleFormChange(event)}
                />
                <TextField id="BooksInStock" label="Antal fysiske bøger" variant="outlined" 
                    value={this.state.book.BooksInStock} 
                    onChange={event => this.handleFormChange(event)}
                />
                <TextField id="PageCount" label="Sidetal" variant="outlined" 
                    value={this.state.book.PageCount} 
                    onChange={event => this.handleFormChange(event)}
                />
                <TextField id="Status" label="Lånestatus" variant="outlined" 
                    value={this.state.book.Status} 
                    onChange={event => this.handleFormChange(event)}
                />
                <TextField id="Publisher" label="Forlag" variant="outlined" 
                    value={this.state.book.Publisher} 
                    onChange={event => this.handleFormChange(event)}
                />
                <FormControl id="Genre-form-control" sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-chip-label">Genre</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="Genres"
                        multiple
                        value={this.state.selectedGenres}
                        onChange={(event, value) => this.handleChipSelectorChange(event, value)}
                        input={<OutlinedInput id="select-multiple-chip" label="Genre" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </Box>
                        )}
                    >
                        {this.state.allGenres.map((Item) => (
                            <MenuItem
                            key={Item.Id}
                            value={Item.Name}
                            >
                            {Item.Name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField id="PublishedOn" label="Udgivelsesdato (dd-mm-yyyy)" variant="outlined" 
                    value={this.state.book.PublishedOn} 
                    onChange={event => this.handleFormChange(event)}
                />
                <TextField id="DefaultRentalDays" label="Tilladte lånedage" variant="outlined" 
                    value={this.state.book.DefaultRentalDays} 
                    onChange={event => this.handleFormChange(event)}
                />
                <TextField id="Resume" className="book-resume" label="Resumé" multiline variant="outlined"  rows={4}
                    value={this.state.book.Resume} 
                    onChange={event => this.handleFormChange(event)}
                />

                <ActionButton type={this.props.type} handleEditBook={this.handleEditBook} handleCreateBook={this.handleCreateBook}/>
            </div>
        </div>
        )}
}