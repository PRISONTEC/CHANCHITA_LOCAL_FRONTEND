import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocation } from 'react-router-dom';
import Button from "@mui/material/Button";
import PieChartP from './modules.dashboard/pieChart';
import Header from './modules.dashboard/headerDashboard';
import ComposeContainer from './modules.dashboard/composeContainer';

function getDataFromPie(data) {
    let dataToshow =
      data.map((el) => {
        const sumTmp = el.data.map(list => {
          return parseInt(list.montoLista)
        }).reduce((ini,fin) => (ini + fin), 0)
        return {name: el.penalName, value: sumTmp}
      })
    
    return dataToshow
}

function getDataFromComposeContainer(data1, data2) {
  let dataToshow =
    data1.map((el) => {
      const sumTmp = el.data.map(list => {
        return parseInt(list.montoLista)
      }).reduce((ini,fin) => (ini + fin), 0)
      return {name: el.penalName, montoT: sumTmp}
    })

  let recarPagadas = 
    data2.map((el) => {
      const recargasP = el.data.filter(el => 
        el.pago !== 0
      ).length
      return {name: el.penalName, cantRecargasPag: recargasP}
    })
  
  for (let i in recarPagadas) {
    dataToshow[i].cantRecargasPag = recarPagadas[i].cantRecargasPag
  }

  return (dataToshow)
}

function getLast3Months() {
  const mesesAux = {1:"Enero", 2:"Febrero", 3:"Marzo", 4:"Abril", 
    5:"Mayo", 6:"Junio", 7:"Julio", 8:"Agosto", 
    9:"Setiembre", 10:"Octubre", 11:"Noviembre", 12:"Diciembre"};
  const epoch = Date.now()
  const date = new Date(epoch);
  const idMonth = date.getMonth();
  let meses = [];
  for(let i=(idMonth-3); i<=idMonth; i++) {
    let a=i
    a=a+1
    meses.push(mesesAux[a])
  }
  
  return meses;
}

export default function dashboard(props) {

    const navigate = props.navigate;

    const {state} = useLocation();
    const historiaDetalleListas = state.historiaDetalleListas
    const historiaGeneralListas = state.historiaGeneralListas

    const [historiaDetalleListasTmp, setVar1] = useState(historiaDetalleListas)    
    const [historiaGeneralListasTmp, setVar2] = useState(historiaGeneralListas)
    const [month, setVar3] = useState(-1)

    const [acumulado, setAcumulado] = useState(1)
    const [porMeses, setPorMeses] = useState(0)
    const [monthSelected, setMonth] = useState(-1)
    
    useEffect(() => {
      setVar1( a => historiaDetalleListas.map(el => {
        const dataTmp = el.data.filter(al => al.fechaHoraE <= Date.now() - month*30*86400000)
        return {penalName: el.penalName, penalPrefix: el.penalPrefix, data: dataTmp}
      }))

      setVar2( a => historiaGeneralListas.map(el => {
        const dataTmp = el.data.filter(al => new Date(al.fechaHoraCierre).valueOf() <= Date.now() - month*30*86400000)
        return {penalName: el.penalName, penalPrefix: el.penalPrefix, data: dataTmp}
      }))

    }, [month])

    useEffect(() => {
      const mesesAux = {"Enero":0, "Febrero":1, "Marzo":2, "Abril":3, 
        "Mayo":4, "Junio":5, "Julio":6, "Agosto":7, 
        "Setiembre":8, "Octubre":9, "Noviembre":10, "Diciembre":11 };

      setVar1( a => historiaDetalleListas.map(el => {
        const dataTmp = el.data.filter(al => 
          (new Date(al.fechaHoraE).getMonth()) === mesesAux[monthSelected])
        return {penalName: el.penalName, penalPrefix: el.penalPrefix, data: dataTmp}
      }))

      setVar2( a => historiaGeneralListas.map(el => {
        const dataTmp = el.data.filter(al => 
          (new Date(al.fechaHoraCierre).getMonth()) === mesesAux[monthSelected])
        return {penalName: el.penalName, penalPrefix: el.penalPrefix, data: dataTmp}
      }))
       
    }, [monthSelected])

    return (
      <>
      <Header navigateAtt={navigate}/>
      <View style={styles.rowCentered}> 
      <Button color="inherit" variant="contained" 
        onClick={() => {
          setAcumulado(acumulado => acumulado = 1)
          setPorMeses(porMeses => porMeses = 0)
          }}>
          ACUMULADO
      </Button>
      <Button color="inherit" variant="contained" 
        onClick={() => {
          setAcumulado(acumulado => acumulado = 0)
          setPorMeses(porMeses => porMeses = 1)
          }}>
        MESES
      </Button>
      </View>
      
      {
        acumulado === 1 &&
          <View style={styles.row}>
            <Button color="inherit" variant="contained" onClick={() => {setVar3(monthT => monthT = 2)}}>HACE 2 MES</Button>
            <Button color="inherit" variant="contained" onClick={() => {setVar3(monthT => monthT = 1)}}>HACE 1 MES</Button>
            <Button color="inherit" variant="contained" onClick={() => {setVar3(monthT => monthT = 0)}}>HASTA AHORA</Button>
          </View>
      }
      {
        porMeses === 1 && 
        <View style={styles.row}>
          {getLast3Months().map((mes) => (
              <Button color="inherit" variant="contained" onClick={() => {setMonth(monthSelected => monthSelected=mes)}}> 
                {mes}
              </Button> 
          ))}
        </View>    
      }
      <View style={styles.row}>
        <PieChartP 
          stylesPie = {stylesPieChart}
          data = {getDataFromPie(historiaGeneralListasTmp)} 
          definedLabel = {"MontoTotal: "} 
          widthContainer = {600}
          heightContainer = {350}
          horiPostInsideContainer = {300}
          vertPostInsideContainer = {150}
        />

        <ComposeContainer 
          stylesComposeContainer = {stylesComposeContainer}
          data = {getDataFromComposeContainer(historiaGeneralListasTmp, historiaDetalleListasTmp)}
          title = {"Monto vs Cantidad"}
          dataKeyAxis = {"name"}
          dataKeyBar = {"montoT"}
          dataKeyCurve = {"cantRecargasPag"}
          widthContainer = {"30%"}
          heightContainer = {350}
          width = {300}
          height = {100}
          top = {20}
          right = {20}
          bottom = {30}
          left = {20}
          barSize = {20}
        />
      </View>
      </>
    )
}

const stylesPieChart = StyleSheet.create({
  container: {
    width: 600,
    height: 400,
    shadowOffset: {width: 4, height: 5},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
  }, 
  title: {
    paddingLeft: "140px",
    fontSize: 30
  }
});

const stylesComposeContainer = StyleSheet.create({
  container: {
    width: 600,
    height: 400,
    paddingBottom: "20px",
    shadowOffset: {width: 4, height: 5},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
  }, 
  title: {
    paddingLeft: "180px",
    paddingBottom: "40px",
    fontSize: 30
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    paddingTop: "50px",
    paddingLeft: "50px",
    paddingRight: "50px",
    justifyContent: 'space-between',
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rowCentered: {
    paddingTop: "50px",
    paddingLeft: "50px",
    paddingRight: "50px",
    justifyContent: 'space-around',
    flexDirection: "row",
    flexWrap: "wrap"
  },
  title: {
    fontSize: 10
  }
});