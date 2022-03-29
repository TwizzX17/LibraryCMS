import React, { Component } from 'react';
import AuthService from './../components/AuthService';
import moment from 'moment';
import MyDatePicker from './../components/DatePicker';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import './../style/displayitem.css';

let Auth = new AuthService();

export class DisplayItem extends Component {
    static displayName = DisplayItem.name;
    constructor(){
        super();
        this.state = {
            item: {
                Title: "",
                Resume: "",
                PicturePath: '',
                PageCount: 0,
                Publisher: "",
                PublishedOn: '',
                Status: 1,
                DefaultRentalDays: 0,
                BooksInStock: 0,
                Author: "",
                Genres: [],
                Rentals: []
            },
            date: new Date(),
            genreNames: [],
            rentalObj: {
                BookId: 0,
                BookTitle: "",
                RentalDate: moment().format()
            }
        };
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    async componentDidMount(){
        let item = await this.getBookById(this.props.match.params.id);
        
        //Handle date format
        item.PublishedOn = this.parseDate(item.PublishedOn);
        this.setState({item: item});
        
        this.setState({
            rentalObj: {
                BookId: item.Id,
                BookTitle: item.Title,
                RentalDate: moment().format()
            }});
        
        let genreIds = [];
        for(const genre of item.Genres){
            genreIds.push(genre.GenreId)
        }
        let namesArray = []
        for(const Id of genreIds){
            const name = await this.getGenreById(Id);
            namesArray.push(name.Name);
        }
        this.setState({genreNames: namesArray});

        //const nextRental = await this.getNextRentalAvailableById(item.Id);
        //this.setState({nextRental: nextRental});
        


        console.log(this);
    }

    handleDateChange(date){
        //const dateFormatted = moment(date).format();
        this.setState({date: date});
    }


    handleCreateRental = async () => {
        let response = await this.postRentBook(this.state.rentalObj);
        console.log(response);
    }


    parseDate = date => {
        return moment(date).format("DD MMMM YYYY");
    }

    calcEndDate(startDate, periode) {
        return moment(startDate).add(periode, 'days').toDate();
    }

    /**
     * Fetch a book from the database by the books primary key
     * 
     * @param  {int} id The primary key of the book you want to retreive from the database
     * @returns database data in object format
     */
    getBookById = async (id) => {

        const result = await fetch(`/Book/GetBook/${parseInt(id)}`,{
            method:"get"
        })
        .then(function (response) {
            return response.json();
        }).then((response) => {
            console.log(response)
            return response;
        });
        return result
    }

    getGenreById = async (id) => {
        return await fetch(`/Genre/getGenreById?Id=${id}`,{
          method:"get"
        })
        .then(function (response) {
          return response.json();
        }).then((response) => {
          return response;
        });
      } 

      getNextRentalAvailableById = async (id) => {
        return await fetch(`/Rental/GetNextAvailableRentalDate?bookId=${id}`,{
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`,
            },
            method:"get"
        })
        .then(function (response) {
          return response.json();
        }).then((response) => {
          return response;
        });
      } 
        

    


    postRentBook = async (rental) => {
        return await fetch(`/Rental/RentBook` ,{
          method:"POST",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${Auth.getToken()}`,
        },
          body: JSON.stringify(rental)
        })
        .then(function (response) {
          return response.json();
        }).then((response) => {
          return response;
        });
      } 



    render(){

        const RentalForm = () => {
            let element = null;
            if(this.props.loggedIn){
                element = <div>
                    <p>Bøger på lager: {this.state.item.BooksInStock}</p>
                    
                    <div className="datepicker-form">
                        <span>Udlånsdato: </span>
                        <MyDatePicker 
                            selectedDate={this.state.date}
                            onDateChange={this.handleDateChange}
                            disabled={false}
                            minDate={new Date()}
                        />
                        <p> - </p>
                        <MyDatePicker 
                            selectedDate={this.calcEndDate(this.state.date, this.state.item.DefaultRentalDays)}
                            disabled={true}
                        />
                        {/*
                            endDate={this.calcEndDate(this.state.date, this.state.item.DefaultRentalDays)}
                        */}
                    </div>
                    <Button id="rent-button" variant="contained" size="large" disabled={!this.state.item.BooksInStock != 0}
                        onClick={this.handleCreateRental}>
                        Lån
                    </Button>
                </div>
            }
            return element;
        }

        return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Link onClick={() => this.props.history.push('/')}>
                Forside
                </Link>
                <Link
                    onClick={() => this.props.history.goBack()}
                >
                {this.props.location.pathname.split('/').filter(x => x)[0]}
                </Link>
                <Typography color="text.primary">{this.state.item.Title}</Typography>
            </Breadcrumbs>
            <div className="item-grid">
                <img alt="image" src={`/img/${this.state.item.PicturePath}`}/>
                <div>
                    <h4>{this.state.item.Title}</h4>
                    <p>{this.state.item.Resume}</p>
                </div>
                <table id="item-table">
                    <tbody>
                        <tr>
                            <td>Forfatter:</td>
                            <td>{this.state.item.Author}</td>
                        </tr>
                        <tr>
                            <td>Udgivelse:</td>
                            <td>{this.state.item.PublishedOn}</td>
                        </tr>
                        <tr>
                            <td>Forlag:</td>
                            <td>{this.state.item.Publisher}</td>
                        </tr>
                        <tr>
                            <td>Genre(r):</td>
                            <td>
                            {
                                this.state.genreNames.map((item, key) => {
                                    return <div key={key}>{item}</div>
                                })
                            }
                            </td>
                        </tr>
                    </tbody>
                </table>
                <RentalForm/>
            </div>
            
        </div>
        )}
}