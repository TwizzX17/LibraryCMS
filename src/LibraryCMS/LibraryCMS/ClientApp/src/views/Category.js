import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './../style/bookCategory.css';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';

export class Category extends Component {
    static displayName = Category.name;
    constructor(){
        super();
        this.state = {
            title: {
                Id: 0,
                Name: ""
            },
            items: []
        };
    }

    async componentWillMount(){
        const title = await this.getGenreById(this.props.match.params.genre);
        const items = await this.getBooksByGenre(this.props.match.params.genre);
        this.setState({title: title.Name});
        this.setState({items: items});
    }

    async componentDidUpdate(){
        //If Condition prevents a infinite loop
        if(parseInt(this.props.match.params.genre) !== this.state.title.Id){
            const title = await this.getGenreById(this.props.match.params.genre);
            const items = await this.getBooksByGenre(this.props.match.params.genre);
            this.setState({title: title});
            this.setState({items: items});
        };
    }

    /**
     * Fetch all books from the database
     * 
     * @returns database data as objects in array
     */
     getBooksByGenre = async (keyword) => {
        const endpoint = 'GetBooksByGenreId';
        return await fetch(`/Book/${endpoint}?Id=${keyword}`,{
          method:"get"
        })
        .then(function (response) {
          return response.json();
        }).then((response) => {
          return response;
        });
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

    render(){
        return (
        <div>
            <div className="search-result-grid">
                <h2>{this.state.title.Name}</h2>
                <Breadcrumbs aria-label="breadcrumb">
                  <MUILink onClick={() => this.props.history.push('/')}>
                    Forside
                  </MUILink>
                  <Typography color="text.primary">{this.state.title.Name}</Typography>
                </Breadcrumbs>
                <div className="category-filter-container">
                    {
                        this.state.items.map((item, key) => {
                            const element = 
                            <div key={key} className="item-card">
                                <Link to={`/Bøger/${item.Id}`}>
                                    <div>
                                        <img src={`/img/${item.PicturePath}`} alt="BookCover"/>
                                    </div>
                                </Link>
                                <Link to={`/Bøger/${item.Id}`}><h3>{item.Title}</h3></Link>
                                <Link to={`/Bøger/${item.Id}`}><p>{item.Author}</p></Link>
                            </div>

                            return element;
                        })
                    }
                </div>
            </div>
        </div>
        )}
}