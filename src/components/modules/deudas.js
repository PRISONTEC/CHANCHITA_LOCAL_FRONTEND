import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ExportToCsv } from "export-to-csv";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DownloadIcon from "@mui/icons-material/Download";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import fetchData from "../../share/fetchData";
import Header from "../header";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Deudas = (props) => {
  //console.log(process.env.REACT_APP_ep),
  const [rows, setRows] = useState([]);
  const [deudaTotal, setDeudaTotal] = useState(0);
  const [rowsTmp, setRowsTmp] = useState([]);
  const [deudasInternos, setDeudasInternos] = useState([]);
  const [fecha, setFecha] = React.useState("");
  const [deudasFinales, setDeudasFinales] = useState([]);
  const [fechasAgrupadas, setFechasAgrupadas] = useState([]);
  const [nuevosValores, setNuevosValores] = useState([]);
  const [saldoxFecha, setSaldoxFecha] = useState("");

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ["Cod Azulito	", "Deuda"],
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const sumarDeuda = (deudas) => {
    return deudas.reduce((partialSum, a) => partialSum + a.ultimoCambio, 0);
  };


  useEffect(() => {
    const deudas = async () => {
      //process.env.REACT_APP_ep
      // const rptaBckEn = await fetchData.getDataPromise("http://" + props.dbCon.ip + ":2500", "/deudas/getDeuda?ep="+ process.env.REACT_APP_ep, 10000)
      const rptaBckEn = await fetchData.getDataPromise(
        "http://" + props.dbCon.ip + ":2500",
        "/deudas/getDeuda?ep=" + process.env.REACT_APP_ep,
        10000
      );
      const misDeudores = await rptaBckEn.json();

      setDeudasInternos(misDeudores[0].datos);
      console.log(misDeudores[0]);
      //setDeudaTotal(sumarDeuda(misDeudores[0].datos));
      setRowsTmp(misDeudores[0].datos);
      setRows(misDeudores[0].datos);
    };
    deudas();
  }, []);

  // ENCONTRAR EL SALDO QUE DEBE DESDE EL ÚLTIMO PAGO QUE REALIZÓ O DESDE QUE INICIÓ SU DEUDA(DEPENDIENDO EL CASO

  useEffect(() => {
    if (deudasInternos) {
      //setDeudaTotal(sumarDeuda(deudasInternos));
      //RECORREMOS EL ARRAY PRINCIPAL
      for (let obj of deudasInternos) {
        const saldosNegativos = obj.saldosNegativos;
        let ultimoCambio = null;
        let ultimaFecha = null;

        //RECORREMOS EL ARRAY SALDOS NEGATIVO DENTRO DEL ARRAY PRINCIPAL
        for (let i = 1; i < saldosNegativos.length; i++) {
          const saldoActual = saldosNegativos[i].saldo;
          const prevSaldo = saldosNegativos[i - 1].saldo;
          const cambiodeFecha = saldosNegativos[i].fecha;

          //VERIFICANDO SI HAY ALGUN CAMBIO EN EL SALDO
          if (saldoActual !== prevSaldo) {
            ultimoCambio = saldoActual;
            const date = new Date(0);
            date.setUTCSeconds(cambiodeFecha);
            ultimaFecha = date.toLocaleDateString();
          }
        }

        //SI NO HAY CAMBIO, SE ASUME EL PRIMER VALOR DEL ARRAY DE SALDO NEGATIVO
        if (ultimoCambio === null && saldosNegativos.length > 0) {
          ultimoCambio = saldosNegativos[0].saldo;
          ultimaFecha = saldosNegativos[0].fecha;
          const date = new Date(0);
          date.setUTCSeconds(ultimaFecha);
          ultimaFecha = date.toLocaleDateString();
        }

        //INTRODUCIENDO DATA AL ARREGLO
        deudasFinales.push({
          id: obj.id,
          nombres: obj.nombres,
          ultimoCambio: ultimoCambio,
          ultimaFecha: ultimaFecha,
        });
      }
      setDeudasFinales(deudasFinales);
      setDeudaTotal(sumarDeuda(deudasFinales));
      setRowsTmp(deudasFinales);
      setRows(deudasFinales);
    } else {
      console.log("NO HAY DEUDAS");
    }

    //SACANDO FECHAS IDÉNTICAS
    if (deudasFinales.length > 0) {
      const nuevasFechas = [];
      let ultimaFecha = "";
      let id = "";
      let nombres = "";
      let data = [];
      deudasFinales.forEach((d) => {
        ({ ultimaFecha, id, nombres, ...data } = d);

        let filtrandoData = nuevasFechas.find(
          (n) => d.ultimaFecha == n.ultimaFecha
        );
        if (filtrandoData) {
          filtrandoData.data.push(data);
        } else {
          nuevasFechas.push({
            ultimaFecha,
            id,
            nombres,
            data: [data],
          });
        }
      });

      //PASANDO DEL FORMATO DD/MM/YYYY A YYYY/MM/DD
      const convertDateToSortableFormat = (dateString) => {
        const [day, month, year] = dateString.split("/");
        return `${year}/${month}/${day}`;
      };

      // ORDENANDO DE MANERA DESCENDENTE POR FECHAS
      const sortedFechasAgrupadas = nuevasFechas.sort((a, b) => {
        const dateA = new Date(convertDateToSortableFormat(a.ultimaFecha));
        const dateB = new Date(convertDateToSortableFormat(b.ultimaFecha));
        return dateB - dateA;
      });

      //CREANDO UN NUEVO OBJETO PARA OBTENER LA INFO DE TODOS DE NUEVO
      const newObject = {
        ultimaFecha: "Todos",
        id: "New ID",
        nombres: "New Name",
        data: [
          {
            ultimoCambio: 0,
          },
        ],
        sumaUltimoCambio: 0,
      };
      setFechasAgrupadas(sortedFechasAgrupadas);

      setFechasAgrupadas((prevData) => [...prevData, newObject]);
    } /* else {
      console.log("no llegax2");
    } */
  }, [deudasInternos]);

  //SUMANDO LOS SALDOS DE LA MISMA FECHA
  useEffect(() => {
    if (fechasAgrupadas.length > 0) {
      fechasAgrupadas.forEach((deuda) => {
        let sumaUltimoCambio = 0;
        deuda.data.forEach((item) => {
          sumaUltimoCambio += item.ultimoCambio;
        });

        // Agregar la nueva propiedad "sumaUltimoCambio" al objeto actual
        deuda.sumaUltimoCambio = sumaUltimoCambio;
      });

      // Ahora cada objeto en deudasFinales tendrá una nueva propiedad "sumaUltimoCambio" con la suma de los valores en "data"
      setNuevosValores(fechasAgrupadas);
    }
  }, [fechasAgrupadas]);

  const handleChangeDeudaxFecha = (event) => {
    setFecha(event.target.value);
    if (event.target.value !== "Todos") {
      setDeudasFinales(
        rows.filter((row) => row.ultimaFecha.includes(event.target.value))
      );
    } else {
      setDeudasFinales(rows);
    }
  };

  useEffect(() => {
    if (fecha) {
      const found = nuevosValores.find(
        (element) => element.ultimaFecha == fecha
      );
      setSaldoxFecha(found.sumaUltimoCambio.toFixed(2));
    }
  }, [fecha]);

  const filtrarData = (value) => {
    setDeudasFinales(rows.filter((row) => row.id.includes(value)));
  };

  const descargarExcel = () => {
    csvExporter.generateCsv(rows);
  };

  const {
    navigate,
    moduleListasSelected,
    moduleHistoriaSelected,
    moduleManageSelected,
    moduleManageAudio,
    moduleDeudasItem,
    modulePope,
  } = props;

  return (
    <Box sx={{ display: "flex", flexDirecction: "row", width: "100%" }}>
      <Header
        navigate={navigate}
        moduleListasSelected={moduleListasSelected}
        moduleHistoriaSelected={moduleHistoriaSelected}
        moduleManageSelected={moduleManageSelected}
        moduleManageAudio={moduleManageAudio}
        moduleDeudasItem={moduleDeudasItem}
        moduleDeudasPope={modulePope}
        dbCon={props.dbCon}
      />
      <Box
        sx={{
          display: "flex",
          flexDirecction: "column",
          justifyContent: "center",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            pt: 10,
            columnGap: 2,
          }}
        >
          <Box sx={{ display: "flex" }}>
            {/* <TextField
              onChange={(evt) => {
                filtrarData(evt.target.value);
              }}
              id="outlined-basic"
              label="Cod Azulito"
              variant="outlined"
              defaultValue=""
              
            /> */}
            <TextField
              onChange={(evt) => {
                filtrarData(evt.target.value);
              }}
              label="Cod. Azulito"
              id="outlined-start-adornment"
              sx={{ m: 1, width: "25ch" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Paper sx={{ width: "50%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="simple table">
                <caption>Total de la Deuda es {deudaTotal.toFixed(2)}</caption>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell
                      sx={{ backgroundColor: "black", color: "white" }}
                    >
                      <b>Cod Azulito</b>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ backgroundColor: "black", color: "white" }}
                    >
                      <b>Nombres</b>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ backgroundColor: "black", color: "white" }}
                    >
                      <b>Deuda</b>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ backgroundColor: "black", color: "white" }}
                    >
                      <b>FechaDeuda</b>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ backgroundColor: "black", color: "white" }}
                    >
                      <Button
                        onClick={() => {
                          descargarExcel();
                        }}
                        variant="contained"
                      >
                        <DownloadIcon />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {deudasFinales &&
                    deudasFinales.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.nombres}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.ultimoCambio}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.ultimaFecha}
                        </StyledTableCell>
                        <StyledTableCell align="left"></StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Deuda Total"
              variant="outlined"
              defaultValue={0}
              value={deudaTotal.toFixed(2) || ""}
              disabled
            />
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Fecha</InputLabel>

                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  key={fechasAgrupadas.ultimaFecha}
                  value={fechasAgrupadas.ultimaFecha}
                  label="Fecha"
                  onChange={handleChangeDeudaxFecha}
                >
                  {fechasAgrupadas.map((f) => (
                    <MenuItem value={f.ultimaFecha}>{f.ultimaFecha}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ pt: 2 }}>
              <TextField
                id="outlined-basic"
                label="Deuda Semanal"
                variant="outlined"
                defaultValue={0}
                value={saldoxFecha || ""}
                disabled
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Deudas;
