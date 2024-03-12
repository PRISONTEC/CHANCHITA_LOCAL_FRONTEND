import React from 'react';
import fetchData from '../../share/fetchData'
import LoadingPage from '../loading';
import "../../assets/css/manageModules.css"
import "../../assets/css/table.css"
import VentanaEmergente from "./ventanaEmergente"
import AppTable from './tabla_react'
import Papelera from '../../assets/images/papelera.svg'
import styled from 'styled-components';
import Header from "../header";

export default class ManagerChanchita extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            colaboradores: [],
            filteredColaboradores: [],
            internos: [],
            colaboradorIngresado: null,
            idListaColaborador: null,            
            ventanaEmergente: false,
            codAzulNewCol:'',
            idListNewCol:'',            
            mostrarFormulario:true,
            mensajeAgregarColaborador:'',
            columnas:[                                                 
                    {
                        Header: "Codigo",
                        accessor: "codAzulito",
                        maxWidth: 110,
                        minWidth: 110,
                        width: 110,
                    },
                    {
                        Header: "Nombres",
                        accessor: "nombres",
                        maxWidth: 500,
                        minWidth: 500,
                        width: 500,
                    },          
                    {
                        Header: 'Lista',
                        accessor: 'idLista',
                        maxWidth: 70,
                        minWidth: 70,
                        width: 70,
                    },
                    {
                        maxWidth: 70,
                        minWidth: 70,
                        width: 70,
                        Header: "Quitar",
                        //value={cell.row.values.name}
                        Cell: ({ cell }) => (
                            <button onClick={async (e) => await this.funcionEliminar(e,cell.row.values.codAzulito)}>
                                <img src={Papelera} alt="logo" className="trashImg"/>
                            </button>)
                    }  
            ]
        };
        
        this.cargarColaboradores = this.cargarColaboradores.bind(this)
        this.filterColaboradores = this.filterColaboradores.bind(this)
        this.mostrarOcultarVentanaEmergente = this.mostrarOcultarVentanaEmergente.bind(this)
        this.cargarInternos = this.cargarInternos.bind(this)
        this.handleChangeCodAzulNewCol = this.handleChangeCodAzulNewCol.bind(this)
        this.handleChangeIdListNewCol = this.handleChangeIdListNewCol.bind(this)
        this.agregarNuevoColaborador = this.agregarNuevoColaborador.bind(this)
        

    }

    componentDidMount() {
        this.cargarColaboradores((data) => {
            this.setState({
                loaded: true,
                colaboradores: data[0],
                filteredColaboradores: data[0]
            })
        })

        this.cargarInternos((data) => {
            this.setState({
                loaded: true,
                internos: data
            })            
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filteredColaboradores !== this.state.filteredColaboradores) {
          console.log('pokemons state has changed.')
        }
    }

    cargarColaboradores(callback) {
        fetchData.getData("http://" + this.props.dbCon.ip + ":2500",
            "/administracion/colaboradores/listColaboradores",
            callback
        )
    }

    cargarInternos(callback) {
        fetchData.getData("http://" + this.props.dbCon.ip + ":2500",
            "/administracion/colaboradores/getInternos",
            callback
        )
    }

    filterColaboradores(e) {
        this.setState({
            filteredColaboradores:
                this.state.colaboradores.filter(value => {
                    return value.codAzulito.includes(e.target.value)
                })
        })
    }

    async funcionEliminar(e,codAzulito){
        const colaboradoresFilterAfterDelete =
        this.state.colaboradores.filter((value, key) => {
            return codAzulito !== value.codAzulito
        })

        this.setState({
            colaboradores: colaboradoresFilterAfterDelete,
            filteredColaboradores: colaboradoresFilterAfterDelete
        })
        fetchData.deleteData("http://" + this.props.dbCon.ip + ":2500",
            `/administracion/colaboradores/deleteColaborador?deleteAzulito=${codAzulito}`,
            rpta => {
                console.log(rpta);
            }
        )
    }
    
    mostrarOcultarVentanaEmergente(){
        this.setState({ventanaEmergente : !this.state.ventanaEmergente});
    }

    handleChangeCodAzulNewCol(event) {
        this.setState({codAzulNewCol: event.target.value});
    }
    handleChangeIdListNewCol(event) {
        this.setState({idListNewCol: event.target.value});
    }
    puedeUsarIDLista(){
        this.state.colaboradores.forEach((value)=>{
            if(value.idLista === this.state.idListNewCol){
                console.log(value.idLista,this.state.idListNewCol);
                return true;
            }
        })
        return false  
    }
     
    agregarNuevoColaborador(){
        var puedeSerUnColaborador=true;
        var idListaLibre = true
        var internoExiste = false
        var nombreNuevoColaborador = null;
        // verificamos que no se repita codazulito ni número lista
        this.state.colaboradores.forEach((value)=>{            
            if(value.idLista === this.state.idListNewCol){
                idListaLibre = false;
                console.log("puedeSerUnColaborador", puedeSerUnColaborador);
            }            
            if(value.codAzulito === this.state.codAzulNewCol){                
                puedeSerUnColaborador = false;
                console.log("idListaLibre",idListaLibre);
            }            
        })
        // si el idLista no está entre 1 - 999 no se puede agregar
        var idListaEntero = parseInt(this.state.idListNewCol)
        if (isNaN(idListaEntero) || idListaEntero<=0 || idListaEntero>=1000){
            idListaLibre = false;
        }
        // verificamos que el interno exista 
        this.state.internos.forEach((value) => {     
            if(value.id === this.state.codAzulNewCol){
                internoExiste = true;
                nombreNuevoColaborador = value.nombres;
            }
        })

        if(puedeSerUnColaborador && idListaLibre && internoExiste){           
            fetchData.getData("http://" + this.props.dbCon.ip + ":2500",
                `/administracion/colaboradores/addColaborador?codAzulito=${this.state.codAzulNewCol}&idLista=${this.state.idListNewCol}`,
                rpta => {
                    console.log(rpta);
                }
            )
            
            var nuevoColaborador = Object.create(null)
                nuevoColaborador.codAzulito = this.state.codAzulNewCol                
                nuevoColaborador.nombres = nombreNuevoColaborador
                nuevoColaborador.idLista = this.state.idListNewCol

            var listaTempColaboradores = this.state.filteredColaboradores
                listaTempColaboradores.push(nuevoColaborador)
            
            // ordenando lista
            listaTempColaboradores.sort(function (a, b) {
                if (a.idLista > b.idLista) {
                    return 1;
                }
                if (a.idLista < b.idLista) {
                    return -1;
                }
                // a must be equal to b
                return 0;
                });
            
            
            this.setState({
                colaboradores: listaTempColaboradores,
                filteredColaboradores: listaTempColaboradores,
                mensajeAgregarColaborador:
                `El interno con ID ${this.state.codAzulNewCol}`+
                `fue agregado en la lista N ${this.state.idListNewCol}`
            })
        } else {
            var mensaje = 
                `${puedeSerUnColaborador?"":"ya es un colaborador"}`+
                `${idListaLibre?"":"ID de lista invalido"}`+
                `${internoExiste?"":"codigo ingresado no existe"}`

            this.setState({
                mensajeAgregarColaborador:mensaje
                })
        }
        this.setState({
            idListNewCol: '',
            codAzulNewCol:'',
            mostrarFormulario:false
        });
        
        // desaparecemos la venta emergente en 1.5 seg        
        const interval = setInterval(() => {
            this.setState({
                mostrarFormulario:true,
                ventanaEmergente : false
            })
            //this.mostrarOcultarVentanaEmergente()
            clearInterval(interval);
        }, 1500);
            //window.location.reload(true);

    }
    
    render() {        
        const content = this.state.loaded ? this.state.colaboradores : 'Loading...';
        if (typeof content !== "string") {
            const { navigate } = this.props;
            return (
                <>
                < Header navigate={navigate} moduleListasSelected={false} moduleHistoriaSelected={false} moduleManageSelected={true} moduleManageAudio={false} dbCon={this.props.dbCon} />               
               
                <ContendorTablaDiv>                            
                    <VentanaEmergente 
                        estado={this.state.ventanaEmergente}
                        cambiarEstado={this.mostrarOcultarVentanaEmergente}
                        titulo={"Agregar Colaborador"}
                        mostrarTitulo={false}
                    >   
                        {this.state.mostrarFormulario &&
                            <>                   
                                <Input type="text" placeholder="Codigo Azulito" 
                                    value={this.state.codAzulNewCol} onChange={this.handleChangeCodAzulNewCol}/> 
                                <Input type="text" placeholder="ID Lista" 
                                    value={this.state.idListNewCol} onChange={this.handleChangeIdListNewCol}/>                    
                                <Boton onClick={this.agregarNuevoColaborador}>Agregar</Boton>                                
                            </>
                        }
                        {!this.state.mostrarFormulario &&
                            <h5>
                                {this.state.mensajeAgregarColaborador}
                            </h5>
                        }


                    </VentanaEmergente>

                    {!this.state.ventanaEmergente && 
                    <>
                    <ContenedorBotones>
                        <Boton onClick={this.mostrarOcultarVentanaEmergente}>Agregar Colaborador</Boton>
                    </ContenedorBotones>                    
                    <AppTable 
                        datos={this.state.filteredColaboradores}
                        columnas={this.state.columnas} 
                    />
                    </>
                    }
                </ContendorTablaDiv>
                </>
            )
        } else {
            // Loading...
            return < LoadingPage />
        }
    }

}

const ContendorTablaDiv = styled.div`    
    width : 100vw;
    height : 100vh;
`;
const ContenedorBotones = styled.div`
	padding: 20px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20px;
`;

const Boton = styled.button`
	display: block;
	padding: 10px 30px;
	border-radius: 100px;
	color: #fff;
	border: none;
	background: #1766DC;
	cursor: pointer;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	transition: .3s ease all;
	&:hover {
		background: #0066FF;
	}
`;

const Input = styled.input`
  font-size: 18px;
  padding: 10px;
  margin: 10px;
  color: #fff;
  background: #1766DC;
  border: none;
  border-radius: 3px;
  ::placeholder {
    color: #A9A8A8;
  }
`;
