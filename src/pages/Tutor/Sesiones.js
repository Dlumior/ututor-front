import React, { Component } from "react";
import NombrePrincipal from "../../components/Shared/NombrePrincipal";
import RegistrarSesion from "../../components/Tutor/Sesion/RegistrarSesion";
import TabProceso from "../../components/Coordinador/Tutorias/TabProceso";
import FrmSolicitarTutorTipoII from "../../components/Alumno/FrmSolicitarTutorTipoII.js";
import FrmSolicitarCitaTutor_granito from "../../components/Alumno/FrmSolicitarCitaTutor_granito.js";
import CalendarioCitas from "../../components/Alumno/AgendarCita/CalendarioCitas";
import { UserContext, getUser } from "../../Sesion/Sesion";
import BtnRegistroSesionGrupal from "../../components/Tutor/RegistroSesionGrupal/BtnRegistroSesionGrupal";
import { Grid, Paper } from "@material-ui/core";

const estilo={
  sesion:{
    minHeight: "1000px",
    backgroundColor: "#ffffff",
  }
}
class Sesiones extends Component {
  constructor() {
    super();
    this.state = {
      procesos: [
        {
          titulo: "Calendario de citas",
          procesos: [
            {
              index: 0,
              titulo: "Sesiones con tus alumnos",
              proceso: () => (
                <CalendarioCitas
                  servicio={
                    "/api/listaSesiones/" + getUser().usuario.ID_USUARIO + "/"
                  }
                  tipo="cita"
                />
              ),
            },
          ],
        },
      ],
    };
    this.renderxTipoProceso = this.renderxTipoProceso.bind(this);
  }
  renderxTipoProceso() {
    if (this.props.multiProceso) {
      //switch(this.props.multiProceso)
      //console.log("multiProceso: ", this.props.multiProceso);
    }
    return (
      <div>
        {/*Aca habria una especia de if para ver que formulario abrir de acuerdo al tipo de tutoria 
              <FormSolicitarTuror tipo = idTipo... +o->     */}
        {/** exacto y lo unico que se debe reemlazar seria los procesos que van a los tabs,
         *  btw tabbproceso si soporta no mostrar tabs XDDD*/}

        <NombrePrincipal titulo={this.state.procesos[0].titulo} botonRegistrar={RegistrarSesion} />
          <TabProceso procesos={this.state.procesos[0].procesos} paper={false} />
        
        
        {/*<FrmSolicitarTutorTipoII />*/}
        {/*//Tipo II : tutoria INDIVIDUAL, tutor FIJO y SELECCIONADO */}
      </div>
    );
  }
  render() {
    return this.renderxTipoProceso();
  }
}

export default Sesiones;
