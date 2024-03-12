import React from 'react';
import fetchData from '../../share/fetchData'
import Header from "../header";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import '../../assets/css/table.css';
import '../../assets/css/form.css';
import "../../assets/css/App.css";
import LoadingPage from '../loading';
import RecaudosImg from "../../assets/images/recaudos.png"
import DownloadImg from "../../assets/images/download.png"
import ReactTooltip from 'react-tooltip';


export default class Recaudos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            listas: [{ idLista: "--" }],
            dataConsulta: [],
            colaboradores: [],
            dataListas: [],
            dataListasFiltered: [],
            montoListasTotal: 0
        };

        this.handleChangeColaborador = this.handleChangeColaborador.bind(this);
        this.filterListasFecha = this.filterListasFecha.bind(this);
        this.downloadRecargas = this.downloadRecargas.bind(this);
    }

    getHistoriaListas(callback) {
        fetchData.getData("http://" + this.props.dbCon.ip + ":2500",
            "/listas/getHistoriaListas",
            ((data) => {
                callback(data)
            })
        )
    }

    componentDidMount() {
        this.getHistoriaListas((data) => {
            this.setState({
                loaded: true,
                dataConsulta: data[0],
                dataConsultaTotalRecargas: data[1],
                dataColaborador: this.getColaboradores(data[0])
            })
        })
    } 

    handleChangeColaborador(e) {
        if (e.target.value !== "header") {
            let listasColaborador = [];
            listasColaborador =
                this.state.dataConsulta.filter((value) => {
                    return value.codAzulito === e.target.value
                })

            let montosListas =
                listasColaborador.map((value) => {
                    return value.montoLista
                })

            let montoTotalListas = 0;
            for (let monto of montosListas) {
                montoTotalListas += monto
            }

            this.setState({
                dataListas: listasColaborador,
                dataListasFiltered: listasColaborador,
                montoListasTotal: montoTotalListas
            })
        } else {
            this.setState({
                colaboradores: this.state.colaboradores,
                dataListas: [],
                dataListasFiltered: [],
                montoListasTotal: 0
            })
        }
    }

    getColaboradores(dataConsulta) {
        let tmp =
            dataConsulta.map((value) => {
                return value.codAzulito
            })
        const colaboradoresAux = [...new Set(tmp)]
        this.setState({
            colaboradores: colaboradoresAux
        })
    }

    filterListasFecha(e) {
        this.setState({
            loaded: false
        })

        const d1 = new Date(e.target.value).getTime() + (5 * 3600000)
        if (!isNaN(d1)) {
            let listaColaboradorFilteres = []
            listaColaboradorFilteres =
                this.state.dataListas.filter((value) => {
                    const d2 = new Date(value.fechaHoraCierre.substr(0, 10)).getTime() + (5 * 3600000)
                    return d2 === d1;
                })

            let montosListas =
                listaColaboradorFilteres.map((value) => {
                    return value.montoLista
                })

            let montoTotalListas = 0;
            for (let monto of montosListas) {
                montoTotalListas += monto
            }

            this.setState({
                loaded: true,
                dataListasFiltered: listaColaboradorFilteres,
                montoListasTotal: montoTotalListas
            })
        } else {
            let montosListas =
                this.state.dataListas.map((value) => {
                    return value.montoLista
                })

            let montoTotalListas = 0;
            for (let monto of montosListas) {
                montoTotalListas += monto
            }

            this.setState({
                loaded: true,
                dataListasFiltered: this.state.dataListas,
                montoListasTotal: montoTotalListas
            })

        }
    }

    downloadRecargas(e, parametros) {

        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);
        const title = "Chanchita Lista " + parametros.idLista + " Versión " + parametros.version;
        const headers = [["Lista", "Version", "Correlativo", "Estado Lista", "Codigo Azulito", "Cierre Colaborador", "Cierre Azulito", "Hora Recarga", "monto", "Pagó?"]];

        const dataPDFtmp = this.state.dataConsultaTotalRecargas.filter(value => {
            return ((value.idLista === parametros.idLista) && (value.version === parametros.version))
        });

        const dataPDF = dataPDFtmp.map(value => {
            return [value.idLista, value.version, value.correlativo, value.estadoLista, value.codAzulito, value.fechaHoraCC,
            value.fechaHoraCA, value.fechaHora, value.monto, value.pago]
        })

        console.log(dataPDF)

        let content = {
            startY: 50,
            head: headers,
            body: dataPDF
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Chanchita_" + parametros.idLista + "_" + parametros.version + ".pdf")
    }

    showMoneyOfDay() {
        let montoPorColaborador = new Object();
        let coloboradorPorLista = new Object();
        let colaboradorMonto = new Object();
        const timeAtMoment = new Date()
        const dateAtYear = timeAtMoment.getFullYear()
        const monthAtMoment = timeAtMoment.getMonth()
        const dateAtMoment = timeAtMoment.getDate()

        const dateAt00AtMoment = new Date(dateAtYear, monthAtMoment, dateAtMoment).getTime()

        const listOfMoneyOfDayObject =
            this.state.dataConsultaTotalRecargas.filter((value) => {
                return (value.fechaHoraCAE >= dateAt00AtMoment && value.pago === 1)
            })

        const listOfMoneyOfDay =
            listOfMoneyOfDayObject.map(value => {
                return value.monto
            })

        this.state.dataConsulta.map(value => {
            if (!coloboradorPorLista[value.idLista]) {
                let colaboradorLista = value.idLista;
                coloboradorPorLista[colaboradorLista] = value.codAzulito;
            }
        })

        listOfMoneyOfDayObject.map(value => {
            if (montoPorColaborador[value.idLista]) {
                montoPorColaborador[value.idLista] += value.monto;
            } else {
                montoPorColaborador[value.idLista] = value.monto;
            }
        })


        for (const key in coloboradorPorLista) {
            if (coloboradorPorLista.hasOwnProperty(key) && montoPorColaborador.hasOwnProperty(key)) {
                colaboradorMonto[coloboradorPorLista[key]] = montoPorColaborador[key];
            }
        }


        let moneyOfDay = 0
        for (let money of listOfMoneyOfDay) {
            moneyOfDay += money
        }

        return (
            <div>
                <h2 style={{fontWeight: "bold",fontSize:"18px"}}>Monto chanchita de hoy: {moneyOfDay}</h2>
                <h3 style={{fontWeight: "bold",textDecoration:"underline",fontSize:"15px"}}>Monto por colaborador</h3>
                {Object.entries(colaboradorMonto)
                    .map(([colaborador, monto]) =><h4 style={{fontSize:"12px"}}>{`${colaborador} : ${monto}`}</h4>)
  }
                
            </div>

        )
    }

    render() {
        const content = this.state.loaded ? this.state.colaboradores : 'Loading...';
        if (typeof content !== "string") {
            const { navigate, moduleListasSelected, moduleHistoriaSelected } = this.props;
            return (
                <div>
                    < Header navigate={navigate} moduleListasSelected={moduleListasSelected} moduleHistoriaSelected={moduleHistoriaSelected} dbCon={this.props.dbCon} />
                    <img data-tip data-for="showMoneyDay" src={RecaudosImg} alt="recaudos" onMouseOver={this.showOpenedList} className="moduleRecaudos"></img>
                    <ReactTooltip id="showMoneyDay" place="bottom" effect="float">
                        {this.showMoneyOfDay()}
                    </ReactTooltip>

                    <Form.Group className="control">
                        <Form.Label className='label'>Colaboradores</Form.Label>
                        <Form.Select className='select' onChange={this.handleChangeColaborador}>
                            <option value={"header"}> --Seleccionar un colaborador-- </option>
                            {this.state.colaboradores.map((colaborador) => <option key={colaborador}>{colaborador}</option>)}
                        </Form.Select>
                    </Form.Group>

                    <Table className="paleBlueRowsCentered">
                        <thead>
                            <tr>
                                <th className="header-label">Lista</th>
                                <th className="header-label">version</th>
                                <th className="header-label">Monto Lista</th>
                                <th className="header-label">Colaborador</th>
                                <th className="header-label">Fecha Cierre</th>
                                <th className="header-label">Download</th>
                            </tr>
                            <tr className="tr-inputs">
                                <th>
                                    <div><input type="int" disabled /></div>
                                </th>
                                <th>
                                    <div><input type="string" disabled /></div>
                                </th>
                                <th>
                                    <div><input type="string" value={this.state.montoListasTotal} disabled /></div>
                                </th>
                                <th>
                                    <div><input type="string" disabled /></div>
                                </th>
                                <th>
                                    <div><input type="date" onChange={this.filterListasFecha} /></div>
                                </th>
                                <th>
                                    <div><input type="string" disabled /></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dataListasFiltered.map((value, key) =>
                                <tr key={key}>
                                    <td>{value.idLista}</td>
                                    <td>{value.version}</td>
                                    <td>{value.montoLista}</td>
                                    <td>{value.codAzulito}</td>
                                    <td>{value.fechaHoraCierre}</td>
                                    <td><img src={DownloadImg} alt="downloadImg" className="downloadImg"
                                        onClick={event => { this.downloadRecargas(event, value) }} /></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )
        } else {
            // Loading...
            return < LoadingPage />
        }
    }
}