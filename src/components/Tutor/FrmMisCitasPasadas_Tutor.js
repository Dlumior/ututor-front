import React, { Component } from "react";
import * as Controller from "../../Conexion/Controller";
import TablaCitasPasadas from "../Alumno/AgendarCita/CitasPasadas/TablaCitasPasadas";

import { getUser } from "../../Sesion/Sesion"
import { Button } from "@material-ui/core";

class FrmMisCitasPasadas_Tutor extends Component {
    constructor() {
        super();

        this.state = {
            sesiones: {
                columns: [{
                    title: "Nombre",
                    field: "nombre",
                }],
                data: [{ nombre: "" }]
            }, 
            open: false,
            alert: {
                mensajeStrong: "",
                mensajeStrongError: "Por favor revísalos",
                mensajeStrongExito: "Satisfactoriamente",
                mensajeError: "Existen errores al completar el formulario",
                mensajeExito: "Se modificaron los datos de la institucion",
                mensaje: "",
              },
            severidad: "warning",
        };

        this.establecerData=this.establecerData.bind(this);
        this.handleOnOpen=this.handleOnOpen.bind(this);
    };
    
    handleOnOpen= (e) =>{
        this.setState({ open: true });
    }

    establecerData(arregloDeSesiones) {
        let arreglillo = [];
        let cont = 0;
        for (let element of arregloDeSesiones.data) {
            //cont++;
            let estadillo = element.ESTADO.split("-")[0];
            if (estadillo=="020"){
                cont++;
                arreglillo.push({
                    campoCont: cont,
                    nombre: element.ALUMNOs ? element.ALUMNOs[0].USUARIO.NOMBRE + " " + element.ALUMNOs[0].USUARIO.APELLIDOS : "",
                    fecha: element.FECHA + " / " + element.HORA_INICIO + " - " + element.HORA_FIN,                    
                    campoLugar: element.LUGAR,
                    tipoTutoria: "on process...",//element.PROCESO_TUTORIum.NOMBRE,
                    campoResultados: 
                    <div>
                        <Button
                            size="large"
                            variant="outlined"
                            color="secondary"                        
                            onClick={() => this.handleOnOpen(element.ID_SESION)}
                            disabled
                        >
                            Resultados
                        </Button>

                    </div>
                    
                });

            }
        }

        const data = {
            columns: [
                {
                    title: "N°",
                    field: "campoCont",

                },
                {
                    title: "Alumno",
                    field: "nombre",
                },
                {
                    title: "Fecha / Hora",
                    field: "fecha"
                },
                {
                    title: "Lugar",
                    field: "campoLugar"
                },
                {
                    title: "Tipo Tutoria",
                    field: "tipoTutoria"
                },
                {
                    title: "Resultados",//Resumen
                    field: "campoResultados"//campoEncuesta
                },              

            ],
            data: arreglillo
        };

        this.setState({ sesiones: data });
    }

    async componentDidMount() {
        console.log("ID TUTOR: ", getUser().usuario.ID_USUARIO);
        console.log("SERVICIO: ", "/api/listaSesiones/" + getUser().usuario.ID_USUARIO);
        let arregloDeSesiones = await Controller.GET({ servicio: "/api/listaSesiones/" + getUser().usuario.ID_USUARIO});
        console.log("sesiones tutor: ", arregloDeSesiones);
        this.establecerData(arregloDeSesiones);
    }

    render() {
        return (
            <div>
                <TablaCitasPasadas tutores={this.state.sesiones} />
            </div>
        );
    }

}

export default FrmMisCitasPasadas_Tutor;
