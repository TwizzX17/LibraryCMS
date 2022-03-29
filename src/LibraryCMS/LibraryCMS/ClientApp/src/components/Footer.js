import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container } from 'reactstrap';
import './../style/footer.css';

function Footer ({ children, ...rest }) {
    return (
        <footer>
            <Container>
                <div>
                    <h5>Det her kan du online</h5>
                    <div><Link to="/">Låne bøger</Link></div>
                    <div><Link to="/">Checke dine lån</Link></div>
                    <div><Link to="/">Se bibliotekets inventar</Link></div>
                </div>
                <div>
                    <h5>Om Biblioteket</h5>
                    <div><Link to="/">Om projektet</Link></div>
                    <div><Link to="/">Åbningstider</Link></div>
                    <div><Link to="/">Bliv frivilig</Link></div>
                </div>
                <div>
                    <h5>Det her kan du online</h5>
                    <div><Link to="/">TEC - Technical Education Ballerup</Link></div>
                    <div><Link to="/">Mark Lussenburg - Jacob Wistrøm</Link></div>
                    <div><Link to="/">H6 - Svendeprøveforløb</Link></div>
                </div>
            </Container>
        </footer>
    )
}
export default Footer;