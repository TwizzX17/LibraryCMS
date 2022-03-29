import React, { Component } from 'react';
import './../style/aboutUs.css';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MUILink from '@mui/material/Link';

export default class AboutUs extends Component {
    static displayName = AboutUs.name;


    render() {
        return (
            <div>
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
                    <MUILink onClick={() => this.props.history.push('/')}>
                        Forside
                    </MUILink>
                    <Typography color="text.primary">Om os</Typography>
                </Breadcrumbs>
                <h4>Om os</h4>

                <div className="about-container">
                    <h2>Dette projekt er udviklet af Mark Mazur Lussenburg & Jacob Oscar Wistrøm</h2>
                    <p>Mark & Jacob startede på TECs Data & Kommunikationsuddannelse i 2017, begge med ambitioner om at færdiggører uddannelsen med et speciale i programmering.</p>
                    <p>Mark har siden 2018 arbejdet i en Web virksomhed som primært kører en ældre .NET løsning. Firmaet hed e-supplies og blev stiftet i 90'erne. Firmaet har i 2021 gået gennem større strukturelle ændringer, og hedder nu Emporio Technologies</p>
                    
                    <p>Jacob fik elevplads i 2017 hos Hnet ApS, hvor han har udarbejdet EDI løsninger for andre firmaer. Dette inkluderer python scripts til databehandling og javascript til frontend løsninger.</p>
                    <p>Vi har med dette projekt forsøgt at skabe noget som kunne være inden for virkelighedens rammer. Selvfølgelig er alt ikke tænkt 100% med, men vi som udviklere har prøvet på at tænke så bredt som muligt</p>
                    <p>Hvis projektet virkelig skulle have simuleret virkelighed, skulle vi have haft en kunde med ombord som vi kunne styre projektet efter. På trods af den manglende feedback, er vi stolte af hvad vi nåede.</p>
                    <p>Vi knoklede igennem på trods af to sygdomsforløb under udviklingen af projektet, og blev færdige med vores Minimum Viable Product som her er: Library CMS.</p>

                </div>
            </div>
        )
    }
}