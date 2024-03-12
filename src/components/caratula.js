import React from 'react';
import '../assets/css/App.css';
import logo from '../assets/images/azulito.png';
import Auth from './auth';

export default class Caratula extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showFormSingin: false
    };

    this.setShowFormSingin = this.setShowFormSingin.bind(this)
  }

  setShowFormSingin() {
    if (this.state.showFormSingin)
      this.setState({
        showFormSingin: false
      })
    else {
      this.setState({
        showFormSingin: true
      })
    }
  }
  
        
  render() {
    return (
      <div className="App">
        <h1 className='App-header'>
          <img src={logo} className="App-logo" alt="logo" onClick={this.setShowFormSingin}/>
          {this.state.showFormSingin ? <Auth title="Supervisor Authentication" 
              otherwise="I'm Azulito" 
              //conDB={this.props.dbCon.ip}
              navigate={this.props.navigate}/> : ""}
        </h1>
      </div>
    )
  }
}