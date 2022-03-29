import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './../style/searchResults.css';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';

export class SearchResults extends Component {
    static displayName = SearchResults.name;
    constructor(){
        super();
        this.state = {
            items: [
        ]
        };
    }

    async componentWillMount(){
        const items = await this.getSearchResults(this.props.match.params.title);
        this.setState({items: items});
        this.setState({search: this.props.match.params.title})
    }

    async componentDidUpdate(){
        //If Condition prevents a infinite loop
        if(this.props.match.params.title !== this.state.search){
            const items = await this.getSearchResults(this.props.match.params.title);
            this.setState({items: items});
            this.setState({search: this.props.match.params.title})
        };
    }

    /**
     * Fetch all books from the database
     * 
     * @returns database data as objects in array
     */
     getSearchResults = async (keyword) => {
        const endpoint = 'SearchAllRentableBooks';
        return await fetch(`/Book/${endpoint}?searchtext=${keyword}`,{
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
                <div id="search-headline-container">
                    <h2>{this.props.Title}</h2>
                    <p>Der er {this.state.items.length} bøger i denne søgning</p>
                </div>
                <Breadcrumbs aria-label="breadcrumb">
                  <MUILink onClick={() => this.props.history.push('/')}>
                    Forside
                  </MUILink>
                  <Typography color="text.primary">Søgning</Typography>
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