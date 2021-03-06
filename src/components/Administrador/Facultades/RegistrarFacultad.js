import React, { Component, useEffect,useState } from "react";
import * as Conexion from "../../../Conexion/Controller";
//import useFetchData from "../../Conexion/useFetchData";
import ListaProgramas from "../../Coordinador/ListaProgramas";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, Paper, makeStyles, Typography } from "@material-ui/core";
import { GET } from "../../../Conexion/Controller";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Alertas from "../../Coordinador/Alertas"
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';


import errorObj from "../../Coordinador/FormRegistroTutor/errorObj";
import validateName from "../../Coordinador/FormRegistroTutor/validateName.js";
import { getUser } from "../../../Sesion/Sesion";

const useStyles = makeStyles((theme) => ({
  foto: {
    backgroundImage:
      "url(https://pps.whatsapp.net/v/t61.24694-24/97969579_3102912936463371_7208379054937379558_n.jpg?oe=5EC495F5&oh=68e4ca58a0f65f680df95105f6ba41ae)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    alignItems:"center",
    padding: theme.spacing(5),
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

const handleName = (e, datosForm, setDatosForm, errors, setErrors) => {
    setDatosForm({
      ...datosForm,
      NOMBRE: e.target.value,
    });
    const res = validateName(e.target.value);
    setErrors({ ...errors, name: res });
};

const handleDiasDisponibilidad = (e, datosForm, setDatosForm) => {
  setDatosForm({
    ...datosForm,
    DIAS_DISP: e.target.value,
  });
};

const RegistrarFacultad = (props) => {
  const {flag,setFlag}=props;
  const [datosForm, setDatosForm] = React.useState({
    ID_INSTITUCION:"1",
    NOMBRE: "",
    IMAGEN: null,
    INDEPENDIENTE:0,
    DIAS_DISP:0
  });

  const [alerta, setAlerta]=useState({
    mensajeStrong: "",
    mensajeStrongError: "por favor revisalos!",
    mensajeStrongExito: "satisfactoriamente!",
    mensajeError: "Existen errores al completar el formulario",
    mensajeExito: "Facultad registrada",
    mensaje: "",
  });
  const [severidad, setSeveridad] = useState({
    severidad:"",
    severW:"warning",
    severE:"error",
    severS:"success"
  });

  const [errors, setErrors] = useState(errorObj);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [selectedValue, setSelectedValue] = React.useState();
  const [checked, setChecked] = React.useState(false);

  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
    //agregar condicion para que cree una programa unico asignado a esa facultad
  };


  const handleClickOpen = () => {
    setOpen(true);
    setChecked(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSeveridad({
      severidad:"",
    });     
    setAlerta({
      mensaje:"",
    }); 
    setChecked(false);
    setErrors(errorObj);
  };

  const handleClick = async (e, datosForm, setDatosForm) => {
    if (
      errors.name.error || datosForm.NOMBRE===''
    ) {
      setSeveridad({
        severidad:severidad.severE,
      });     
      setAlerta({
        mensaje:"Existen errores al completar el formulario",
      });      
      //console.log("severidad= ",severidad.severidad);
      return;
    } else {
      if (checked){
        datosForm.INDEPENDIENTE=1;
      }else{
        datosForm.INDEPENDIENTE=0;
      }
      setDatosForm({
        ...datosForm
      });
      //console.log(datosForm);

      const props = { servicio: "/api/facultad", request: {facultad: datosForm} };
      //console.log("saving new coord in DB:", datosForm);
      let nuevaFacu = await Conexion.POST(props);
      //console.log("got updated coord from back:", nuevaFacu);

      //si se registro bien ok==1, duplicado ok===0, otro error=-1
      if (nuevaFacu){
        if(nuevaFacu.registro.ok===1){
          var idProg=nuevaFacu.registro.facultad.ID_PROGRAMA; 
          setSeveridad({
            severidad:"success",
          });     
          setAlerta({
            mensaje:"Facultad registrada",
          });      
          //console.log("severidad= ",severidad.severidad);
          setFlag(flag => flag +1);
  
        }else if(nuevaFacu.registro.ok===0){
          setSeveridad({
            severidad:"error",
          });     
          setAlerta({
            mensaje:"La Facultad ya ha sido registrada",
          });      
  
        }else{
          setSeveridad({
            severidad:"error",
          });     
          setAlerta({
            mensaje:"Existen errores al completar el formulario",
          });      
        }
      }
      
    }  
  };

  return (
    <div>
      <Button 
        variant="contained"
        color="primary"
        onClick={handleClickOpen}>
        Registrar
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
      <Alertas
        severity={severidad.severidad}
        titulo={"Observacion:"}
        alerta={alerta}
      />
        <DialogTitle id="form-dialog-title">
        <Grid container md={12} spacing={1}>
            <Grid item md={11} >
              Formulario de Registro de Facultad
            </Grid>
            <Grid item md={1} alignContent="flex-end">
              <CloseRoundedIcon onClick={handleClose}/>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={12}>
            <Grid item md={12} sm container>
            <Grid item xs container direction="column" justify={"center"} spacing={2}>
              <Grid item xs>
                <TextField
                  required
                  error={errors.name.error}
                  margin="dense"
                  id="NOMBRE"
                  label="Nombre"
                  fullWidth
                  onChange={(e) => handleName(e, datosForm, setDatosForm, errors, setErrors)}
                  helperText={errors.name.mesage}
                />
              </Grid>
              <Grid item>
                {getUser().rol!=="Administrador" &&
                  <TextField
                  //required
                  //error={errors.name.error}
                  margin="dense"
                  id="antDias"
                  label="Días de anticipación al registrar disponibilidad"
                  fullWidth
                  onChange={(e) => handleDiasDisponibilidad(e, datosForm, setDatosForm)}
                  type= "number"
                  defaultValue = {0}
                  inputProps = {{min: 0}}                  
                  //helperText={errors.name.mesage}
                />}
              </Grid>
            <Grid item>
            <Checkbox
              checked={checked}
              onChange={handleChangeChecked}
              color="primary"
              label="Facultad Independiente"
            />
            <Typography variant="h7" align="center">
                {" "}Facultad Independiente
            </Typography>
            </Grid>
            </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="outlined"
            onClick={handleClose} color="primary">
            Cancelar
          </Button>

          <Button 
            variant="contained"
            onClick={(e) => handleClick(e, datosForm, setDatosForm)}
            color="primary"
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default RegistrarFacultad;
