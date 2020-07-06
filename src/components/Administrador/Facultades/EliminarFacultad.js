import React, { Component, useEffect,useState } from "react";
import * as Conexion from "../../../Conexion/Controller";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";  
import { Grid, Paper, makeStyles, Typography } from "@material-ui/core";

import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import {getUser} from "../../../Sesion/Sesion";

const EliminarCoordinador = (props) => {
  const {open,close,id}=props;
  const [elimino, setElimino] = useState(false);
  const [alerta, setAlerta]=useState({
    mensajeStrong: "",
    mensajeStrongError: "por favor revisalos!",
    mensajeStrongExito: "satisfactoriamente!",
    mensajeError: "Existen errores al completar el formulario",
    mensajeExito: "Coordinador registrado",
    mensaje: "",
  });
  const [severidad, setSeveridad] = useState({
    severidad:"",
    severW:"warning",
    severE:"error",
    severS:"success"
  });
 

  const handleClick = async (e) => {    
      /*FACULTAD ELIMINAR FALTA
      console.log("idCoord",id);
      let enlace;
      console.log("ROL:",getUser().rol);
      if (getUser().rol==="Administrador"){
        enlace="/api/coordinadorfacultad/eliminar/"+id;
      }else{
        enlace="/api/coordinador/eliminar/"+id;
      }
      const props = { servicio: enlace };
      let resultado = await Conexion.POST(props);
      console.log("got updated coord from back:", resultado);
      if (resultado.status!=="success"){
        setElimino(false);
      }else{
        setElimino(true);
      }    
      */
     setElimino(true);
  };


  return (
    <div>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Grid container md={12} justify="center">
              {!elimino && <CancelRoundedIcon color="error" style={{ fontSize: 70 }}/>}
              {elimino && <CheckCircleRoundedIcon color="primary" style={{ fontSize: 70 }}/>}
          </Grid>
        </DialogTitle>
        <DialogContent>
            <Grid container md={12} justify="center">
              {!elimino &&
                <Typography variant="h6" >
                ¿Esta seguro de eliminar la facultad?
            </Typography>}
            {elimino &&
              <Typography variant="h6" >
                La facultad se elimino satisfactoriamente
            </Typography>}
            </Grid>
        </DialogContent>       
        <DialogActions>
          <Button 
            variant="outlined"
            onClick={close} color="inherit">
            Cancelar
          </Button>

          <Button 
            variant="contained"
            onClick={!elimino? (e) => handleClick(e): close}
            color="primary"
          >
            {!elimino && "Eliminar"}
            {elimino && "Aceptar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default EliminarCoordinador;