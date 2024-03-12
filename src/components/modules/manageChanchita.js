/* import React from 'react';
import Header from "../header";
import Table from 'react-bootstrap/Table';
import fetchData from '../../share/fetchData'
import LoadingPage from '../loading';
import trash from "../../assets/images/trash.png";
import "../../assets/css/manageModules.css"
import "../../assets/css/table.css"

export default class ManagerChanchita extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            greetings: [],
            filteredGreetings: [],
            colaboradores: [],
            filteredColaboradores: []
        };
        this.cargarGreetings = this.cargarGreetings.bind(this)
        this.filterAzulitos = this.filterAzulitos.bind(this)
        this.cargarColaboradores = this.cargarColaboradores.bind(this)
        this.filterColaboradores = this.filterColaboradores.bind(this)
      }

    componentDidMount() {
        this.cargarGreetings((data) => {
            console.log(data[0])
            this.setState({
                loaded: true,
                greetings: data[0], 
                filteredGreetings: data[0]
            })
        })

        this.cargarColaboradores((data) => {
            console.log(data[0])
            this.setState({
                loaded: true,
                colaboradores: data[0],
                filteredColaboradores: data[0]
            })            
        })
    }

    cargarGreetings(callback) {
        fetchData.getData("http://127.0.0.1:2500", 
            "/administracion/greetings/listGreeting", 
            callback
        )
    }

    cargarColaboradores(callback) {
        fetchData.getData("http://127.0.0.1:2500", 
            "/administracion/greetings/listColaboradores", 
            callback
        )
    }

    filterAzulitos(e) {
        this.setState({filteredGreetings:
            this.state.greetings.filter(value => {
                return value.codigoAzulito.includes(e.target.value)
            })
        })    
    }

    filterColaboradores(e) {
        this.setState({filteredColaboradores:
            this.state.colaboradores.filter(value => {
                return value.codAzulito.includes(e.target.value)
            })
        })    
    }


    deleteGreeting(evt, deletedData) {
        const greetFilterAfterDelete =
        this.state.greetings.filter((value, key) => {
            return deletedData.codigoAzulito !== value.codigoAzulito
        })

        this.setState({
            greetings: greetFilterAfterDelete,
            filteredGreetings: greetFilterAfterDelete
        })

        fetchData.deleteData("http://127.0.0.1:2500", 
            "/administracion/greetings/deleteGreeting?deleteAzulito=" + deletedData.codigoAzulito, 
            rpta => {
                console.log(rpta)
            }
        )        
    }

    render() {

        const content = this.state.loaded ? this.state.colaboradores : 'Loading...';
        if (typeof content !== "string") { 
            const { navigate } = this.props;
            return (
                <div id="divManage">
                    < Header navigate={navigate} moduleListasSelected={false} moduleHistoriaSelected={false} moduleManageSelected={true} />
                    <div id="regrabarAudios" className='regrabarAudios'>
                        
                            <Table className="fixed_header">
                                <thead>
                                    <tr>
                                        <th className="header-label">colaborador</th>
                                        <th className="header-label">Eliminar Grabacion</th>
                                        
                                    </tr>
                                    <tr className="tr-inputs">
                                    <th>
                                        <div>
                                            <form >
                                                <input type="string" onChange={this.filterAzulitos}/>
                                            </form>
                                        </div>
                                    </th>
                                    
                                </tr>
                                </thead>
                                <tbody>
                                    {this.state.filteredGreetings.map((value,key) => 
                                        <tr key={key}>
                                            <td>{value.codigoAzulito}</td>
                                            <td><img src={trash} alt="trashImg" className="trashImg" onClick={(event) => this.deleteGreeting(event, value)}/></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        
                    </div>
                    <div id="colaboradores" className='tablaColaboradores'>
                        <Table className="fixed_header_tc">
                            <thead>
                                <tr>
                                    <th className="header-label">colaborador</th>
                                    <th className="header-label">Nombres</th>
                                    <th className="header-label">Lista</th>
                                    <th className="header-label">Eliminar</th>
                                    
                                </tr>
                                <tr className="tr-inputs">
                                <th>
                                    <div>
                                        <form >
                                            <input type="string" onChange={this.filterColaboradores}/>
                                        </form>
                                    </div>
                                </th>
                                
                            </tr>
                            </thead>
                            <tbody>
                                {this.state.filteredColaboradores.map((value,key) => 
                                    <tr key={key}>
                                        <td>{value.codAzulito}</td>
                                        <td>{value.nombres}</td>
                                        <td>{value.idLista}</td>
                                        <td><img src={trash} alt="trashImg" className="trashImg" onClick={(event) => this.deleteGreeting(event, value)}/></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )
        } else {
            // Loading...
            return < LoadingPage />
        }
    }

} */