import React from 'react';
import '../assets/css/App.css';
import Header from "./header";
import Welcome from "./welcomeText";
import "../assets/css/locationWeb.css" 

export default class Modules extends React.Component {
    render() {
        
        const { navigate, dbCon } = this.props;
        return (
            <div className='wrapper'>
                <Welcome dbcon={dbCon}/>
                <Header navigate={navigate} dbCon={dbCon} />
            </div>
        )
    }
}