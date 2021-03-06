import React, { useState, useEffect } from "react";
import { Paper, Grid, TextField, Button, makeStyles } from "@material-ui/core";

import * as Controller from "./../../../Conexion/Controller.js";
import errorObj from "./errorObj.js";
import validateName from "./validateName.js";
import validateLastNames from "./validateLastNames.js";
import validatePhoneNumber from "./validatePhoneNumber.js";
import validateAddress from "./validateAddress.js";
import validateCode from "./validateCode.js";
import validateEmail from "./validateEmail.js";
import ComboBoxPrograma from "./comboBoxProgramas.js";
import { getUser } from "../../../Sesion/Sesion.js";
import ComboBoxFacultades from "./ComboBoxFacultades.js";
import Alertas from "../Alertas.jsx";

const useStyles = makeStyles((theme) => ({
  caja: {
    // marginTop: theme.spacing(3),
    padding: theme.spacing(5),
    width: theme.spacing(150),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
      width: theme.spacing(40),
    },
    // height: theme.spacing(55),
  },
}));

const handleName = (e, datos, setDatos, errors, setErrors) => {
  const auxName = e.target.value;

  setDatos({
    ...datos,
    NOMBRE: auxName,
  });

  const res = validateName(auxName);
  setErrors({ ...errors, name: res });
};

const handleLastName = (e, datos, setDatos, errors, setErrors) => {
  const auxLastNames = e.target.value;

  setDatos({
    ...datos,
    APELLIDOS: auxLastNames,
  });

  const res = validateLastNames(auxLastNames);
  setErrors({ ...errors, lastnames: res });
};

const handleEmail = (
  e,
  datos,
  setDatos,
  errors,
  setErrors,
  dominio1,
  dominio2
) => {
  const auxEmail = e.target.value;

  setDatos({
    ...datos,
    CORREO: auxEmail,
    USUARIO: auxEmail,
  });

  const res = validateEmail(auxEmail, dominio1, dominio2);
  setErrors({ ...errors, email: res });
};

const handlePhoneNumber = (e, datos, setDatos, errors, setErrors) => {
  const auxPhone = e.target.value;

  setDatos({
    ...datos,
    TELEFONO: auxPhone,
  });

  const res = validatePhoneNumber(auxPhone);
  setErrors({ ...errors, phoneNumber: res });
};

const handleAddress = (e, datos, setDatos, errors, setErrors) => {
  const auxAddress = e.target.value;

  setDatos({
    ...datos,
    DIRECCION: auxAddress,
  });

  const res = validateAddress(auxAddress);
  setErrors({ ...errors, address: res });
};

const handleCode = (e, datos, setDatos, errors, setErrors) => {
  const auxCode = e.target.value;

  setDatos({
    ...datos,
    CODIGO: auxCode,
  });

  const res = validateCode(auxCode);
  setErrors({ ...errors, code: res });
};

const FormRegistroTutor = (props) => {
  const classes = useStyles();
  const idCoordinador = getUser().usuario.ID_USUARIO;
  const rolCoordinador = getUser().idRol;

  const [disabled, setDisabled] = useState(true);

  const { datos, setDatos, handleClose } = props;
  const [errors, setErrors] = useState(errorObj);

  const [facultades, setFacultades] = useState([]);
  const [facultad, setFacultad] = useState("");

  const [programas, setProgramas] = useState([]);
  const [programa, setPrograma] = useState("");

  const [dominio1, setDominio1] = useState("");
  const [dominio2, setDominio2] = useState("");

  const [severidad, setSeveridad] = useState("");
  const [alerta, setAlerta] = useState({ mensaje: "" });

  useEffect(() => {
    async function fetchTutores() {
      let institucion = await Controller.GET({ servicio: "/api/institucion" });
      //console.log("RegistrarTutor institucion: ", institucion);
      if (!institucion.institucion) return;
      setDominio1(institucion.institucion.DOMINIO);
      setDominio2(institucion.institucion.DOMINIO2);
      //console.log("RegistrarTutor dominio1: ", dominio1);
      //console.log("RegistrarTutor dominio2: ", dominio2);
    }

    fetchTutores();
  }, [dominio1, dominio2]);

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
      if (res) {
        setFacultades(res.facultades);
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
          if (res) {
            setProgramas(res.programa);
          }
        } else if (rolCoordinador === 2) {
          //console.log("asignando programas");
          //console.log(res);
          if (res) {
            setProgramas(res.programas);
          }
        }
      }
    }
    if (facultad !== "") {
      fetchProgramas();
    }
  }, [facultad]);

  const handleClick = async (e, datos, setDatos) => {
    // new Promise(async (resolve, reject) => {
    //aquii
    if (
      errors.name.error ||
      errors.lastnames.error ||
      errors.email.error ||
      errors.phoneNumber.error ||
      errors.address.error ||
      errors.code.error ||
      datos.APELLIDOS === "" ||
      datos.NOMBRE === "" ||
      datos.CORREO === "" ||
      datos.CODIGO === "" ||
      programa === ""
    ) {
      // alert("Hay errores en los campos");
      setSeveridad("error");
      setAlerta({
        mensaje: "Existen errores en el formulario",
      });
      return;
    } else {
      // await setDatos({
      //   ...datos,
      //   // CONTRASENHA: "contra",
      //   PROGRAMA: [programa],
      // });
      //console.log(datos);

      const sendData = {
        servicio: "/api/tutor",
        request: { tutor: { ...datos, PROGRAMA: [programa] } },
      };
      //console.log("Saving new tutor in DB:", sendData);
      let nuevoTutor = Controller.POST(sendData);
      //console.log("Got updated alumno from back:", nuevoTutor);
      //console.log("Got updated alumno from back:", nuevoTutor.error);
      if (
        nuevoTutor === null ||
        nuevoTutor === undefined ||
        nuevoTutor.error !== undefined
      ) {
        if (nuevoTutor.error !== undefined) {
          setSeveridad("error");
          setAlerta({
            mensaje: nuevoTutor.error,
          });
        } else if (nuevoTutor === null) {
          setSeveridad("error");
          setAlerta({
            mensaje: "Algo salió mal :(",
          });
        }
      } else {
        setSeveridad("success");
        setAlerta({
          mensaje: "Se registró correctamente el tutor",
        });
      }
    }
    await setTimeout(async () => {
      handleClose();
    }, 3000);
    // resolve();
    // });

    // new Promise(async (resolve, reject) => {
    //   await setTimeout(async () => {
    //     handleClose();
    //   }, 3000);
    //   resolve();
    // });
  };

  return (
    <Paper className={classes.caja} variant="outlined">
      <Alertas severity={severidad} titulo={"Observacion:"} alerta={alerta} />
      <Grid
        container
        direction="column"
        spacing={4}
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} container spacing={10}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              error={errors.name.error}
              margin="dense"
              id="nombres"
              label="Nombres"
              type="text"
              fullWidth
              onChange={(e) =>
                handleName(e, datos, setDatos, errors, setErrors)
              }
              helperText={errors.name.mesage}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              error={errors.lastnames.error}
              margin="dense"
              id="apellidos"
              label="Apellidos"
              type="text"
              fullWidth
              onChange={(e) =>
                handleLastName(e, datos, setDatos, errors, setErrors)
              }
              helperText={errors.lastnames.mesage}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={10}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              error={errors.email.error}
              margin="dense"
              id="email"
              label="Correo"
              type="email"
              fullWidth
              onChange={(e) =>
                handleEmail(
                  e,
                  datos,
                  setDatos,
                  errors,
                  setErrors,
                  dominio1,
                  dominio2
                )
              }
              helperText={errors.email.mesage}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={errors.phoneNumber.error}
              margin="dense"
              id="telefono"
              label="Teléfono"
              type="text"
              fullWidth
              onChange={(e) =>
                handlePhoneNumber(e, datos, setDatos, errors, setErrors)
              }
              helperText={errors.phoneNumber.mesage}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={10}>
          <Grid item xs={12} md={6}>
            <TextField
              error={errors.address.error}
              margin="dense"
              id="direccion"
              label="Dirección"
              type="text"
              fullWidth
              onChange={(e) =>
                handleAddress(e, datos, setDatos, errors, setErrors)
              }
              helperText={errors.address.mesage}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              error={errors.code.error}
              margin="dense"
              id="codigo"
              label="Código"
              type="text"
              fullWidth
              onChange={(e) =>
                handleCode(e, datos, setDatos, errors, setErrors)
              }
              helperText={errors.code.mesage}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={10}>
          <Grid item xs={12} md={6}>
            <ComboBoxFacultades
              programas={facultades}
              programa={facultad}
              setPrograma={setFacultad}
              setDisabled={setDisabled}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ComboBoxPrograma
              disabled={disabled}
              programas={programas}
              programa={programa}
              setPrograma={setPrograma}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          container
          justify="flex-end"
          alignItems="center"
          // spacing={10}
        >
          <Grid item xs={2}>
            <Button color="primary" variant="outlined" onClick={handleClose}>
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              color="primary"
              variant="contained"
              onClick={(e) => handleClick(e, datos, setDatos)}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FormRegistroTutor;
