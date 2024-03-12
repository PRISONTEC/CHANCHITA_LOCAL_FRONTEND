import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Caratula from './components/caratula';
import CentralPenales from './components/centralPenales';
import Modules from './components/modules';
import Listas from './components/modules/listas';
import Recaudos from './components/modules/recaudos';
import Deudas from './components/modules/deudas';
import Header from './components/header'
//import ManagerChanchita  from './components/modules/manageChanchita';
import GreetingAudio from './components/modules/greetingAudio';

import AdminColaboradores from './components/modules/adminColaboradores';
//import ManagerChanchita  from './components/modules/manageChanchita';ManagerChanchita

//import ManagerChanchita  from './components/modules/manageChanchita';
import Dashboard from './components/modules/dashboard'

import MyContext from './components/MyContext';



function getBackEnd() {
  if (process.env.REACT_APP_ep) {
    if (process.env.REACT_APP_ep === "101") {
      return { ip: "192.168.150.5", hostname: "CAÑETE" }
    } else if (process.env.REACT_APP_ep === "102") {
      return { ip: "192.168.151.5", hostname: "HUARAL" }
    } else if (process.env.REACT_APP_ep === "103") {
      return { ip: "192.168.152.5", hostname: "CALLAO" }
    } else if (process.env.REACT_APP_ep === "104") {
      return { ip: "192.168.153.5", hostname: "ICA" }
    } else if (process.env.REACT_APP_ep === "105") {
      return { ip: "192.168.154.5", hostname: "CHINCHA" }
    } else if (process.env.REACT_APP_ep === "106") {
      return { ip: "192.168.155.5", hostname: "HUACHO" }
    } else if (process.env.REACT_APP_ep === "107") {
      return { ip: "192.168.156.5", hostname: "ANCON" }
    } else if (process.env.REACT_APP_ep === "108") {
      return { ip: "192.168.157.5", hostname: "CASTRO" }
    } else if (process.env.REACT_APP_ep === "110") {
      return { ip: "192.168.158.5", hostname: "LURIGANCHO" }
    } else if (process.env.REACT_APP_ep === "111") {
      return { ip: "192.168.159.5", hostname: "TRUJILLO" }
    } else if (process.env.REACT_APP_ep === "112") {
      return { ip: "192.168.160.5", hostname: "CHIMBOTE" }
    } else if (process.env.REACT_APP_ep === "113") {
      return { ip: "192.168.161.5", hostname: "HUARAZ" }
    } else if (process.env.REACT_APP_ep === "114") {
      return { ip: "192.168.162.5", hostname: "CHICLAYO" }
    } else if (process.env.REACT_APP_ep === "115") {
      return { ip: "192.168.163.5", hostname: "TUMBES" }
    } else if (process.env.REACT_APP_ep === "116") {
      return { ip: "192.168.164.5", hostname: "AYACUCHO" }
    } else if (process.env.REACT_APP_ep === "117") {
      return { ip: "192.168.165.5", hostname: "HUANCAYO" }
    } else if (process.env.REACT_APP_ep === "118") {
      return { ip: "192.168.166.5", hostname: "HUANUCO" }
    } else if (process.env.REACT_APP_ep === "119") {
      return { ip: "192.168.167.5", hostname: "CAJAMARCA" }
    } else if (process.env.REACT_APP_ep === "120") {
      return { ip: "192.168.168.5", hostname: "CHANCHAMAYO" }
    } else if (process.env.REACT_APP_ep === "121") {
      return { ip: "192.168.169.5", hostname: "CHORRILLOS" }
    } else if (process.env.REACT_APP_ep === "221") {
      return { ip: "192.168.169.253", hostname: "CHORRILLOSBACKUP" }
    } else if (process.env.REACT_APP_ep === "122") {
      return { ip: "192.168.170.5", hostname: "CUSCO" }
    } else if (process.env.REACT_APP_ep === "123") {
      return { ip: "192.168.171.5", hostname: "PTO. MALDONADO" }
    } else if (process.env.REACT_APP_ep === "124") {
      return { ip: "192.168.172.5", hostname: "TACNA" }
    } else if (process.env.REACT_APP_ep === "125") {
      return { ip: "192.168.173.5", hostname: "PUNO" }
    } else if (process.env.REACT_APP_ep === "126") {
      return { ip: "192.168.174.5", hostname: "JULIACA" }
    } else if (process.env.REACT_APP_ep === "127") {
      return { ip: "192.168.175.5", hostname: "TARAPOTO" }
    } else if (process.env.REACT_APP_ep === "128") {
      return { ip: "192.168.176.5", hostname: "MOYOBAMBA" }
    } else if (process.env.REACT_APP_ep === "129") {
      return { ip: "192.168.177.5", hostname: "CHACHAPOYAS" }
    }else {
      return { ip: "127.0.0.1", hostname: "SERVER LOCAL" }
    }
  } else {
    return { ip: "127.0.0.1", hostname: "SERVER LOCAL" }
  }
}


export default function App() {
  const navigate = useNavigate();
  const dbCon1 = getBackEnd();
  console.log(dbCon1)
  const sharedData = dbCon1;


  return (
    <>
      <MyContext.Provider value={sharedData}>
        <Routes>
          <Route path="/" element={<Caratula navigate={navigate} dbCon={getBackEnd()} />} />
          <Route path="/centralPenales" element={<CentralPenales navigate={navigate} dbCon={getBackEnd()} />} />
          <Route path="/centralPenales/dashboard" element={<Dashboard navigate={navigate} dbCon={getBackEnd()} />} />
          <Route path="/modules" element={<Modules navigate={navigate} dbCon={getBackEnd()} />} />
          <Route path="/modules/listas" element={<Listas navigate={navigate} moduleListasSelected={true} moduleHistoriaSelected={false} moduleManageSelected={false} moduleManageAudio={false} moduleDeudasItem={false} dbCon={getBackEnd()} />} />
          <Route path="/modules/recaudos" element={<Recaudos navigate={navigate} moduleListasSelected={false} moduleHistoriaSelected={true} moduleManageSelected={false} moduleManageAudio={false} moduleDeudasItem={false} dbCon={getBackEnd()} />} />
          <Route path="/modules/deudas" element={<Deudas navigate={navigate} moduleListasSelected={false} moduleHistoriaSelected={false} moduleManageSelected={false} moduleManageAudio={false} moduleDeudasItem={true} dbCon={getBackEnd()} />} />
          <Route path="/modules/colaboradores" element={<AdminColaboradores navigate={navigate} moduleListasSelected={false} moduleHistoriaSelected={false} moduleManageSelected={true} moduleManageAudio={false} moduleDeudasItem={false} dbCon={getBackEnd()} />} />
          <Route path="/modules/audios" element={<GreetingAudio navigate={navigate} moduleListasSelected={false} moduleHistoriaSelected={false} moduleManageSelected={false} moduleManageAudio={true} moduleDeudasItem={false} dbCon={getBackEnd()} />} />
        </Routes>
      </MyContext.Provider>
    </>
  )
} 