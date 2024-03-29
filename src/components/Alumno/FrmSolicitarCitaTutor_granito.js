import React, { Component } from "react";
import * as Controller from "./../../Conexion/Controller";
import { Paper, Tabs, Tab, Button, Grid, Dialog } from "@material-ui/core";
import TablaTutores from "./TablaTutores.js";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import FrmDialogoSolicitarTutor from "./FrmDialogoSolicitarTutor";
import { getUser } from "../../Sesion/Sesion";


const style = {
    paper: {
        marginTop: "3%",
        marginLeft: "3%",
        marginRight:"3%",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        backgroundImage: "",
    }
};


class FrmSolicitarCitaTutor_granito extends Component {
    constructor() {
        super();
        this.state = {
            tutores: {
                columns: [{
                    title: "Nombre",
                    field: "nombre",
                }],
                data: [{ nombre: "" }]
            }, //aqui va el nombre de la tablilla
            openVerDispo: false,

        };

        this.handleOnClickVerDispo = this.handleOnClickVerDispo.bind(this);
        this.handleOnCloseVerDispo = this.handleOnCloseVerDispo.bind(this);
    };


 

    //=============================================================
    handleOnClickVerDispo(e,_id,_nombre) {
        //this.setState( {openVerDispo : true});

        this.props.handleFiltroTutor({id:_id,nombre:_nombre});
        this.props.modoBatallador(true);
    }

    handleOnCloseVerDispo() {
        ////console.log("ctm",this.state.openSolicitarTutor);
        this.setState( {openVerDispo : false});
    }

    async componentDidMount() {
        let arregloDeTutores = 
        await Controller.GET({ servicio: "/api/tutor/lista/"+getUser().usuario.ROL_X_USUARIO_X_PROGRAMAs[0].ID_PROGRAMA });
        /**if arreglo ttores hago lo q esta sino le meto s harcodeo */
        //console.log("arreglo: ", arregloDeTutores);

        let arreglillo = [];
        let cont = 0;
        for (let element of arregloDeTutores.tutores) {
            cont++;
            arreglillo.push({
                campoCont:cont,
                /*
                imagen: <div>
                <img
                    style={estilo.imagen}
                    src="https://files.pucp.education/profesor/img-docentes/tupia-anticona-manuel-francisco-19931850.jpg">
                </img>
                
                </div>,
                */
                //numeroOrden: cont,
                nombre: element.USUARIO?element.USUARIO.NOMBRE + " " + element.USUARIO.APELLIDOS:"Manuel",
                correo: element.USUARIO?element.USUARIO.CORREO:"m.tupia@pucp.edu.pe",
                /*rboton: <div>
                    <input
                        type="radio"
                        id="age1"
                        name="tutor"
                        value={element.ID_TUTOR}>
                    </input>
                </div>,*/
                btnVerDisponibilidad:
                <Button
                    size="large"
                    variant="outlined"
                    color="secondary"
                    //onClick={this.handleOnClickVerDispo}
                    onClick={(e)=>this.handleOnClickVerDispo(e,element.ID_TUTOR,element.USUARIO.NOMBRE + " " + element.USUARIO.APELLIDOS)}

                >
                    Ver Disponibilidad
                </Button>,
            });
        }

        /*arregloDeTutores.forEach(element => {
            arreglillo.push({nombre:element.USUARIO.NOMBRE+" "+element.USUARIO.APELLIDOS,
                            correo:element.USUARIO.CORREO});       

        }); */

        const data = {
            columns: [
                {
                    title:"N°",
                    field:"campoCont",
                },
                /*
                {
                    title: "",
                    field: "imagen",
                },
                */
                {
                    title: "Tutor",
                    field: "nombre",
                },
                {
                    title: "Correo",
                    field: "correo"
                },
                /*
                {
                    title: "",
                    field: "rboton"
                },
                */
                {
                title: "",
                field: "btnVerDisponibilidad",
                },
             
                /*  {},{},{}.... para mas columnas  */
            ],
            data: arreglillo
            /*
            [       
              { nombre: "Alva Nuñez",correo :"ing informatica" },
              { nombre: "Pedro Arce" ,correo :"ing informatica2"},
              { nombre: "Alfredo Gomez",correo :"ing informatica3" },
              { nombre: "Bill Grace",correo :"ing informatica4" },
              { nombre: "Camilo Echeverry" ,correo :"ing informatica5"},
            ],*/

        };

        this.setState({ tutores: data });

    }

    render() {
        ////console.log("propsFormTipoII:", this.props);
  
        return (
            <div>                
                <Paper elevation={0} style={style.paper}>                    
                    {/*<TablaTutores  tutores={arregloDeTutores}  />*/}
                    <TablaTutores tutores={this.state.tutores} />    
                </Paper>
                
                <Dialog
                    open={this.state.openVerDispo}
                    onClose={this.handleOnCloseVerDispo}
                    aria-labelledby="form-dialog-title"
                >                  
                    <DialogContent>                     
                        <h3>Regresar al filtro x este tutor</h3>
                    </DialogContent>
           
                    <DialogActions>
                        <Button                            
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={this.handleOnCloseVerDispo}                        >
                            Oki Doki 
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default FrmSolicitarCitaTutor_granito;

const estilo = {
    imagen: {
        width: "30%",
        borderRadius: "100%",
    }
}
















