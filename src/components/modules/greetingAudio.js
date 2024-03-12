import React from "react";
import Header from "../header";
import fetchData from "../../share/fetchData";
import LoadingPage from "../loading";
import trash from "../../assets/images/trash.png";
import "../../assets/css/manageModules.css";
import "../../assets/css/table.css";
import AppTable from "./tabla_react";
import PlayAudio from "react-simple-audio-player";
import VentanaEmergente from "./ventanaEmergente";


export default class ManagerChanchita extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      greetings: [],
      filteredGreetings: [],
      ventanaEmergente: false,
      columnas: [
        {
          Header: "Interno",
          accessor: "codigoAzulito",
          maxWidth: 110,
          minWidth: 110,
          width: 110,
        },
        {
          Header: "Nombre",
          accessor: "nombres",
          maxWidth: 110,
          minWidth: 110,
          width: 110,
        },
        {
          Header: "Audio Grabacion",
          maxWidth: 110,
          minWidth: 110,
          width: 110,
          Cell: ({ cell }) => (
            <PlayAudio
              width="20px"
              url={`/greetingsChanchita/${cell.row.values.codigoAzulito}.wav`}
            />
          ),
        },

        {
          maxWidth: 70,
          minWidth: 70,
          width: 70,
          Header: "Eliminar Grabacion",
          //value={cell.row.values.name}
          Cell: ({ cell }) => (
            <button
              onClick={async (e) =>
                await this.deleteGreeting(e, cell.row.values.codigoAzulito)
              }
            >
              <img src={trash} alt="logo" className="trashImg" />
            </button>
          ),
        },
      ],
    };
    this.cargarGreetings = this.cargarGreetings.bind(this);
    this.filterAzulitos = this.filterAzulitos.bind(this);
    this.mostrarOcultarVentanaEmergente =
      this.mostrarOcultarVentanaEmergente.bind(this);
  }

  componentDidMount() {
    this.cargarGreetings((data) => {
      this.setState({
        loaded: true,
        greetings: data[0],
        filteredGreetings: data[0],
      });
    });
  }

  cargarGreetings(callback) {
    fetchData.getData(
      "http://" + this.props.dbCon.ip + ":2500",
      "/administracion/greetings/listGreeting",
      callback
    );
  }

  filterAzulitos(e) {
    this.setState({
      filteredGreetings: this.state.greetings.filter((value) => {
        return value.codigoAzulito.includes(e.target.value);
      }),
    });
  }

  async deleteGreeting(evt, deletedData) {
    this.setState({ ventanaEmergente: true });
    console.log("deletedData", deletedData);
    const greetFilterAfterDelete = this.state.greetings.filter((value, key) => {
      return deletedData !== value.codigoAzulito;
    });

    this.setState({
      greetings: greetFilterAfterDelete,
      filteredGreetings: greetFilterAfterDelete,
    });

    fetchData.deleteData(
      "http://" + this.props.dbCon.ip + ":2500",
      "/administracion/greetings/deleteGreeting?deleteAzulito=" + deletedData,
      (rpta) => {
        console.log(rpta);
      }
    );
    const interval = setInterval(() => {
      this.mostrarOcultarVentanaEmergente();
      this.setState({ mostrarFormulario: true });
      clearInterval(interval);
    }, 1500);
  }

  mostrarOcultarVentanaEmergente() {
    this.setState({ ventanaEmergente: !this.state.ventanaEmergente });
  }

  render() {
    const content = this.state.loaded ? this.state.colaboradores : "Loading...";
    if (typeof content !== "string") {
      const { navigate } = this.props;
      return (
        <>
          <Header
            navigate={navigate}
            moduleListasSelected={false}
            moduleHistoriaSelected={false}
            moduleManageSelected={false}
            moduleManageAudio={true}
            dbCon={this.props.dbCon}
          />
          <VentanaEmergente
            estado={this.state.ventanaEmergente}
            cambiarEstado={this.mostrarOcultarVentanaEmergente}
            titulo={"Agregar Colaborador"}
            mostrarTitulo={false}
          >
            <h1>Interno eliminado</h1>
          </VentanaEmergente>

          <AppTable
            datos={this.state.filteredGreetings}
            columnas={this.state.columnas}
          />
        </>
      );
    } else {
      // Loading...

      return <LoadingPage />;
    }
  }
}


