import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './../style/bookCategory.css';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';

export class Books extends Component {
  static displayName = Books.name;
  constructor() {
    super();
    this.state = {
      title: {
        Id: 0,
        Name: ""
      },
      items: []
    };
  }

  async componentWillMount() {
    const items = await this.getAllBooks();
    this.setState({ items: items });
  }


  /**
   * Fetch all books from the database
   * 
   * @returns database data as objects in array
   */
  getAllBooks = async () => {
    const endpoint = 'GetAllBooks';
    return await fetch(`/Book/${endpoint}`, {
      method: "get"
    })
      .then(function (response) {
        return response.json();
      }).then((response) => {
        return response;
      });
  }

  render() {
    return (
      <div>
        <div className="search-result-grid">
          <h2>{this.state.title.Name}</h2>
          <Breadcrumbs aria-label="breadcrumb">
            <MUILink onClick={() => this.props.history.push('/')}>
              Forside
            </MUILink>
            <Typography color="text.primary">Alle Bøger</Typography>
          </Breadcrumbs>
          <div className="category-filter-container">
            {
              this.state.items.map((item, key) => {
                const element =
                  <div key={key} className="item-card">
                    <Link to={`/Bøger/${item.Id}`}>
                      <div>
                        <img src={`/img/${item.PicturePath}`} alt="BookCover" />
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
    )
  }
}