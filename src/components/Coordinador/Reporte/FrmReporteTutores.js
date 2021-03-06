import React, { useState, useEffect } from "react";

import { Paper, Grid, makeStyles, Button } from "@material-ui/core";
import ComboBoxFacultades from "../FormRegistroTutor/ComboBoxFacultades";
import ComboBoxPrograma from "../FormRegistroTutor/comboBoxProgramas";
import * as Controller from "./../../../Conexion/Controller.js";
import { getUser } from "../../../Sesion/Sesion";
import ChartHorasDisponibilidad from "./ChartHorasDisponibilidad";
import ChartHorasTutoria from "./ChartHorasTutoria";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const useStyles = makeStyles((theme) => ({
  caja: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
}));

const FrmReporteTutores = () => {
  const classes = useStyles();
  const idCoordinador = getUser().usuario.ID_USUARIO;
  const rolCoordinador = getUser().idRol;

  const [disabled, setDisabled] = useState(true);

  const [facultades, setFacultades] = useState([]);
  const [facultad, setFacultad] = useState("");

  const [programas, setProgramas] = useState([]);
  const [programa, setPrograma] = useState("");

  const [nombres, setNombres] = useState([]);
  const [horas, setHoras] = useState([]);
  
  const [horas2, setHoras2] = useState([]);

  const [data, setData] = useState([]);

  const handleDescargar = async e => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    let fecha = await new Date();
    const fileName = 'Rep_Tutores'+fecha.getFullYear()+fecha.getMonth().toString()+fecha.getDate().toString();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { 'Tutores': ws }, SheetNames: ['Tutores'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const datos = await new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(datos, fileName + fileExtension);
  }

  //Funcion auxiliar para obtener las facultades del coordinador
  useEffect(() => {
    async function fetchFacultades() {
      let endpoint;
      if (rolCoordinador === 6) {
        endpoint = "/api/facultad/coordinador/" + idCoordinador;
      } else if (rolCoordinador === 2) {
        endpoint = "/api/facultad/lista/" + idCoordinador;
      }
      //console.log("endpoint: " + endpoint);

      const params = { servicio: endpoint };
      const res = await Controller.GET(params);
      //console.log(res);
      if (res){
        setFacultades(res.facultades);
        if(res.facultades[0]){
          if (rolCoordinador === 6){
            setFacultad(res.facultades[0].ID_PROGRAMA)
          }else{
            setFacultad(res.facultades[0].FACULTAD.ID_PROGRAMA)
          }          
        }
      }
    }
    fetchFacultades();
  }, [rolCoordinador, idCoordinador]);

  //Funcion para obtener los programas de una facultad
  useEffect(() => {
    async function fetchProgramas() {
      let endpoint;
      if (rolCoordinador === 6) {
        endpoint = "/api/programa/lista/" + facultad;
      } else if (rolCoordinador === 2) {
        endpoint = "/api/programa/lista/" + idCoordinador + "/" + facultad;
      }
      const params = { servicio: endpoint };
      const res = await Controller.GET(params);

      //console.log("enpoint programa: " + endpoint);
      //console.log("res de programas: ");
      //console.log("=========");
      //console.log(res);
      //console.log("=========");

      if (res !== null) {
        if (rolCoordinador === 6) {
          //console.log("asignando programa");
          //console.log(res);
          if (res){
            setProgramas(res.programa);
            if(res.programa[0]){
              setPrograma(res.programa[0].ID_PROGRAMA)
              console.log("asdf", programa)
            }
          }          
        } else if (rolCoordinador === 2) {
          //console.log("asignando programas");
          //console.log(res);
          if (res){
            setProgramas(res.programas);
            if(res.programas[0]){
              setPrograma(res.programas[0].ID_PROGRAMA)
              console.log("asdf", programa)
            }
          }
        }
      }
    }
    if (facultad !== "") {
      fetchProgramas();
    }
  }, [facultad]);

  //Funcion para obtener los datos de las encuestas
  useEffect(() => {
    async function fetchResultados() {
      let endpoint = "/api/disponibilidadvssesiones/" + programa;
      const params = { servicio: endpoint };
      const res = await Controller.GET(params);
      
      if(res){
        if (res.motivosSolicitud !== []) {
          setData(res.motivosSolicitud.map((item) => item));
          setNombres(res.motivosSolicitud.map((item) => item.TUTOR));
          setHoras2(res.motivosSolicitud.map((item) => item["SESIONES_BRINDADAS(HORAS)"]));
          setHoras(res.motivosSolicitud.map((item) => item["DISPONIBILIDAD(HORAS)"]));
        }
      }
    }
    if (programa !== "") {
      fetchResultados();
    }
  }, [programa]);

  return (
    <Grid
      container
      // direction="column"
      spacing={5}
      md={12}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12} md={8}>
        <Paper className={classes.caja}>
          <Grid container spacing={5} justify="center" alignItems="center">
            <Grid item xs={12} md={4}>
              <ComboBoxFacultades
                programas={facultades}
                programa={facultad}
                setPrograma={setFacultad}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ComboBoxPrograma
                programas={programas}
                programa={programa}
                setPrograma={setPrograma}
              />
            </Grid>
            <Grid item xs={12} md={2} style={{marginRight:"1%"}}>
            <Button id = "btnGuardar" color="primary" variant="contained" onClick = {(e) => handleDescargar(e)} disabled = {!data.length}>
                Descargar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
        <Grid item xs={12} md={6}>
          <ChartHorasDisponibilidad
          labels={nombres}
          data={horas}
        />
        </Grid>

        <Grid item xs={12} md={6}>
            <ChartHorasTutoria
            labels={nombres} 
            data={horas2} />
        </Grid>
        
      
    </Grid>
  );
};

export default FrmReporteTutores;
