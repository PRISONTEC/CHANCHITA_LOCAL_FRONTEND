import React from "react";
import fetchData from "../../share/fetchData";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import "../../assets/css/form.css";
import "../../assets/css/table.css";
import LoadingPage from "../loading";
import Header from "../header";
import Chanchita from "../../assets/images/chanchita.png";
import ReactTooltip from "react-tooltip";
import Select from "@mui/material/Select";

export default class Listas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      colaboradores: [],
      colaboradoresFiltered: [],
      versiones: [{ version: "--" }],
      fechas: [{ fechaCierre: "--" }],
      listas: [{ idLista: "--" }],
      colaboradorSelected: null,
      listaSelected: null,
      dataPreRecargas: [],
      dataPreRecargasFiltered: [],
      recargasPagadas: [],
      estadosListas: ["abierta", "cerradaColaborador"],
    };

    this.handleChangeColaborador = this.handleChangeColaborador.bind(this);
    this.handleChangeVersion = this.handleChangeVersion.bind(this);
    this.handleChangeFecha = this.handleChangeFecha.bind(this);
    this.filterRecarga = this.filterRecarga.bind(this);
    this.showOpenedList = this.showOpenedList.bind(this);
    this.handleChangeEstado = this.handleChangeEstado.bind(this);
  }

  componentDidMount() {
    this.getColaboradores_listasAbiertas((data) => {
      this.setState({
        loaded: true,
        colaboradores: data[0],
        colaboradoresFiltered: data[0],
        listasAbiertas: data[1],
      });
    });
  }

  getColaboradores_listasAbiertas(callback) {
    fetchData.getData(
      "http://" + this.props.dbCon.ip + ":2500",
      "/colaboradores/getColaboradores",
      (data) => {
        callback(data);
      }
    );
  }

  getDataPorColaborador(colaborador, callback) {
    fetchData.getData(
      "http://" + this.props.dbCon.ip + ":2500",
      "/colaboradores/getDataColaborador?colaborador=" + colaborador,
      (data) => {
        callback(data);
      }
    );
  }

  getLista(lista, fechaCierre, callback) {
    fetchData.getData(
      "http://" + this.props.dbCon.ip + ":2500",
      "/listas/getLista?idLista=" + lista + "&fechaCierre=" + fechaCierre,
      (data) => {
        callback(data);
      }
    );
  }

  getVersionxFecha(fechaCierre, lista, callback) {
    fetchData.getData(
      "http://" + this.props.dbCon.ip + ":2500",
      "/versionxFecha/getVersionxFecha?fechaCierre=" +
        fechaCierre +
        "&idLista=" +
        lista,
      (data) => {
        callback(data);
      }
    );
  }

  handleChangeEstado(e) {
    if (e.target.value !== "header") {
      this.setState({
        colaboradoresFiltered: this.state.listasAbiertas.filter((value) => {
          return value.estadoLista === e.target.value;
        }),
        dataPreRecargas: [],
        dataPreRecargasFiltered: [],
        versiones: [{ version: "--" }],
        listas: [{ idLista: "--" }],
      });
    } else {
      this.setState({
        loaded: true,
        colaboradoresFiltered: this.state.colaboradoresFiltered,
        versiones: [{ version: "--" }],
        listas: [{ idLista: "--" }],
        dataPreRecargas: [],
        dataPreRecargasFiltered: [],
        recargasPagadas: [],
      });
    }
  }

  handleChangeColaborador(e) {
    if (e.target.value !== "header") {
      this.getDataPorColaborador(e.target.value, (data) => {
        data[0].unshift({ fechaCierre: "Mis fechas" });
        data[2].unshift({ version: "Mis versiones" });
        this.setState({
          loaded: true,
          colaboradoresFiltered: this.state.colaboradoresFiltered,
          versiones: data[2],
          fechas: data[0],
          listas: data[1],
          colaboradorSelected: e.target.value,
          listaSelected: data[1][0].idLista,
          dataPreRecargas: [],
          dataPreRecargasFiltered: [],
          recargasPagadas: [],
        });
      });
    } else {
      this.setState({
        loaded: true,
        colaboradoresFiltered: this.state.colaboradoresFiltered,
        versiones: [{ version: "--" }],
        fechas: [{ fechaCierre: "--" }],
        listas: [{ idLista: "--" }],
        dataPreRecargas: [],
        dataPreRecargasFiltered: [],
        recargasPagadas: [],
      });
    }

    const content = this.state.loaded ? this.state.versiones : "Loading...";
    if (typeof content === "string") {
      // Loading...
      return <LoadingPage />;
    }

    const content1 = this.state.loaded ? this.state.fechas : "Loading...";
    if (typeof content1 === "string") {
      // Loading...
      return <LoadingPage />;
    }
  }

  handleChangeFecha(e) {
    if (e.target.value !== "Mis fechas") {
      this.getVersionxFecha(
        e.target.value,
        this.state.listaSelected,
        (data) => {
          data[1].unshift({ version: "Mis versiones" });
          this.setState({
            versiones: data[1],
          });
        }
      );
    } else {
      this.setState({
        loaded: true,
        versiones: [{ version: "--" }],
        fechas: [{ fechaCierre: "--" }],
      });
    }
  }

  handleChangeVersion(e) {
    if (e.target.value !== "Mis Versiones") {
      this.getLista(
        this.state.listaSelected,
        parseInt(e.target.value),
        (data) => {
          this.setState({
            loaded: true,
            dataPreRecargas: data[0],
            dataPreRecargasFiltered: data[0],
            recargasPagadas: data[0].filter((value) => {
              return value.pago === 1;
            }),
          });
        }
      );
    } else {
      this.setState({
        dataPreRecargas: [],
        dataPreRecargasFiltered: [],
        recargasPagadas: [],
      });
    }
  }

  filterRecarga(e) {
    this.setState({
      dataPreRecargasFiltered: this.state.dataPreRecargas.filter((el) => {
        return el.codAzulito.includes(e.target.value);
      }),
    });
  }

  calcularMontoRecargas() {
    let recargasPagadasMonto = this.state.recargasPagadas.map((value) => {
      return value.monto;
    });
    let montoT = 0;
    for (let value of recargasPagadasMonto) {
      montoT += value;
    }

    return montoT;
  }

  showOpenedList() {
    if (this.state.listasAbiertas.length > 0) {
      return (
        <p>
          Chanchitas pendientes por cobrar:
          <ul>
            {this.state.listasAbiertas.map((value, key) => {
              return (
                <li key={key}>
                  {" "}
                  Colaborador: {value.codAzulito} - Lista: {value.idLista} -
                  Version: {value.version} - Estado: {value.estadoLista}
                </li>
              );
            })}
          </ul>
        </p>
      );
    } else {
      return <p> No hay listas abiertas</p>;
    }
  }

  listaPage(data) {
    const { navigate, moduleListasSelected, moduleHistoriaSelected } =
      this.props;
    return (
      <div className="divListas">
        <Header
          navigate={navigate}
          moduleListasSelected={moduleListasSelected}
          moduleHistoriaSelected={moduleHistoriaSelected}
          dbCon={this.props.dbCon}
        />
        <img
          data-tip
          data-for="recargasPendientes"
          src={Chanchita}
          alt="chanchita"
          onMouseOver={this.showOpenedList}
          className="moduleChanchita"
        ></img>
        <ReactTooltip id="recargasPendientes" place="bottom" effect="float">
          {this.showOpenedList()}
        </ReactTooltip>

        <Form.Group className="control">
          <Form.Label className="label">Colaboradores</Form.Label>
          <Form.Select
            className="select"
            onChange={this.handleChangeColaborador}
          >
            <option value={"header"} key={"header"}>
              {" "}
              --Seleccionar un colaborador--{" "}
            </option>
            {data.map((colaborador) => (
              <option key={colaborador.colaborador}>
                {colaborador.codAzulito}
              </option>
            ))}
          </Form.Select>

          <Form.Label className="label2">Lista</Form.Label>
          <Form.Select className="select2">
            <option>{this.state.listas[0].idLista}</option>
          </Form.Select>

          <Form.Label className="label3">Fechas</Form.Label>
          <Form.Select className="select3" onChange={this.handleChangeFecha}>
            {this.state.fechas.map((fecha) => (
              <option key={fecha.fechaCierre}>{fecha.fechaCierre}</option>
            ))}
          </Form.Select>

          <Form.Label className="label4">Versiones</Form.Label>
          <Form.Select className="select4" onChange={this.handleChangeVersion}>
            {this.state.versiones.map((version) => (
              <option
                style={{
                  background:
                    version.estadoLista === "abierta"
                      ? "#80F57E"
                      : version.estadoLista === "cerradaColaborador"
                      ? "#C9D9F3"
                      : "red",
                }}
                key={version.version}
              >
                {version.version}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Table className="paleBlueRows">
          <thead>
            <tr>
              <th className="header-label">Correlativo</th>
              <th className="header-label">Estado Lista</th>
              <th className="header-label">Azulito</th>
              <th className="header-label">Cierre Colaborador</th>
              <th className="header-label">Cierre Azulito</th>
              <th className="header-label">Hora Recarga</th>
              <th className="header-label">Monto Recarga</th>
              <th className="header-label">Pagó?</th>
            </tr>
            <tr className="tr-inputs">
              <th>
                <div>
                  <input type="int" disabled />
                </div>
              </th>
              <th>
                <div>
                  <input type="string" disabled />
                </div>
              </th>
              <th>
                <div>
                  <input type="string" onChange={this.filterRecarga} />
                </div>
              </th>
              <th>
                <div>
                  <input type="string" disabled />
                </div>
              </th>
              <th>
                <div>
                  <input type="string" disabled />
                </div>
              </th>
              <th>
                <div>
                  <input type="string" disabled />
                </div>
              </th>
              <th>
                <div>
                  <input
                    type="int"
                    disabled
                    value={this.calcularMontoRecargas()}
                  />
                </div>
              </th>
              <th>
                <div>
                  <input type="boolean" disabled />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.dataPreRecargasFiltered.map((value, key) => (
              <tr key={key}>
                <td>{value.correlativo}</td>
                <td>{value.estadoLista}</td>
                <td>{value.codAzulito}</td>
                <td>{value.fechaCierreColaborador}</td>
                <td>{value.fechaCierreAzulito}</td>
                <td>{value.fechaLista}</td>
                <td>{value.monto}</td>
                <td>{value.pago}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  render() {
    const content = this.state.loaded
      ? this.state.colaboradoresFiltered
      : "Loading...";

    if (typeof content !== "string") {
      return this.listaPage(content);
    } else {
      // Loading...
      return <LoadingPage />;
    }
  }
}
