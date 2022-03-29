import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './../style/home.css';

export class Home extends Component {
    static displayName = Home.name;
    constructor(){
        super();
        this.state = {
            categories: []
        }
    }

    async componentWillMount(){
        this.setState({categories: await this.getAllGenres()});
    }

    getAllGenres = async () => {
        return await fetch(`/Genre/GetGenres`,{
          method:"get"
        })
        .then(function (response) {
          return response.json();
        }).then((response) => {
          return response;
        }).catch(error => {
          console.log(error);
          return error;
        });
      }

    render(){
        return (
        <div>
            <div className="category-container">
              <div>
                <h4>Velkommen til Library CMS</h4>
                        <p>Her kan du låne bøger hvis du har en konto. Uden en konto kan du browse bibliotekets indhold via navigations baren I toppen. Klik blot på "Genrer" for at få en liste af genrer som du kan browse.</p>
                        <p>Alle kan oprette en konto, dog kræver det at en bibliotekar bekræfter dig som bruger af systemet. For at kunne blive godkendt af en bibliotekar kræver det at adressen på kontoen er inden for bibliotekets kommune.</p>
                        <p>Vi ønsker dig en god brugeroplevelse.</p>
                        <p>- Team Library CMS</p>
              </div>
              <div>
                <h4>Hurtig Menu</h4>
                <ul>
                  <li><Link to="/Bøger">Alle Bøger</Link></li>
                  <li><Link to="/about-us">Om Projektet</Link></li>
                </ul>
              </div>
            </div>
        </div>
        )}
}