//import useState hook to create menu collapse state
import React, { useEffect } from "react";
import { Chanchita, Recaudos, Herramientas } from "./myIcons";
import PaymentsIcon from "@mui/icons-material/Payments";
import DownloadIcon from "@mui/icons-material/Download";
import fetchData from "../share/fetchData";
import { ExportToCsv } from "export-to-csv";
import { useContext } from "react";
import MyContext from "./MyContext";

//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
  SubMenu,
} from "react-pro-sidebar";

//import icons from react icons
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";

//import sidebar css from react-pro-sidebar module and our custom css
import "react-pro-sidebar/dist/css/styles.css";
import "../assets/css/header.css";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { menuCollapse: true };
    this.menuIconClick = this.menuIconClick.bind(this);
  }

  //create a custom function that will change menucollapse state from false to true and true to false
  menuIconClick() {
    //condition checking to change state from true to false and vice versa
    this.state.menuCollapse
      ? this.setState({ menuCollapse: false })
      : this.setState({ menuCollapse: true });
  }

  render() {
    const csvOptions = {
      fieldSeparator: ",",
      quoteStrings: "'",
      decimalSeparator: ".",
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: ["Cod Azulito", "Nombres y Apellidos", "Ultima Llamada"],
    };

    const csvExporter = new ExportToCsv(csvOptions);

    const {
      navigate,
      moduleListasSelected,
      moduleHistoriaSelected,
      moduleDeudasItem,
      moduleManageSelected,
      moduleManageAudio,
      modulePope,
      dbCon
    } = this.props;

    const handleClick0 = () => {
      navigate("/");
    };

    const handleClick = () => {
      navigate("/modules/listas");
    };

    const handleClick2 = () => {
      navigate("/modules/recaudos");
    };

    const handleClick3 = () => {
      navigate("/modules/deudas");
    };

    const handleClick4 = () => {
      navigate("/modules/colaboradores");
    };

    const handleClick5 = () => {
      navigate("/modules/audios");
    };
    

    const handleClick6 = () => {
      console.log('llega el PROPS',this.props.dbCon.ip)
      const getPoblacion = async () => {
        const rptaBckEn = await fetchData.getDataPromise(
          "http://" + this.props.dbCon.ip + ":2500",
          "/poblacionInternos/poblacionInternos?ep=" + process.env.REACT_APP_ep, 1000
        );
        const misInternos = await rptaBckEn.json();
        csvExporter.generateCsv(misInternos);
      };
      getPoblacion();
    };

    /* const sharedData = useContext(MyContext);
  console.log('AQUIIIIIIIIIIIIIII', sharedData) */
    
    return (
      <>
        <div id="header" className="cabecera">
          {/* collapsed props to change menu size using menucollapse state */}
          <ProSidebar collapsed={this.state.menuCollapse}>
            <SidebarHeader>
              <div className="logotext">
                {/* small and big change using menucollapse state */}
                <p onClick={handleClick0}>
                  {this.state.menuCollapse ? "PST" : "PRISONTEC"}
                </p>
              </div>
              <div className="closemenu" onClick={this.menuIconClick}>
                {/* changing menu collapse icon on click */}
                {this.state.menuCollapse ? (
                  <FiArrowRightCircle />
                ) : (
                  <FiArrowLeftCircle />
                )}
              </div>
            </SidebarHeader>
            <SidebarContent>
              <Menu iconShape="circle">
                <MenuItem
                  active={moduleListasSelected}
                  icon={<Chanchita />}
                  onClick={handleClick}
                >
                  Chanchita
                </MenuItem>
                <MenuItem
                  active={moduleHistoriaSelected}
                  icon={<Recaudos />}
                  onClick={handleClick2}
                >
                  Recaudos
                </MenuItem>
                <MenuItem
                  active={moduleDeudasItem}
                  icon={<PaymentsIcon />}
                  onClick={handleClick3}
                >
                  Deudas
                </MenuItem>
                {/*<MenuItem active={moduleManageSelected} icon= {<  Herramientas />} onClick= {handleClick4} >
                      Herramientas
                    </MenuItem>*/}

                <SubMenu
                  prefix={<span className="badge yellow">2</span>}
                  icon={<Herramientas />}
                  title="Administración"
                >
                  <MenuItem
                    active={moduleManageSelected}
                    onClick={handleClick4}
                  >
                    Colaboradores
                  </MenuItem>
                  <MenuItem active={moduleManageAudio} onClick={handleClick5}>
                    Audios
                  </MenuItem>
                </SubMenu>

                <MenuItem
                  active={modulePope}
                  icon={<DownloadIcon />}
                  onClick={handleClick6}
                >
                  Poblacion Penitenciaria
                </MenuItem>
              </Menu>
            </SidebarContent>
          </ProSidebar>
        </div>
      </>
    );
  }
}
