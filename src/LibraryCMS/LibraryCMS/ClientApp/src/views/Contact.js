import React, { Component } from 'react';
import './../style/contact.css';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';

export default class Contact extends Component {
    static displayName = Contact.name;

    
    render(){
        return (
        <div>
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
              <MUILink onClick={() => this.props.history.push('/')}>
                  Forside
              </MUILink>
              <Typography color="text.primary">Kontakt</Typography>
          </Breadcrumbs>
          <h4>Kontakt</h4>
          <div className="contact-container">
            <div>
              <h5>Jacob Oscar Wistrøm</h5>
              <p>Kontakte eller følg mig på følgende oplysninger:</p>
              <ul>
                <li>Email: <a href="mailto:Jacob.wistroem@gmail.com">Jacob.wistroem@gmail.com</a></li>
                <li>Linkedin: <a href="https://www.linkedin.com/in/jacob-wistr%C3%B8m-483359160/">Jacob Wistrøm</a></li>
                <li>Github: <a href="https://github.com/JacobWistroem">JacobWistroem</a></li>
              </ul>
            </div>
            <div>
              <h5>Mark Mazur Lussenburg</h5>
              <p>Kontakte eller følg mig på følgende oplysninger:</p>
              <ul>
                <li>Email: <a href="mailto:Markcool3@gmail.com">Markcool3@gmail.com</a></li>
                <li>Linkedin: <a href="https://www.linkedin.com/in/mark-mazur-lussenburg-078a1582/">Mark Lussenburg</a></li>
                <li>Github: <a href="https://github.com/Storkmeister">Storkmeister</a></li>
              </ul>
            </div>
          </div>
        </div>
        )}
}