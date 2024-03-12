import React from 'react';
import fetchData from '../share/fetchData'
import LoadingPenales from './loadingPenales';
import logo from '../assets/images/azulito.png';
import {penales} from '../share/penales'
import "../assets/css/thinkingBubble.css"
import Alerta from './alerta'
import { positions, Provider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

export default class CentralPenales extends React.Component {
    constructor(props) {
        super(props);
        this.navigate = props.navigate
        this.state = {
          loaded: false,
          historiaGeneralListas: [],
          historiaDetalleListas: [],
          pointerPenal: penales[0].nombre,
          dataNoReach: [],
          showAlert: false
        };
        this.dashboard = this.dashboard.bind(this)
        
    }

    async componentDidMount() {
        for (let key in penales) {
            this.setState({ pointerPenal: penales[key].nombre})

            try {
                await this.getDataGeneralPenales(penales[key].ip, key)
            } catch(err) {
                this.setState({ 
                    dataNoReach: [...this.state.dataNoReach, {penal: penales[key].prefijo, nombre: penales[key].nombre}]
                })
                console.log("EE..",err, penales[key].ip)
                continue
            }
        }
        this.setState({loaded: true, showAlert: true})
    }

    async getDataGeneralPenales(penalConn, indexPenal) {
        let response = await fetchData.getDataPromise("http://" + penalConn + ":2500", "/listas/getHistoriaListas", 20000); 
        let data = await response.json()
         
        this.setState({ 
            historiaGeneralListas: [...this.state.historiaGeneralListas, {penalName: penales[indexPenal].nombre, penalPrefix: penales[indexPenal].prefijo, data: data[0]}], 
            historiaDetalleListas: [...this.state.historiaDetalleListas, {penalName: penales[indexPenal].nombre, penalPrefix: penales[indexPenal].prefijo, data: data[1]}]
        })
        return Promise.resolve(1)
    }

    setFinishedOfGettingData(indexPenal) {
        if (++indexPenal === penales.length) {
            this.setState({loaded: true})
            return Promise.resolve(true)
        } else {
            return Promise.resolve(false)
        }
    }

    dashboard() {
        this.navigate('/centralPenales/dashboard', {state: {
            historiaDetalleListas: this.state.historiaDetalleListas, 
            historiaGeneralListas: this.state.historiaGeneralListas
        }})
    }

    refreshPage() {
        window.location.reload(false);
    }

    fShowAlert(show) {
        console.log(this.state.historiaDetalleListas)
        if (show){
            const options = {
                timeout: 5000,
                position: positions.TOP_CENTER,
            };

            let messages = {
                header: "We couldn't get data from: ",
                body: null
            }

            if (this.state.dataNoReach.length !== 0) {
                messages.body = this.state.dataNoReach.map(ep => {
                    return ep.nombre
                })
            } else {
                messages.header = "We get everything"
            }
            return (
                <Provider template={AlertTemplate} {...options}>
                    <button onClick={this.refreshPage}>
                        Reload
                    </button>
                    < Alerta toShow={messages}/>
                    <button onClick={this.dashboard}>
                        Dashboard
                    </button>
                    
                </Provider>
            )
        }
    }

    render() {

        // Loading...
        return (
            <h1 style={{textAlign: "center", paddingTop: "2px"}}>
                We are getting data from prisons...
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    < LoadingPenales penal={this.state.pointerPenal}/> 
                </div>
                <div>
                    {this.fShowAlert(this.state.showAlert)}
                </div>
            </h1>
        )
        
    }
}

