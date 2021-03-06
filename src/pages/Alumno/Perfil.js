import React, { useState, useRef } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { getUser } from "../../Sesion/Sesion";
import ImgAlumno from "../../components/Alumno/alumno.png";
import CabeceraPerfil from "../../components/Shared/CabeceraPerfil";
import { POST } from "../../Conexion/Controller";
import Datos from "../../components/Coordinador/Datos";
import FrmPlanAccion from "../../components/Alumno/Perfil/FrmPlanAccion";
import TabProceso from "../../components/Coordinador/Tutorias/TabProceso";
import DatosGenerales from "../../components/Alumno/Perfil/DatosGenerales";
import FrmResultados from "../../components/Alumno/Perfil/FrmResultados";
import Asistencias from "../../components/Alumno/Perfil/Asistencias";

import HistoricoResultados from "../../components/Alumno/Perfil/HistoricoResultados";
import VerInformacionRelevante from "../../components/Coordinador/FormRegistroAlumno/VerInformacionRelevante";

const useStyles = makeStyles((theme) => ({
  customContainer: {
    marginTop: theme.spacing(5),
  },
}));

const handleClick = () => {
  let usuario = { ...JSON.parse(sessionStorage.Sesion) };
  usuario.rol = "Alumno";
  sessionStorage.Sesion = JSON.stringify(usuario);
  //console.log("Nuevo rol: ", JSON.parse(sessionStorage.Sesion).rol);
};

const Perfil = (props) => {
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);
  const { ID_USUARIO, NOMBRE, APELLIDOS } = getUser().usuario;
  const procesos = [
    { index: 0, titulo: "Datos Generales", proceso: DatosGenerales, paper:false },
    { index: 1, titulo: "Plan de Acción", proceso: FrmPlanAccion },
    { index: 2,
      titulo: "Resultados",
      proceso: () => (
        <HistoricoResultados
          datosAlumno={{ idAlumno: ID_USUARIO, fullname: `${NOMBRE} ${APELLIDOS}` }}
        />
      ),
    },
    { index: 3, titulo: "Asistencias", proceso: () => (
      <Asistencias
        datosAlumno={{ idAlumno: ID_USUARIO, fullname: `${NOMBRE} ${APELLIDOS}` }}
      />
    ),
   },
   { index: 4, titulo: "Infomación Relevante", proceso: () => (
    <VerInformacionRelevante
      usuario={getUser().usuario}
      idAlumno={ID_USUARIO}
    />
  ),
 },
  ];

  const dir = useRef(null);
  const tel = useRef(null);

  const handleEdit = (e) => {
    setIsEdit(true);
  };

  const handleGuardar = async () => {
    setIsEdit(false);

    const datos = {
      ID_USUARIO: getUser().usuario.ID_USUARIO,
      TELEFONO: tel.current.value,
      DIRECCION: dir.current.value,
    };
    const sendData = {
      servicio: "/api/usuario/actualizarperfil",
      request: { usuario: datos },
    };

    //console.log("Saving new info in DB:", datos);
    let edited = await POST(sendData);
    if (edited !== null) {
      //console.log("Got updated user from back:", edited);
      alert("Se guardaron los cambios correctamente");
    } else {
      //console.log("Hubo un error");
    }
  };

  return (
    <div>
      <CabeceraPerfil
        titulo="Alumno"
        nombre={getUser().usuario.APELLIDOS + ", " + getUser().usuario.NOMBRE}
      />
      <TabProceso procesos={procesos} paper={true}/>
    </div>
  );
};

export default Perfil;
